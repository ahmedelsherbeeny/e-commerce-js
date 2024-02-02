import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css'
import '../css/signup.css';
import '../js/particles.min.js';
import '../js/custom.js';

import swal from 'sweetalert';
import Swal from 'sweetalert2'

import {
    auth,
    collection,
    getDocs,
    query,
    signInWithEmailAndPassword, DB, where
} from "./firebase.js";
import {
    validateEmail,
    validatePassword,
    showError,
    clearError
} from './validation.js';




const signInForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailErrorEle = document.getElementById("emailError");
const passwordErrorEle = document.getElementById("passwordError");
const loader = document.getElementById("loader");
const loaderOverlay = document.getElementById("overlay");
let userData = {}; // User data object
let userKey = ""; // User key (uid)


const addBlurListener = (inputElement, errorElement, validationFunction) => {
    inputElement.addEventListener("blur", () => {
        const value = inputElement.value;
        const error = validationFunction(value);
        if (error) {
            showError(errorElement, error);
            errorElement.style.background = '#f3bdbd';
            errorElement.style.width = '58%';
            errorElement.style.marginTop = '6px';
            errorElement.style.borderRadius = '4px';
            errorElement.style.fontSize = '14px';
            errorElement.style.fontFamily = 'math';
            errorElement.style.padding = '2px';
        } else {
            clearError(errorElement);
            errorElement.removeAttribute('style');
        }
    });
};

addBlurListener(emailInput, emailErrorEle, validateEmail);
addBlurListener(passwordInput, passwordErrorEle, validatePassword);

// Add an event listener to the sign-up form
signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const showErrorStyle = (errorElement) => {
        errorElement.style.background = '#f3bdbd';
        errorElement.style.width = '58%';
        errorElement.style.marginTop = '6px';
        errorElement.style.borderRadius = '4px';
        errorElement.style.fontSize = '14px';
        errorElement.style.fontFamily = 'math';
        errorElement.style.padding = '2px';
    };

    const clearErrorStyle = (errorElement) => {
        clearError(errorElement);
        errorElement.removeAttribute('style');
    };



    if (!email) {
        showError(emailErrorEle, "Email is required");
        showErrorStyle(emailErrorEle);
    } else {
        clearErrorStyle(emailErrorEle);

        // Check if the email exists in the database
        const usersCollectionRef = collection(DB, "Users");
        const emailQuery = query(usersCollectionRef, where("email", "==", email));
        getDocs(emailQuery).then(querySnap => {
            if (querySnap.empty) {
                // Email does not exist
                swal("This Email Does not exist", "", "error");
                return;

            }
        })
    }

    if (!password) {
        showError(passwordErrorEle, "Password is required");
        showErrorStyle(passwordErrorEle);
    } else {
        clearErrorStyle(passwordErrorEle);
    }



    if (emailError) {
        showError(emailErrorEle, emailError);
    } else {
        clearErrorStyle(emailErrorEle);
    }

    if (passwordError) {
        showError(passwordErrorEle, passwordError);
    } else {
        clearErrorStyle(passwordErrorEle);
    }

    if (!emailError && !passwordError) {
        loader.classList.add("show");
        loaderOverlay.classList.add("show");
        signInWithEmailAndPassword(auth, email, password)
            .then((Credential) => {

                const user = Credential.user
                // Update user data and user key
                userData = {
                    displayName: user.displayName,
                    email: user.email,
                };
                userKey = user.uid;

                localStorage.setItem("userData", JSON.stringify(userData));
                localStorage.setItem("userKey", JSON.stringify(userKey));
            })
            .then(() => {
                signInForm.reset();
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
                loader.classList.remove("show");
                loaderOverlay.classList.remove("show");
                const toast = Swal.mixin({

                    position: "top-end",
                    showConfirmButton: false,
                    toast: true,
                    timer: 2000,
                    timerProgressBar: true,
                    background: "#fff",
                });
                toast.fire({
                    icon: "success",
                    title: "Signed In Successfully",

                })
            })
            .catch((error) => {
                loader.classList.remove("show");
                loaderOverlay.classList.remove("show");
                if (error.message === "Firebase: Error (auth/invalid-login-credentials).") {
                    swal("Invalid Email or Password", "", "error");


                } else {

                    swal(error.message, "", "error");
                }
            });
    }
});







