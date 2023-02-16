import {db} from '@/db'
import {firestoreAction} from 'vuexfire'
import firebase from "firebase/compat/app";
import notes from "@/components/Notes";

export default {
    namespaced: true, state: {
        // items - данные, которым мы присвоили notes
        items: [],

    }, getters: {
        items(state) {
            return state.items
        },


    }, mutations: {
        // notes - данные, которые мы взяли с firebase
        // items - данные, которым мы присвоили notes
        // setNotes(state, user) {
        //     state.items = user.notes
        // },
        updateTitle(state, {updateTitle, index}) {
            state.items[index].title = updateTitle
        }, updateDescription(state, {updateDescription, index}) {
            state.items[index].description = updateDescription
        },

    }, actions: {
        // getNotes() {
        //     // Сюда мы прокидываем обращение к Firebase ищем data
        //     db.collection('notes')
        //         // Берем айди нашей коллекции
        //         .doc('JJ7uPS0i2C9eJBRxWVel')
        //         //Получаем нашу коллекцию
        //         .get()
        //         // Принимаем Callback функцию
        //         .then(res => {
        //             const notes = res.data()
        //             return notes
        //         })
        //     // Здесь мы отправляем данные в mutations
        // },
        // Получение с Firebase
        bindNotes: firestoreAction(({bindFirestoreRef, rootState}) => {
            const uid = rootState.auth.user.uid
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('items', db.collection('users').doc(uid).collection('notes'))
        }), // Добавление с Firebase
        addNotes({rootState}, note) {
            // const userRef = db.collection('profiles').doc(rootState.auth.user.uid)
            const uid = rootState.auth.user.uid
            return db.collection('users')
                .doc(uid).collection('notes').add(note)
            // .doc(uid).update({
            //     notes: firebase.firestore.FieldValue.arrayUnion(note)
            // })
        },

        // Редактирование с Firebase
        async updateNote({rootState, getters, dispatch}, {index, noteId}) {
            const uid = rootState.auth.user.uid
            let note = getters.items[index]
            await db.collection('users')
                .doc(uid)
                .collection('notes')
                .doc(noteId)
                .update(
                    {...note}
                    // Добавить в коллекцию notes - labels
                    // Добавить возможность редактировать картинки, label
                    //
                )
                .then(() => {
                })
        },
        async updateImg({rootState, getters, dispatch}, {newImg, imgName, noteId}) {
            const uid = rootState.auth.user.uid
            await db.collection('users')
                .doc(uid)
                .collection('notes')
                .doc(noteId)
                .update(
                    {
                        img: newImg,
                        imgName
                    }
                    // Добавить в коллекцию notes - labels
                    // Добавить возможность редактировать картинки, label
                    //
                )
                .then(() => {
                })
        },
        async deleteImg({rootState, dispatch}, noteId){
            const uid = rootState.auth.user.uid
            await db.collection('users').doc(uid).collection('notes').doc(noteId).get()
                .then(async data => {
                    if(data.data().imgName !== null){
                        let givenImg = data.exists ? data.data().imgName : null
                        let storageRef = firebase.storage().ref()
                        let desertRef = storageRef.child(givenImg)
                        await desertRef.delete()
                    }
                })
            await db.collection('users').doc(uid).collection('notes').doc(noteId).update({
                img:'',
                imgName:''
            })
        },
        // Удаление с Firebase
        deleteNote: firestoreAction(({rootState, state}, noteId) => {
            const uid = rootState.auth.user.uid
            return db.collection('users')
                .doc(uid).collection('notes').doc(noteId).delete()
        })
    }
}