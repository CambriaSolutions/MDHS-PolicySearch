const AWS = require('aws-sdk')
function cloudSearchUpload(batch) {
  console.info(
    `Starting upload of batch to CloudSearch with size ${batch.length}`
  )
  return new Promise((resolve, reject) => {
    const uploadParams = {
      contentType: 'application/json',
      documents: JSON.stringify(batch),
    }
    console.info(`uploadParams: ${uploadParams}`)
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    })
    const cloudSearchDomain = new AWS.CloudSearchDomain({
      endpoint: process.env.CLOUD_SEARCH_ENDPOINT,
      apiVersion: '2013-01-01',
    })
    cloudSearchDomain.uploadDocuments(uploadParams, (error, data) => {
      if (error) {
        console.error(`errors: ${error}, data: ${data}`)
        reject(error)
      } else {
        console.info(`Success: Uploaded batch to CloudSearch`)
        resolve(batch.length)
      }
    })
  })
}

module.exports = cloudSearchUpload
