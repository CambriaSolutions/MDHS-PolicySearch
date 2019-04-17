const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

exports = module.exports = functions.firestore
  .document('feedback/{response}')
  .onCreate((snap, context) => {
    const newResponse = snap.data()
    const { wasHelpful, feedbackList } = newResponse
    return logRequest(wasHelpful, feedbackList)
  })

async function logRequest(wasHelpful, feedbackList) {
  try {
    const docRef = admin
      .firestore()
      .collection('analytics')
      .doc('feedBackSummary')

    const doc = await db.runTransaction(t => t.get(docRef))

    let newPostiveFeedbackList = {}
    let newNegativeFeedbackList = {}
    let newHelpfulResponses = 0
    let newUnHelpfulResponses = 0

    let newTotalNumResponses = 1
    if (doc.exists && typeof doc.data().totalNumResponses !== 'undefined') {
      newTotalNumResponses = doc.data().totalNumResponses + 1
    }

    if (doc.exists && typeof doc.data().positiveFeedbackList !== 'undefined') {
      newPostiveFeedbackList = doc.data().positiveFeedbackList
    }

    if (doc.exists && typeof doc.data().negativeFeedbackList !== 'undefined') {
      newNegativeFeedbackList = doc.data().negativeFeedbackList
    }

    if (doc.exists && typeof doc.data().helpfulResponses !== 'undefined') {
      newHelpfulResponses = doc.data().helpfulResponses
    }

    if (doc.exists && typeof doc.data().unhelpfulResponses !== 'undefined') {
      newUnHelpfulResponses = doc.data().unhelpfulResponses
    }

    if (wasHelpful) {
      newHelpfulResponses += 1
      if (feedbackList && feedbackList !== '') {
        feedbackList.forEach(feedback => {
          if (newPostiveFeedbackList[feedback]) {
            newPostiveFeedbackList[feedback] =
              newPostiveFeedbackList[feedback] + 1
          } else {
            newPostiveFeedbackList[feedback] = 1
          }
        })
      }
    } else {
      newUnHelpfulResponses += 1
      if (feedbackList && feedbackList !== '') {
        feedbackList.forEach(feedback => {
          if (newNegativeFeedbackList[feedback]) {
            newNegativeFeedbackList[feedback] =
              newNegativeFeedbackList[feedback] + 1
          } else {
            newNegativeFeedbackList[feedback] = 1
          }
        })
      }
    }

    await doc.ref.set(
      {
        helpfulResponses: newHelpfulResponses,
        unhelpfulResponses: newUnHelpfulResponses,
        positiveFeedbackList: newPostiveFeedbackList,
        negativeFeedbackList: newNegativeFeedbackList,
        totalNumResponses: newTotalNumResponses,
      },
      { merge: true }
    )
  } catch (err) {
    console.error(err)
  }
}
