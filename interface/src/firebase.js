import firebase from 'firebase/app'
import 'firebase/firestore'
// import 'firebase/auth'
import 'firebase/storage'
import config from './firebaseconfig.json'
firebase.initializeApp(config)

const storage = firebase.storage()

// firestore.enablePersistence().catch(function(err) {
//   console.warn(err)
//   if (err.code === 'failed-precondition') {
//     // Multiple tabs open, persistence can only be enabled
//     // in one tab at a a time.
//   } else if (err.code === 'unimplemented') {
//     // The current browser does not support all of the
//     // features required to enable persistence
//   }
// })
// Initialize Cloud Firestore through Firebase
const db = firebase.firestore()
// const auth = firebase.auth()

export { db, storage, firebase }
