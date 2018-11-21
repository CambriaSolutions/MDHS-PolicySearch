const mkdirp = require('mkdirp-promise')
const path = require('path')
const os = require('os')
const fs = require('fs')
const pdfjsLib = require('pdfjs-dist')
const express = require('express')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const pLimit = require('p-limit')
admin.initializeApp()
const storage = admin.storage()
const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })
const processPdfPage = require('./processPdfPage')
const logStatus = require('./logStatus')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/', async (req, res, next) => {
  res.send(`Successfully received file.`)
  try {
    const { storageObject } = req.body
    const PDF_EXTENSION = '.pdf'
    const bucket = storage.bucket(storageObject.bucket)
    const originalPdfPath = storageObject.name
    const originalUploadDir = path.dirname(originalPdfPath)
    const originalFile = bucket.file(originalPdfPath)
    const originalPdfBasename = path.basename(originalPdfPath, PDF_EXTENSION)
    const extension = path.extname(originalPdfPath)
    const contentType = storageObject.contentType

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

    console.log(`Starting processing for ${originalPdfBasename}`)
    await logStatus(originalPdfBasename, { processingStarted: 'success' })

    // Temporary files and directories
    const tempLocalFile = path.join(os.tmpdir(), originalPdfPath)
    const tempLocalDir = path.dirname(tempLocalFile)

    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempLocalDir)

    // Download file from bucket.
    await originalFile.download({ destination: tempLocalFile })
    await logStatus(originalPdfBasename, { fileDownload: 'success' })

    // Parse the document using pdf.js
    const doc = await pdfjsLib.getDocument(tempLocalFile)
    const numPages = doc.numPages

    await logStatus(originalPdfBasename, { pageCount: numPages })
    console.log(`Found ${numPages} pages for ${originalPdfBasename}`)
    const promises = []
    const limit = pLimit(10)
    for (let i = 1; i <= numPages; i++) {
      promises.push(limit(() => processPdfPage(i, storageObject)))
    }

    await Promise.all(promises)

    fs.unlinkSync(tempLocalFile)
    await logStatus(originalPdfBasename, { processingFinished: 'success' })
    console.log(`Successfully processed ${originalPdfBasename}`)
    return
  } catch (err) {
    console.error(err)
    await logStatus(originalPdfBasename, {
      processingFinished: 'fail',
      error: err,
    })
    return next(err)
  }
})

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
