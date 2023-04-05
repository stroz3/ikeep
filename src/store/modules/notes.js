import {db} from '@/db'
import {firestoreAction} from 'vuexfire'
import firebase from "firebase/compat/app";
import notes from "@/components/Notes";
import Vue from "vue";

export default {
    namespaced: true, state: {
        // items - данные, которым мы присвоили notes
        items: [],
        layouts:[]
    }, getters: {
        items(state) {
            return state.items
        },
        layouts(state){
            return state.layouts
        }
    }, mutations: {
        clearInfo(state){
         return [
             state.items = [],
             state.layouts = []
         ]
        },
        deleteLabel(state, {noteId, labelId}){
            state.items[state.items.findIndex(el => el.id === noteId)].label.splice(state.items.findIndex(el => el.id === labelId), 1)
        },
        deleteLabelFromNotes(state, labelId){
            for(const el of state.items){
                for(const labelItem of el.label){
                    if(labelItem.labelId === labelId){
                        el.label.splice(el.label.map(e => e.labelId).indexOf(labelId), 1)
                    }
                }
            }
        },
        updateTitle(state, {updateTitle, noteId}) {
            state.items[state.items.map(e => e.id).indexOf(noteId)].title = updateTitle
        },
        updateDescription(state, {updateDescription, noteId}) {
            state.items[state.items.map(e => e.id).indexOf(noteId)].description = updateDescription
        },
        labelItems(state, newArray){
            state.items = []
            state.items.push(...newArray)
        },
        addLayout(state, newLayout){
            state.layouts.push(newLayout)
        },
        addNewBlock(state){
            state.layouts = []
            let layout = state.items.map(e => e.layout)
            if(state.layouts.length > 0){
                for(const el of layout){
                  state.layouts.map(e => e.i).indexOf(el.i) === -1 ? state.layouts.push(el) : console.log('this item already exists')
                }
            }
            else{
                state.layouts.push(...layout)
            }
        },
        updateItemPosition(state, { i, x, y }) {
          const itemIndex = state.layouts.findIndex(item => item.i === i)
          if (itemIndex >= 0) {
            state.layouts[itemIndex].x = x
            state.layouts[itemIndex].y = y
          }
        },
        updateItemSize(state, { i, h }) {
          const itemIndex = state.layouts.findIndex(item => item.i === i)
            console.log(itemIndex)
          if (itemIndex >= 0) {
            state.layouts[itemIndex].h = h
          }
        },
        deleteLayouts(state, i){
            state.layouts.forEach((el, index) =>{
              if(el.i === i){
                state.layouts.splice(index, 1)
              }
            })
        }
    }, actions: {
        // Получение с Firebase
        bindNotes: firestoreAction(({bindFirestoreRef, rootState}) => {
            const uid = rootState.auth.user.uid
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('items', db.collection('users').doc(uid).collection('notes').orderBy("sortOrder", 'asc'))
        }), // Добавление с Firebase
        addNotes({rootState}, note) {
            // const userRef = db.collection('profiles').doc(rootState.auth.user.uid)
            const uid = rootState.auth.user.uid
            return db.collection('users')
                .doc(uid).collection('notes').add(note)
                .then((docRef)=>{
                    docRef.update({
                        'id': docRef.id
                    }).then()
                })
        },
        addLayouts({rootState}, noteId) {
            // const userRef = db.collection('profiles').doc(rootState.auth.user.uid)
            const uid = rootState.auth.user.uid
            return db.collection('users')
                .doc(uid).collection('notes').add(note)
                .then((docRef)=>{
                    docRef.update({
                        'id': docRef.id
                    }).then()
                })

        },
        // Редактирование с Firebase
        async updateNote({rootState, getters}, noteId) {
            const uid = rootState.auth.user.uid
            let note = getters.items[getters.items.map(e => e.id).indexOf(noteId)]
            await db.collection('users')
                .doc(uid)
                .collection('notes')
                .doc(noteId)
                .update(
                    {...note}
                )
                .then(_ => {})
        },
        async updateLayout({rootState, getters}, {noteId}) {
            const uid = rootState.auth.user.uid
            let note = getters.layouts[getters.items.map(e => e.id).indexOf(noteId)]
            let timer = null
            clearTimeout(timer);
            timer = setTimeout(async () => {
                    await db.collection('users')
                        .doc(uid)
                        .collection('notes')
                        .doc(noteId)
                        .update({
                            layout: note
                        })
                        .then(() => {
                        })
                        .catch(e => {
                            Vue.toasted.error(e)
                        })
                }, 500)
        },
        async deleteLabelFromNotes({rootState, getters, commit}, labelId){
            await commit("deleteLabelFromNotes", labelId)
            const uid = rootState.auth.user.uid
            let notes = getters.items
            return db.collection('users')
                .doc(uid)
                .collection('notes')
                 .get()
                 .then(snapshot=>{
                     const promises = [];
                     snapshot.forEach(doc => {
                         notes.forEach(e =>{
                             if(e.id === doc.id){
                                 promises.push(doc.ref.update({
                                     ...e
                                 }))
                             }
                         })

                     })
                     return Promise.all(promises)
                 })
                 .catch(e =>{
                     Vue.toasted.error(e, {duration: 3000})
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
            state.items.splice(state.items.map(el=>el.id).indexOf(noteId), 1)
            return db.collection('users')
                .doc(uid).collection('notes').doc(noteId).delete()
        })
    }
}


