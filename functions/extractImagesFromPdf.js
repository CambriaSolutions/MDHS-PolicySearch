const mkdirp = require('mkdirp-promise')
const path = require('path')
const os = require('os')
const fs = require('fs')
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js')
const admin = require('firebase-admin')
const storage = admin.storage()
const pLimit = require('p-limit')
const logStatus = require('./logStatus')
const gs = require('gs')
const generateSignedUrl = require('./generateSignedUrl')

const extractImagesFromPdf = async (storageObject) => {
    const PDF_EXTENSION = '.pdf'
    const bucket = storage.bucket(storageObject.bucket)
    const originalPdfPath = storageObject.name
    const originalUploadDir = path.dirname(originalPdfPath)
    const originalFile = bucket.file(originalPdfPath)
    const originalPdfBasename = path.basename(originalPdfPath, PDF_EXTENSION)

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
    const doc = await (pdfjsLib.getDocument(tempLocalFile)).promise
    const numPages = doc.numPages

    await logStatus(originalPdfBasename, { pageCount: numPages })
    console.log(`Found ${numPages} pages for ${originalPdfBasename}`)

    const pdfMetadata = {
        contentType: storageObject.contentType,
    }

    const imageMetadata = {
        contentType: 'image/png',
    }

    console.log('Starting GS...')
    try {
        console.log('PDF')
        const generatingIndividualPdfs = new Promise((resolve, reject) => {
            gs()
                .batch()
                .nopause()
                .q()
                .device('pdfwrite')
                .executablePath('lambda-ghostscript/bin/./gs')
                .output(path.join(os.tmpdir(), '%d.pdf'))
                .input(tempLocalFile)
                .exec(err => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        console.log('gs ran successfully for PDF export')
                        resolve()
                    }
                })
        })

        console.log('PNG')
        const generatingThumbnailImages =  new Promise((resolve, reject) => {
            gs()
                .batch()
                .nopause()
                .q()
                .device('png16m')
                .executablePath('lambda-ghostscript/bin/./gs')
                .res(72)
                .output(path.join(os.tmpdir(), '%d.png'))
                .input(tempLocalFile)
                .exec(err => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        console.log('gs ran successfully for PNG export')
                        resolve()
                    }
                })
        })

        await Promise.all([generatingIndividualPdfs, generatingThumbnailImages])

        const pages = {}

        const uploadLimit = pLimit(100)
        const uploadPromises = []
        for (let x = 0; x < (numPages / 100); x++) {
            for (let i = 1 + (x * 100); i <= ((x + 1) * 100) && i <= numPages; i++) {
                const singlePdf = path.join(
                    originalUploadDir,
                    'output',
                    originalPdfBasename,
                    `${i}.pdf`
                )

                uploadPromises.push(
                    uploadLimit(() =>
                        bucket.upload(path.join(os.tmpdir(), `${i}.pdf`), {
                            destination: singlePdf,
                            metadata: pdfMetadata,
                            validation: false,
                        })
                    ))

                const singlePng = path.join(
                    originalUploadDir,
                    'output',
                    originalPdfBasename,
                    `thumb_${i}.png`
                )

                uploadPromises.push(
                    uploadLimit(() =>
                        bucket.upload(path.join(os.tmpdir(), `${i}.png`), {
                            destination: singlePng,
                            metadata: imageMetadata,
                            validation: false,
                        })
                    ))

                pages[i] = { pdfFile: singlePdf, imageFile: singlePng }
            }
        }
        await Promise.all(uploadPromises)

        const signedUrlLimit = pLimit(50)
        const signedUrls = []
        Object.entries(pages).forEach(([pageNum, page]) => {
            signedUrls.push(signedUrlLimit(() => generateSignedUrl(storageObject.bucket, originalPdfBasename, pageNum, page.pdfFile, page.imageFile)))
        })
        await Promise.all(signedUrls)

        for (let i = 1; i <= numPages; i++) {
            fs.unlinkSync(path.join(os.tmpdir(), `${i}.pdf`))
            fs.unlinkSync(path.join(os.tmpdir(), `${i}.png`))
        }
    } catch (e) {
        console.error(e)
    }
    console.log('Finished GS.')

    fs.unlinkSync(tempLocalFile)
    await logStatus(originalPdfBasename, { processingFinished: 'success' })
    console.log(`Successfully processed ${originalPdfBasename}`)
}

module.exports = extractImagesFromPdf

