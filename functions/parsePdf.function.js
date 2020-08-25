const functions = require('firebase-functions')
const mkdirp = require('mkdirp-promise')
const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId
const storage = admin.storage()
const path = require('path')
const os = require('os')
const fs = require('fs')
var rp = require('request-promise')
const parseContent = require('./parseContent')
const generateDeleteBatch = require('./generateDeleteBatch')
const generateDocumentBatch = require('./generateDocumentBatch')
const cloudSearchDownload = require('./cloudSearchDownload')
const cloudSearchUpload = require('./cloudSearchUpload')
const logStatus = require('./logStatus')

exports = module.exports = functions
  .runWith({ memory: '2GB', timeoutSeconds: 540 })
  .storage.object()
  .onFinalize(async object => {
    const PDF_EXTENSION = '.pdf'
    const originalPdfPath = object.name
    const newPdfPath = originalPdfPath.replace(/\s+/g, '_') // Replace whitespace to avoid errors
    const originalUploadDir = path.dirname(originalPdfPath)
    const originalPdfBasename = path.basename(originalPdfPath, PDF_EXTENSION)
    const newPdfBasename = path.basename(newPdfPath, PDF_EXTENSION)
    const extension = path.extname(originalPdfPath)
    const contentType = object.contentType

    // If the uploaded file does not have the PDF content type, ignore it
    if (!contentType.includes('pdf')) {
      return null
    }

    // If the uploaded file does not have a pdf extension, ignore it
    if (extension !== PDF_EXTENSION) {
      return null
    }

    // If the uploaded file is in the output directory, ignore it
    if (originalUploadDir.startsWith('output')) {
      return null
    }

    console.log(`Starting processing for file ${originalPdfBasename}`)

    const bucket = storage.bucket(object.bucket)
    const file = bucket.file(originalPdfPath)
    const tempLocalFile = path.join(os.tmpdir(), originalPdfPath)
    const tempLocalDir = path.dirname(tempLocalFile)

    // Make local directory for putting the PDF into
    await mkdirp(tempLocalDir)

    // Download the PDF to temp directory
    await bucket.file(originalPdfPath).download({ destination: tempLocalFile })
    await logStatus(newPdfBasename, { fileDownload: 'success' })

    // Check if rename is needed
    if (originalPdfPath !== newPdfPath) {
      console.log(`Renaming ${originalPdfPath} ➡ ${newPdfPath}`)
      // Delete original PDF and only use the new renamed version
      const oldFile = bucket.file(originalPdfPath)
      await oldFile.delete()

      // Upload into the new location with rename
      await bucket.upload(tempLocalFile, {
        destination: newPdfPath,
      })
      await logStatus(newPdfBasename, {
        userUpload: 'success',
        renamed: originalPdfBasename,
      })
      return
    }

    await logStatus(originalPdfBasename, { userUpload: 'success' })

    // check to see if we have content in CloudSearch for this file
    // to avoid duplicating content
    const docs = await cloudSearchDownload(originalPdfPath)

    // if hitCount is greater than 0, then we have content already present
    // in CloudSearch for this file and need to delete it
    const hitCount = docs.hits.hit.length
    console.log(
      `EVENT: ${hitCount} records already exist in CloudSearch for this document`,
    )
    if (hitCount > 0) {
      await logStatus(originalPdfBasename, {
        existingCloudsearchData: hitCount,
      })
      const tempDeleteBatchPath = path.join(
        os.tmpdir(),
        `delete-${originalPdfBasename}.json`,
      )
      const deleteBatch = await generateDeleteBatch(docs)
      // save the delete batch to the local filesystem
      // so we can upload it to Firebase storage
      fs.writeFileSync(
        tempDeleteBatchPath,
        JSON.stringify(deleteBatch),
        'utf-8',
        err => {
          if (err) {
            console.log(err)
          }
        },
      )
      console.log(`EVENT: Generated a delete batch for ${originalPdfPath}`)

      // send delete batch to CloudSearch if there is content to be deleted
      if (deleteBatch.length > 0) {
        await cloudSearchUpload(deleteBatch)
        console.log(
          `EVENT: Delete - Uploaded ${
            deleteBatch.length
          } documents to CloudSearch for deletion`,
        )
        await logStatus(originalPdfBasename, {
          deletedExistingCloudsearchData: 'success',
        })
      }

      // save delete batch in Firebase storage for reference
      const tempStoragePath = path.join(
        originalUploadDir,
        'batch',
        `delete-${originalPdfBasename}.json`,
      )
      await bucket.upload(tempDeleteBatchPath, {
        destination: tempStoragePath,
      })

      fs.unlinkSync(tempDeleteBatchPath)
    }

    // create a buffer from the file that was uploaded
    // and send that to pdf2json so we can extract the raw text
    const contentBuffer = fs.readFileSync(tempLocalFile)
    const rawText = await parseContent(contentBuffer)

    // Create a document batch from the raw text
    const documentBatch = await generateDocumentBatch(rawText, originalPdfPath)
    console.log(`EVENT: Generated a document batch for ${originalPdfPath}`)
    await logStatus(originalPdfBasename, {
      generateCloudSearchBatch: 'success',
    })

    // Save the documentBatch to a temporary location
    const tempDocBatchPath = path.join(
      os.tmpdir(),
      `${originalPdfBasename}.json`,
    )
    await fs.writeFileSync(
      tempDocBatchPath,
      JSON.stringify(documentBatch),
      'utf-8',
      err => {
        if (err) {
          console.log(err)
        }
      },
    )

    // If there are documents to write in the document batch, upload to cloudSearch
    if (documentBatch.length > 0) {
      await cloudSearchUpload(documentBatch)
    }
    console.log(
      `EVENT: Add - Uploaded ${documentBatch.length} documents to CloudSearch`,
    )

    // Upload a copy to bucket
    const tempStoragePath = path.join(
      originalUploadDir,
      'batch',
      `${originalPdfBasename}.json`,
    )
    await bucket.upload(tempDocBatchPath, { destination: tempStoragePath })

    fs.unlinkSync(tempDocBatchPath)

    await logStatus(originalPdfBasename, {
      userUpload: 'success',
      cloudSearchUpload: 'success',
    })
    console.log(`Sending ${originalPdfBasename} for processing`)

    var options = {
      method: 'POST',
      uri: `https://${projectId}.appspot.com`,
      body: {
        storageObject: object,
      },
      json: true,
    }
    try {
      const response = await rp(options)
      await logStatus(originalPdfBasename, { sendForProcessing: 'success' })
      console.log(response)
      return response
    } catch (err) {
      console.error(err)
      await logStatus(originalPdfBasename, {
        sendForProcessing: 'fail',
        error: err,
      })
      return err
    }
  })
