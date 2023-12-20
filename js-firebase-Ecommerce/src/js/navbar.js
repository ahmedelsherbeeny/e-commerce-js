
import {
    auth, onAuthStateChanged, signOut
} from "./firebase.js";
import '../css/navbar.css'



navBar()

function navBar() {
    // navbar toggler btn
    document.querySelector('.toggler-btn').addEventListener('click', function (e) {
        this.classList.toggle('close')
    })

}




const userDropdownBtn = document.getElementById("userDropdown");
const signinBtn = document.querySelector('#signin');
const signupBtn = document.querySelector('#signup');
const signOutBtn = document.querySelector('#signOutBtn');

// Check the authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userDropdownBtn.style.display = 'block'; // Show the user profile dropdown

        signinBtn.style.display = "none";
        signupBtn.style.display = "none";

        // Update the user profile button with the username or email
        userDropdownBtn.textContent = user.displayName

        // Handle sign out
        signOutBtn.addEventListener('click', () => {
            signOut(auth)
                .then(() => {


                    localStorage.removeItem("userData");
                    localStorage.removeItem("userKey");
                    // Redirect or perform any additional actions after sign out
                    window.location.href = "sign-in.html"; // Redirect to a sign-out success page
                })
                .catch((error) => {
                    console.log(error.message);
                });
        });
    } else {
        // User is signed out
        userDropdownBtn.style.display = 'none'; // Hide the user profile dropdown
        signinBtn.style.display = "block"; // Show the "Sign In" button
        signupBtn.style.display = "block"; // Show the "Sign Up" button
    }
});



document.addEventListener("DOMContentLoaded", function () {
    var navbar = document.getElementById("navbar");
    var navbarOffsetTop = navbar.offsetTop;
    var scrollThreshold = 100; // Adjust this value as needed

    function updateNavbarPosition() {
        if (window.pageYOffset >= scrollThreshold) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }

    // Update the navbar position on scroll
    window.addEventListener("scroll", updateNavbarPosition);
});