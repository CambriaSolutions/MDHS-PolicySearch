const admin = require('firebase-admin')
const db = admin.firestore()

async function logRequest(event) {
  try {
    await db.collection('requests').add(event)
    const docRef = admin
      .firestore()
      .collection('analytics')
      .doc('summaryData')
    const doc = await db.runTransaction(t => t.get(docRef))
    let newTotalNumRequests = 1
    let newKeywords = {}
    if (doc.exists && typeof doc.data().totalNumRequests !== 'undefined') {
      newTotalNumRequests = doc.data().totalNumRequests + 1
    }
    if (doc.exists && typeof doc.data().keywords !== 'undefined') {
      newKeywords = doc.data().keywords
    }

    const keywordsArr = event.keywords.split(',')
    keywordsArr.forEach(keyword => {
      if (newKeywords[keyword]) {
        newKeywords[keyword] = newKeywords[keyword] + 1
      } else {
        newKeywords[keyword] = 1
      }
    })
    await doc.ref.set(
      {
        totalNumRequests: newTotalNumRequests,
        keywords: newKeywords,
      },
      { merge: true },
    )
  } catch (err) {
    console.error(err)
  }
}

module.exports = logRequest
