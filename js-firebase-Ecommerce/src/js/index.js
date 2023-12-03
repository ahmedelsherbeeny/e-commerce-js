

import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';



import '../css/index.css'
import {
    auth,
    signOut
} from "./firebase.js";

import eLogo from '../images/e-logo.jpg';





const signOutBtn = document.getElementById("signOutBtn");
signOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.href = "sign-in.html"; // Redirect to a sign-out success page
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
});

