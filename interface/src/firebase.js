import firebase from 'firebase/app'
import 'firebase/firestore'
// import 'firebase/auth'
// import 'firebase/storage'
import config from './firebaseconfig.json'
// const config = {
//   apiKey: 'AIzaSyCxePrYE2Ig89QiwmIdsz2wIcUe8zh5s1s',
//   authDomain: 'documentsearch-b1881.firebaseapp.com',
//   databaseURL: 'https://documentsearch-b1881.firebaseio.com',
//   projectId: 'documentsearch-b1881',
//   storageBucket: 'documentsearch-b1881.appspot.com',
//   messagingSenderId: '485126896861',
// }
firebase.initializeApp(config)

// const storage = firebase.storage()
const firestore = firebase.firestore()
const settings = { timestampsInSnapshots: true }
firestore.settings(settings)
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

export { db, firebase }
