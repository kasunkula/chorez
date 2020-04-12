import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


export const firebaseConfig = {
    apiKey: "AIzaSyBUtVNHGckAlJ__k5mzhGGLmGW7u_gDtDQ",
    authDomain: "chorez-5290e.firebaseapp.com",
    databaseURL: "https://chorez-5290e.firebaseio.com",
    projectId: "chorez-5290e",
    storageBucket: "chorez-5290e.appspot.com",
    messagingSenderId: "291376271294",
    appId: "1:291376271294:web:4278319bd50104516cf3ef"
  };

export const firebaseApp = firebase.initializeApp(firebaseConfig)

export const database = firebase.database();
