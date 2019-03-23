const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')
const get = require('lodash/get')
const admin = require('firebase-admin')
const storage = admin.storage()
const db = admin.firestore()
const logStatus = require('./logStatus')

async function processPdfPage(pageNum, object) {
  const PDF_EXTENSION = '.pdf'
  const THUMB_PREFIX = 'thumb_'
  const THUMB_MAX_HEIGHT = 484
  const THUMB_MAX_WIDTH = 372
  const bucket = storage.bucket(object.bucket)
  const originalPdfPath = object.name
  const originalUploadDir = path.dirname(originalPdfPath)
  const originalPdfBasename = path.basename(originalPdfPath, PDF_EXTENSION)
  const tempSinglePdf = path.join(os.tmpdir(), `${pageNum}.pdf`)
  const tempSingleThumb = path.join(
    os.tmpdir(),
    `${THUMB_PREFIX}${pageNum}.png`
  )
  const tempLocalFile = path.join(os.tmpdir(), originalPdfPath)
  const contentType = object.contentType

  await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
    processingStarted: 'success',
  })
  console.log(`Starting processing for ${originalPdfBasename}(${pageNum})`)

  const pdfMetadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  }
  const imageMetadata = {
    contentType: 'image/png',
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  }
  const signedUrlConfig = {
    action: 'read',
    expires: '03-01-2500',
  }

  const singlePdf = path.join(
    originalUploadDir,
    'output',
    originalPdfBasename,
    `${pageNum}.pdf`
  )
  const singleThumb = path.join(
    originalUploadDir,
    'output',
    originalPdfBasename,
    `${THUMB_PREFIX}${pageNum}.png`
  )
  console.log(`starting gs for ${pageNum}`)
  // Use Ghostscript to generate single PDF page
  await spawn(
    'gs',
    [
      '-sDEVICE=pdfwrite',
      '-dNOPAUSE',
      '-dBATCH',
      '-dSAFER',
      `-dFirstPage=${pageNum}`,
      `-dLastPage=${pageNum}`,
      `-sOutputFile=${tempSinglePdf}`,
      tempLocalFile,
    ],
    { capture: ['stdout', 'stderr'] }
  )
  await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
    pdfGeneration: 'success',
  })

  console.log(`starting imagemagick for ${pageNum}`)
  // await spawn(
  //   'convert',
  //   [
  //     tempSinglePdf,
  //     '-thumbnail',
  //     `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
  //     tempSingleThumb,
  //   ],
  //   { capture: ['stdout', 'stderr'] }
  // )
  // await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
  //   thumbGeneration: 'success',
  // })

  // Upload pdf to bucket
  console.log(`starting upload for pdf-${pageNum}`)
  await bucket.upload(tempSinglePdf, {
    destination: singlePdf,
    metadata: pdfMetadata,
    validation: false,
  })

  await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
    pdfUpload: 'success',
  })

  // Upload thumbnail to bucket
  console.log(`starting upload for img-${pageNum}`)
  await bucket.upload(tempSingleThumb, {
    destination: singleThumb,
    metadata: imageMetadata,
    validation: false,
  })
  await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
    thumbUpload: 'success',
  })

  // Get signed download URLs and save to Firestore
  const singlePdfFile = bucket.file(singlePdf)
  const singleThumbFile = bucket.file(singleThumb)
  const results = await Promise.all([
    singlePdfFile.getSignedUrl(signedUrlConfig),
    singleThumbFile.getSignedUrl(signedUrlConfig),
  ])
  console.log(`got url results-${results.length}`)
  await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
    urlGeneration: 'success',
  })

  if (!results) {
    console.error(`No results for ${pageNum}`)
    await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
      urlGeneration: 'failure',
    })
  }

  // Remove temporary data
  fs.unlinkSync(tempSinglePdf)

  console.log(`Finished processing for ${originalPdfBasename}(${pageNum})`)

  // Save data in firestore
  await db
    .collection('documents')
    .doc(originalPdfBasename)
    .collection('pages')
    .doc(`pg-${pageNum}`)
    .set(
      {
        pdfUrl: get(results, '[0][0]', ''),
        thumbUrl: get(results, '[1][0]', ''),
      },
      { merge: true }
    )
  console.log(
    `Finished saving data in Firestore for ${originalPdfBasename}(${pageNum})`
  )
  await logStatus(`${originalPdfBasename}/pages/pg-${pageNum}`, {
    processingFinished: 'success',
  })
  return console.log(`Finished saving URL in Firestore`)
}

module.exports = processPdfPage
