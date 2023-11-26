

// Validate the password
export function validatePassword(password) {
    if (!password) {
        return "password is required";
    }
    // Password must be at least 6 characters long
    if (password.length < 6) {
        return "Password must be at least 6 characters long";
    }

    // Password must contain at least one special character
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharacterRegex.test(password)) {
        return "Password must contain at least one special character";
    }

    return ""; // Empty string indicates a valid password
}


// Validate the username
export function validateUsername(username) {
    if (!username) {
        return "Username is required";
    }
    // Username must be at least 3 characters long
    if (username.length < 3) {
        return "Username must be at least 3 characters long";
    }
    // Add any additional validation rules for the username
    // ...

    return ""; // Empty string indicates a valid username
}

// Validate the email
export function validateEmail(email) {
    if (!email) {
        return "email is required";
    }
    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Invalid email address";
    }

    return ""; // Empty string indicates a valid email
}

export function showError(element, error) {
    element.textContent = error;
}

// Function to clear the error message
export function clearError(element) {
    element.textContent = "";
}