import {db} from "@/db";
import {firestoreAction} from "vuexfire";
import firebase from "firebase/compat/app";
import Vue from "vue";

export default {
    namespaced: true,
    state: {
        user: null,
        info: {},

    },
    getters: {
        isAuthenficated(state) {
            // Return true or false
            return !!state.user
        },
        getUserUid(state) {
            return state.user.uid
        },

    },
    actions: {
        bindUsers: firestoreAction(({bindFirestoreRef}, uid) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('info', db.collection('users').doc(uid))
        }),
        singUp({context, dispatch}, {email, password}) {
            return firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async (user) => {
                    await user
                })
                .catch(e => {
                    Vue.toasted.error(e.message)
                })
        },
        singIn(context, {email, password}) {
            return firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    return context.dispatch("bindUsers", context.getters["getUserUid"])
                })
                .catch(e => {
                    Vue.toasted.error(e.message)
                })
        },
        singOut(context) {
            return firebase.auth().signOut().then(() => {
                context.commit('clearInfo')
            }).catch(e => {
                Vue.toasted.error(e.message)
            })
        },
        createUserProfile(_, {uid, userProfile}) {
            return db
                .collection('users')
                .doc(uid)
                .set(userProfile)
        },

    },
    mutations: {
        setAuthUser(state, user) {
            state.user = user
        },
        clearInfo(state) {
            return state.info = {}
        }
    }
}

