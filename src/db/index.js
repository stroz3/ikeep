import {initializeApp} from 'firebase/app'
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Создание конфига firebase
const firebaseConfig = {
    apiKey: "AIzaSyAqQjYNcKy-HIyccCVL8rrzG8tSJBoFQVQ",
    authDomain: "ikeep-cad8c.firebaseapp.com",
    projectId: "ikeep-cad8c",
    storageBucket: "ikeep-cad8c.appspot.com",
    messagingSenderId: "87986400058",
    appId: "1:87986400058:web:af8278e1327cfe01adfe03"
};

// Инициализируем конфиг
const app = firebase.initializeApp(firebaseConfig);


// инициализация firestore/firebase
export const db = app.firestore();


const {Timestamp, GeoPoint} = firebase.firestore
export {Timestamp, GeoPoint}
