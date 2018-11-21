const path = require('path')
const os = require('os')
const fs = require('fs')
const functions = require('firebase-functions')
const cloudSearchDownload = require('./cloudSearchDownload')
const cloudSearchUpload = require('./cloudSearchUpload')
const generateDeleteBatch = require('./generateDeleteBatch')
const admin = require('firebase-admin')
const storage = admin.storage()
const cloudSearchEndpoint = process.env.CLOUD_SEARCH_ENDPOINT
const recursiveDelete = require('./recursiveDelete')

exports = module.exports = functions
  .runWith({ memory: '2GB', timeoutSeconds: 540 })
  .storage.object()
  .onDelete(async object => {
    const PDF_EXTENSION = '.pdf'
    const filePath = object.name
    const dir = path.dirname(filePath)
    const extension = path.extname(filePath)
    const directory = path.dirname(filePath)
    const contentType = object.contentType
    const objectBasename = path.basename(object.name, PDF_EXTENSION)

    // If the uploaded file does not have the PDF content type, ignore it
    if (!contentType.includes('pdf')) {
      return null
    }

    // If the uploaded file does not have a pdf extension, ignore it
    if (extension !== PDF_EXTENSION) {
      return null
    }

    // If the uploaded file is in the output directory, ignore it
    if (directory.startsWith('output')) {
      return null
    }

    const bucket = storage.bucket(object.bucket)

    const tempDeleteBatchPath = path.join(
      os.tmpdir(),
      `delete-${objectBasename}.json`,
    )
    const docs = await cloudSearchDownload(filePath, cloudSearchEndpoint)
    const hitCount = docs.hits.hit.length
    console.log(
      `Found ${hitCount} existing records in CloudSearch for ${objectBasename}`,
    )
    let deleteBatch = []
    if (hitCount > 0) {
      deleteBatch = await generateDeleteBatch(docs)
    }
    console.log(`Generated a delete batch for ${objectBasename}`)

    // save delete batch as a json file locally
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

    if (deleteBatch.length > 0) {
      // send delete batch to CloudSearch
      // dont send the delete batch if there are no documents to delete
      // it will throw an error
      await cloudSearchUpload(deleteBatch, cloudSearchEndpoint)
    }

    console.log(
      `Started delete of ${deleteBatch.length} documents from CloudSearch`,
    )

    // Save a copy of delete transactions for logging purposes
    const tempStoragePath = path.join(
      dir,
      'batch',
      `delete-${objectBasename}.json`,
    )

    // Upload batch files to storage
    await bucket.upload(tempDeleteBatchPath, {
      destination: tempStoragePath,
    })

    // Delete output files
    const outputPath = `output/${objectBasename}`
    bucket.deleteFiles(
      {
        force: true,
        prefix: outputPath,
      },
      function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log(`Successfully deleted old files from ${outputPath}`)
        }
      },
    )

    // Delete collection in Firestore
    const deleteResult = await recursiveDelete(`documents/${objectBasename}`)
    console.log('Delete success: ' + JSON.stringify(deleteResult))

    fs.unlinkSync(tempDeleteBatchPath)
    return
  })
