require('dotenv').config()
const path = require('path')
const cloudSearchEndpoint = `${process.env.CLOUD_SEARCH_ENDPOINT}`
const cloudSearchDownload = require('./cloudSearchDownload')
const cloudSearchUpload = require('./cloudSearchUpload')
const generateDeleteBatch = require('./generateDeleteBatch')

const filePath = 'Child-Support-Manual-Revised_2.19.pdf'
const dir = path.dirname(filePath)
const extension = path.extname(filePath)
const directory = path.dirname(filePath)
const objectBasename = path.basename(filePath, '.pdf')

const deleteFiles = async () => {
    const docs = await cloudSearchDownload(filePath, cloudSearchEndpoint)
    const hitCount = docs.hits.hit.length
    console.log(
        `Found ${hitCount} existing records in CloudSearch for ${objectBasename}`,
    )

    const deleteBatch = await generateDeleteBatch(docs)
    //await cloudSearchUpload(deleteBatch, cloudSearchEndpoint)
}

try {
    deleteFiles()
} catch (e) {
    console.error(e)
}


