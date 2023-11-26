
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import '../css/signup.css';
import swal from 'sweetalert';




import {
    auth, createUserWithEmailAndPassword, doc,
    setDoc,
    DB, collection,
    getDocs
} from "./firebase.js";
import { validateUsername, validateEmail, validatePassword, showError, clearError } from './validation.js';




// const userCollection = collection(DB, "Users");

// getDocs(userCollection).then((snapShot) => {
//     let users = []
//     snapShot.docs.forEach((doc) => {
//         users.push({ ...doc.data(), id: doc.id })


//     })
//     console.log(users);
// })



// Import the necessary functions from the Firebase SDKs

// Select the sign-up form elements
const signUpForm = document.querySelector("form");
const userNameInput = document.getElementById("userName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Select the error message elements
const userNameError = document.getElementById("userNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

var useErr = document.getElementById("userNameError");
var emailErr = document.getElementById("emailError");
var passwordErr = document.getElementById("passwordError");




userNameInput.addEventListener("blur", () => {
    const username = userNameInput.value;
    const error = validateUsername(username);
    if (error) {
        showError(userNameError, error);
        useErr.style.background = '#f3bdbd'
        useErr.style.width = '58%'

        useErr.style.marginTop = '6px'

        useErr.style.borderRadius = '4px'
        useErr.style.fontSize = '14px'

        useErr.style.fontFamily = 'math'
        useErr.style.padding = '2px'


    } else {
        clearError(userNameError);
        useErr.removeAttribute('style')

    }
});

emailInput.addEventListener("blur", () => {
    const email = emailInput.value;
    const error = validateEmail(email);
    if (error) {
        showError(emailError, error);

        emailErr.style.background = '#f3bdbd'
        emailErr.style.width = '58%'

        emailErr.style.marginTop = '6px'

        emailErr.style.borderRadius = '4px'
        emailErr.style.fontSize = '14px'

        emailErr.style.fontFamily = 'math'
        emailErr.style.padding = '2px'
    } else {
        clearError(emailError);
        emailErr.removeAttribute('style')

    }
});

passwordInput.addEventListener("blur", () => {
    const password = passwordInput.value;
    const error = validatePassword(password);
    if (error) {
        showError(passwordError, error);

        passwordErr.style.background = '#f3bdbd'
        passwordErr.style.width = '58%'

        passwordErr.style.marginTop = '6px'

        passwordErr.style.borderRadius = '4px'
        passwordErr.style.fontSize = '14px'

        passwordErr.style.fontFamily = 'math'
        passwordErr.style.padding = '2px'

    } else {
        clearError(passwordError);
        passwordErr.removeAttribute('style')

    }
});

// Add an event listener to the sign-up form
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission

    const userName = userNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // Validate the form fields
    const usernameError = validateUsername(userName);
    const emailerror = validateEmail(email);
    const passworderror = validatePassword(password);

    // Validate the required fields
    if (!userName) {
        showError(userNameError, "Username is required");
        useErr.style.background = '#f3bdbd'
        useErr.style.width = '58%'

        useErr.style.marginTop = '6px'

        useErr.style.borderRadius = '4px'
        useErr.style.fontSize = '14px'

        useErr.style.fontFamily = 'math'
        useErr.style.padding = '2px'
    } else {
        clearError(userNameError);
    }

    if (!email) {
        showError(emailError, "Email is required");

        emailErr.style.background = '#f3bdbd'
        emailErr.style.width = '58%'

        emailErr.style.marginTop = '6px'

        emailErr.style.borderRadius = '4px'
        emailErr.style.fontSize = '14px'

        emailErr.style.fontFamily = 'math'
        emailErr.style.padding = '2px'
    } else {
        clearError(emailError);
    }

    if (!password) {
        showError(passwordError, "Password is required");
        passwordErr.style.background = '#f3bdbd'
        passwordErr.style.width = '58%'

        passwordErr.style.marginTop = '6px'

        passwordErr.style.borderRadius = '4px'
        passwordErr.style.fontSize = '14px'

        passwordErr.style.fontFamily = 'math'
        passwordErr.style.padding = '2px'
    } else {
        clearError(passwordError);
        passwordErr.removeAttribute('style')
    }


    if (usernameError) {
        // Display the username error message
        // ...
        showError(userNameError, usernameError);
    } else {
        clearError(userNameError);
    }

    if (emailerror) {
        // Display the email error message
        // ...
        showError(emailError, emailerror);
    } else {
        clearError(emailError);
    }
    if (passworderror) {
        // Display the password error message
        // ...
        showError(passwordError, passworderror);
    } else {
        clearError(passwordError);
    }

    // All form fields are valid, proceed with sign-up


    // Create a new user account with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User account created successfully
            const user = userCredential.user;

            // Store additional user information in the Firestore database
            const userDocRef = doc(DB, "Users", user.uid);
            const userData = {
                username: userName,
                email: user.email,
            };

            return setDoc(userDocRef, userData); // Save user data in Firestore
        })
        .then(() => {
            // Sign-up process complete
            // You can redirect the user to another page or show a success message
            signUpForm.reset()
            window.location.href = "index.html";


        })
        .catch((error) => {
            // Handle sign-up errors
            if (!usernameError &&
                !emailerror &&
                !passworderror) {

                swal(error.message, "", "error");
            }

            // You can display an error message to the user
        });




});