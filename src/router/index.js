import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Auth.vue'

Vue.use(VueRouter)

import notes from '../components/Notes'
import pageNotFound from '../components/404Error'
import archive from '../components/Archive'
import cart from '../components/Cart'
import label from '../components/Label'
import reminders from '../components/Reminders'
import editLabel from "@/components/EditLabel";
import Login from "@/components/Login";
import registration from "@/components/Registration";
import {store} from "@/store";


const checkAuth = (to, from, next) => {
    if (to.path === '/login' || to.path === '/registration' && store.getters["auth/isAuthenficated"]) {
        next('/')
    } else if (!store.getters["auth/isAuthenficated"]) {
        next('/login')
    } else {
        next()
    }

}
const ifNotAuth = (to, from, next) => {
    if (store.getters["auth/isAuthenficated"]) {
        next('/')
    } else {
        next()
    }

}
const routes = [

    {
        path: '/login', component: Login, beforeEnter: ifNotAuth
    },
    {
        path: '/registration', component: registration, beforeEnter: ifNotAuth
    },
    {
        path: '/', name: 'home', component: notes, beforeEnter: checkAuth
    },
    {
        path: '/notes', component: notes, beforeEnter: checkAuth
    },
    {
        path: '/archive', component: archive, beforeEnter: checkAuth
    },
    {
        path: '/cart', component: cart, beforeEnter: checkAuth
    },
    {
        path: '/reminders', component: reminders, beforeEnter: checkAuth
    },
    {
        path: '/label/:id', component: label, beforeEnter: checkAuth
    },
    {
        path: '/edit', component: editLabel, beforeEnter: checkAuth
    },
    {
        path: "*", component: pageNotFound
    }
]

const router = new VueRouter({
    mode: 'history', base: process.env.BASE_URL, routes
})


export default router
