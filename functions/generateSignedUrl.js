const admin = require('firebase-admin')
const storage = admin.storage()
const db = admin.firestore()

const signedUrlConfig = {
    action: 'read',
    expires: '03-01-2500',
}

module.exports = async (bucketName, docName, pageNum, pdfFile, imageFile) => {
    try {
        console.log(`Processing ${pageNum} : [${pdfFile}, ${imageFile}]`)
        const bucket = storage.bucket(bucketName)

        const pdfUrl = await bucket.file(pdfFile).getSignedUrl(signedUrlConfig)
        const imageUrl = await bucket.file(imageFile).getSignedUrl(signedUrlConfig)
    
        await db
            .collection('documents')
            .doc(docName)
            .collection('pages')
            .doc(`pg-${pageNum}`)
            .set(
                {
                    pdfUrl: pdfUrl,
                    thumbUrl: imageUrl,
                },
                { merge: true },
            )
    } catch (err) {
        console.log(`Error storing signatures: ${err.message}`, err.stack)
    }
}