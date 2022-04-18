import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/functions'

import * as firebase_secret from '../_secrets/firebase'

firebase.initializeApp(firebase_secret)

export const auth = firebase.auth()
export const db = firebase.firestore()
export const firestore = firebase.firestore()
export const dbUsersRef = db.collection('users')
export const functions = firebase.app().functions('asia-northeast1')
