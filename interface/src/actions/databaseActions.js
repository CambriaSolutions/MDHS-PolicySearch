import firebase from 'firebase/app'
const db = firebase.firestore()

export default function storeFeedback(wasHelpful, feedbackList) {
  const feedback = {
    wasHelpful,
    feedbackList,
  }
  return db
    .collection('analytics')
    .doc(`feedback`)
    .set({ [new Date()]: feedback }, { merge: true })
}
