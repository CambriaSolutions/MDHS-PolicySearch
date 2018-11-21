const AWS = require('aws-sdk')
function cloudSearchDownload(filename) {
  console.info(`Starting download of ${filename} from CloudSearch`)
  return new Promise((resolve, reject) => {
    const searchParams = {
      size: 10000,
      queryParser: 'simple',
      query: filename,
      return: '_no_fields',
    }
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    })
    const cloudSearchDomain = new AWS.CloudSearchDomain({
      endpoint: process.env.CLOUD_SEARCH_ENDPOINT,
      apiVersion: '2013-01-01',
    })
    // Get the documents in the CloudSearch Domain
    cloudSearchDomain.search(searchParams, (error, data) => {
      if (error) {
        console.error(`errors: ${error}, data: ${data}`)
        reject(error)
      } else {
        console.info(`Success: Downloaded ${filename} from CloudSearch`)
        resolve(data)
      }
    })
  })
}

module.exports = cloudSearchDownload
