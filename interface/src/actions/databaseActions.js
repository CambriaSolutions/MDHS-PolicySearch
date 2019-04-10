// Database setup
import firebase from 'firebase/app'
const db = firebase.firestore()

export default function storeFeedback(wasHelpful, feedbackList) {
  return db
    .collection('feedback')
    .add({ timeStamp: new Date(), wasHelpful, feedbackList })
}
