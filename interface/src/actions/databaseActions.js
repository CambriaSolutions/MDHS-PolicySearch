import firebase from 'firebase/app'
const db = firebase.firestore()

export default function storeFeedback(wasHelpful, feedbackList) {
  const feedback = {
    date: new Date(),
    wasHelpful,
    feedbackList,
  }
  return db.collection('feedback').add(feedback)
}
