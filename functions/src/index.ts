import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()
const db = admin.firestore()
const dbUsersRef = db.collection('users')
const dbPicturesRef = db.collection('pictures')

// const cors = require('cors')({ origin: true })

/* Authenticationからuserが削除されたら、Firestoreからもデータを削除する*/
exports.deleteAccount = functions.auth.user().onDelete((user) => {
  const uid = user.uid

  new Promise((resolve) => {
    // 対象ユーザーのデータをFirestoreから削除
    dbUsersRef
    .doc(uid)
    .delete()
    .then(() => {
      console.log(`Deleted user data from Firebase.(uid: ${ uid })`)
      resolve('Deleted user.')
    })
    .catch((error) => {
      console.error(error)
    })
  })
  .then(() => {
    // 対象ユーザーが登録したクリップを一覧取得
    dbPicturesRef
    .where('user_id', '==', uid)
    .onSnapshot((querySnapshot) => {
      const docs = [] as any[]

      querySnapshot.forEach((doc) => {
        const id =  doc.id
        const data = doc.data()

        docs.push({
          id: id,
          data: {
            created_time: data.created_time.toDate(),
            image_url: data.image_url,
            private_setting: data.private_setting
          }
        })
      })

      // クリップのデータをFirestoreから削除
      docs.forEach((doc) => {
        const id =  doc.id

        setTimeout(() => {
          dbPicturesRef
          .doc(id)
          .delete()
          .then(() => {
            console.log(`Deleted Clip from Firebase.(id: ${ id })`)
          })
          .catch((error) => {
            console.error(error)
          })
        }, 1000)
      })
    })
  })
})
