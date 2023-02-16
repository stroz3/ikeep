import Vue from 'vue'
import {vuexfireMutations} from 'vuexfire'
import Vuex from 'vuex'

import 'firebase/compat/auth';
import 'firebase/compat/messaging';
import 'firebase/compat/firestore';

Vue.use(Vuex)

// import menu from './modules/menu'
import notes from "./modules/notes";
import labels from './modules/labels';
import auth from "@/store/modules/auth";
import main from "@/store/modules/main";

export const store = new Vuex.Store({

    modules: {
        notes,
        labels,
        auth,
        main
    },
    mutations: {
        ...vuexfireMutations
    },
    strict: process.env.NODE_ENV !== '"production"'
})
