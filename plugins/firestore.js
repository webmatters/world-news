import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyBkDzz3ir6s2RyWjxSzoz_uiEHm-q2f63k',
    authDomain: 'world-news-c7273.firebaseapp.com',
    databaseURL: 'https://world-news-c7273.firebaseio.com',
    projectId: 'world-news-c7273',
    storageBucket: 'world-news-c7273.appspot.com',
    messagingSenderId: '529058096184',
    appId: '1:529058096184:web:cfa0a86cea98212746f2cd',
  }
  firebase.initializeApp(firebaseConfig)
  firebase.firestore().settings({
    timestampsInSnapshots: true,
  })
}

const db = firebase.firestore()

export default db
