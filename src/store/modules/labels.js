import {db} from "@/db";
import {firestoreAction} from "vuexfire";

export default {
    namespaced: true,
    state: {
        // items - данные, которым мы присвоили labels
        items: []
    },
    getters: {
        items(state) {
            return state.items
        },

    },
    mutations: {
        // labels - данные, которые мы взяли с firebase
        // items - данные, которые мы присвоили labels
        setLabels(state, items) {
            state.items = items
        },
        updateLabel(state, {updateName, index}) {
            state.items[index].name = updateName

        },
        changeShow(state, {index, bool}) {
            state.items[index].isShow = bool
        },
        deleteLabel(state, labelId){
            state.items.splice(state.items.findIndex(el => el.id === labelId), 1)
        },
        clearItems(state){
          return state.items = []
        }
    },
    actions: {
        // Получение данных с Firebase
        bindLabels: firestoreAction(({bindFirestoreRef, rootState}) => {
            const uid = rootState.auth.user.uid
            // return the promise returned by 'bindFirestoreRef'
            return bindFirestoreRef('items', db.collection('users').doc(uid).collection('labels'))

        }),
        // Добавление в Firebase
        async addLabel({rootState, context}, {name, isShow = false}) {
            const uid = rootState.auth.user.uid
            await db.collection('users')
                .doc(uid).collection('labels').add({name, isShow}).then(
                    (docRef)=>{
                        docRef.update({
                            'labelId': docRef.id
                        })
                    }
                )

        },
        // Редактирование ярлыка
        async updateLabel({getters, rootState}, {index, labelId}) {
            const uid = rootState.auth.user.uid
            // Находим измененный ярлык
            let name = getters.items[index].name,
                isShow = getters.items[index].isShow
            // Обновляем его
            await db.collection('users')
                .doc(uid).collection('labels')
                .doc(labelId)
                .update({
                    name,
                    isShow
                })

        },
        async deleteLabel({context, rootState}, labelId) {
            const uid = rootState.auth.user.uid
            await db.collection('users')
                .doc(uid).collection('labels')
                .doc(labelId)
                .delete()

        }
    },
}