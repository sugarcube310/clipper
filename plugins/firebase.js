import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import 'firebase/compat/functions'

import * as firebase_secret from '../_secrets/firebase'

firebase.initializeApp(firebase_secret)

export const auth = firebase.auth()
export const storage = firebase.storage()
export const firestore = firebase.firestore()
export const dbUsersRef = firestore.collection('users')
export const dbPicturesRef = firestore.collection('pictures')
export const functions = firebase.app().functions('asia-northeast1')

// Functions Emulatorを使うときはコメントアウトを外す
// functions.useFunctionsEmulator('http://localhost:5001')

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
