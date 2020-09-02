const admin = require('firebase-admin')
const db = admin.firestore()

function logStatus(docName, update) {
  return db
    .collection('documents')
    .doc(docName)
    .set(JSON.parse(JSON.stringify(update)), { merge: true })
}

module.exports = logStatus
