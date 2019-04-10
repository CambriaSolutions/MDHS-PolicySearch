const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports = module.exports = functions.firestore
  .document('analytics/feedback')
  .onWrite((snap, context) => {
    return console.log(snap)
  })
