
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css'
import '../css/signup.css';
import swal from 'sweetalert';
import Swal from 'sweetalert2'

import {
    auth,
    createUserWithEmailAndPassword,
    doc,
    setDoc,
    DB, GoogleAuthProvider, signInWithPopup, signInWithRedirect
} from "./firebase.js";
import {
    validateUsername,
    validateEmail,
    validatePassword,
    showError,
    clearError
} from './validation.js';




const signUpForm = document.querySelector("form");
const userNameInput = document.getElementById("userName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userNameError = document.getElementById("userNameError");
const emailErrorEle = document.getElementById("emailError");
const passwordErrorEle = document.getElementById("passwordError");
const loader = document.getElementById("loader");



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

addBlurListener(userNameInput, userNameError, validateUsername);
addBlurListener(emailInput, emailErrorEle, validateEmail);
addBlurListener(passwordInput, passwordErrorEle, validatePassword);

// Add an event listener to the sign-up form
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();


    const userName = userNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const usernameError = validateUsername(userName);
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

    if (!userName) {
        showError(userNameError, "Username is required");
        showErrorStyle(userNameError);
    } else {
        clearErrorStyle(userNameError);
    }

    if (!email) {
        showError(emailErrorEle, "Email is required");
        showErrorStyle(emailErrorEle);
    } else {
        clearErrorStyle(emailErrorEle);
    }

    if (!password) {
        showError(passwordErrorEle, "Password is required");
        showErrorStyle(passwordErrorEle);
    } else {
        clearErrorStyle(passwordErrorEle);
    }

    if (usernameError) {
        showError(userNameError, usernameError);
    } else {
        clearErrorStyle(userNameError);
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

    if (!usernameError && !emailError && !passwordError) {
        loader.classList.add("show");

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userDocRef = doc(DB, "Users", user.uid);
                const userData = {
                    username: userName,
                    email: user.email,
                };

                return setDoc(userDocRef, userData);
            })
            .then(() => {
                signUpForm.reset();
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
                loader.classList.remove("show");

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
                    title: "Signed Up Successfully",

                })
            })
            .catch((error) => {
                loader.classList.remove("show");

                if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                    swal("This Email Already Exists", "", "error");


                } else {

                    swal(error.message, "", "error");
                }
            });
    }
});


const gmailSignUpBtn = document.getElementById("gmailSignUpBtn");
gmailSignUpBtn.addEventListener("click", () => {
    // TODO: Implement sign-up with Gmail functionality
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log(credential);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);

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
                title: "Signed Up Successfully",

            })



            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });


});


