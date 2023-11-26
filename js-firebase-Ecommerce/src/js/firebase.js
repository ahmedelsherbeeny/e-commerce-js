
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, doc,
    setDoc, collection,
    getDocs
} from "firebase/firestore";
import {
    getAuth, createUserWithEmailAndPassword
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA908gW7DBuS7cJINdTDEKCgVNbbufWQ6E",
    authDomain: "fir-9-practise-48629.firebaseapp.com",
    projectId: "fir-9-practise-48629",
    storageBucket: "fir-9-practise-48629.appspot.com",
    messagingSenderId: "117427272300",
    appId: "1:117427272300:web:3150a25e1b454d8b813649"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const DB = getFirestore(app);
export {
    doc, setDoc, createUserWithEmailAndPassword, collection,
    getDocs
};
