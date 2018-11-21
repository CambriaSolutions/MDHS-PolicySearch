const firebase_tools = require('firebase-tools')

function recursiveDelete(path) {
  return firebase_tools.firestore
    .delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: process.env.FIREBASE_TOKEN,
    })
    .then(() => {
      return {
        path: path,
      }
    })
    .catch(err => {
      console.error(err)
    })
}

module.exports = recursiveDelete
