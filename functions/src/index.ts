import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()
const db = admin.firestore()
const dbUsersRef = db.collection('users')
const dbPicturesRef = db.collection('pictures')

const cors = require('cors')({ origin: true })

export const deleteAuth = functions.region('asia-northeast1').https.onRequest((req, res) => {
  cors(req, res, () => {
    const uid = req.body.data.uid

    admin.auth()
    .deleteUser(uid)
    .then(() => {
      return console.log('Successfully: deleted user from Authentication.')
    })
    .catch((error) => {
      return console.error('ERROR: Unable to deleted user from Authentication.', error)
    })
  })
})

/* Authenticationからuserが削除されたら、Firestoreからユーザーのデータを削除する*/
exports.deleteAccountData = functions.region('asia-northeast1').auth.user().onDelete((user) => {
  const uid = user.uid

  new Promise((resolve) => {
    // 対象ユーザーのデータをFirestoreから削除
    dbUsersRef
    .doc(uid)
    .delete()
    .then(() => {
      console.log(`Deleted user data from Firestore.(uid: ${ uid })`)
      resolve('Deleted user.')
    })
    .catch((error) => {
      console.error(`ERROR: Unable to deleted user from Firestore.(id: ${ uid })`, error)
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
      if (docs.length > 0) {
        docs.forEach((doc) => {
          const id =  doc.id

          setTimeout(() => {
            dbPicturesRef
            .doc(id)
            .delete()
            .then(() => {
              console.log(`Deleted the Clip from Firestore.(id: ${ id })`)
            })
            .catch((error) => {
              console.error(`ERROR: Unable to deleted the Clip from Firestore.(id: ${ id })`, error)
            })
          }, 1000)
        })
      } else {
        return
      }
    })
  })
})
