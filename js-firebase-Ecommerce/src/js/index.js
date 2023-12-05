

import '../css/navbar.css'
import '../css/index.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'

import {
    auth,
    signOut
} from "./firebase.js";

import eLogo from '../images/e-logo.jpg';




document.addEventListener("DOMContentLoaded", () => {
    // Listen for authentication state changes
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // User is signed in, hide the signup and sign-in buttons
            const signInBtn = document.getElementById("signin");
            const signUpBtn = document.getElementById("signup");

            signInBtn.style.display = "block";
            signUpBtn.style.display = "block";

            // Show the dropdown button

        } else {
            const userDropdownBtn = document.getElementById("userDropdown");
            userDropdownBtn.style.display = "block"

            console.log(user); // Check the current user

        }
    });
});




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



