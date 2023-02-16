import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import Toasted from 'vue-toasted';
import firebase from "firebase/compat/app";

import 'firebase/compat/auth';
import 'firebase/compat/messaging';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

import vuetify from './plugins/vuetify'
import {firestorePlugin} from 'vuefire'
import {Vuelidate} from "vuelidate";

Vue.config.productionTip = false
Vue.use(firestorePlugin)
Vue.use(Vuelidate)
Vue.use(Toasted)
Vue.use(vuetify)


import {store} from './store/' // Подключение store от vuex


let app;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        store.commit('auth/setAuthUser', user)
    }
    if (!app) {
        app = new Vue({
            router,
            store,
            vuetify,
            render: h => h(App)
        }).$mount('#app')
    }
})



