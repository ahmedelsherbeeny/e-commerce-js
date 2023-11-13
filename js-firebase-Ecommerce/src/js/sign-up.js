
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import '../css/signup.css';



import {
    auth,
    DB
} from "./firebase.js";

import {
    collection, getDocs
} from "firebase/firestore";


const userCollection = collection(DB, "Users");

getDocs(userCollection).then((snapShot) => {
    let users = []
    snapShot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id })


        // console.log(doc._document)
    })
    console.log(users);
})