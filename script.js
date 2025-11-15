let userEmail = "";
let generatedOTP = "";

// ---------------- EMAIL VALIDATION ----------------
function isValidEmail(email) {
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// ---------------- STRONG PASSWORD VALIDATION ----------------
function isStrongPassword(pass) {
    let pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return pattern.test(pass);
}

// ---------------- TOAST NOTIFICATION ----------------
function showToast(msg, type = "info", persistent = false) {
    let toast = document.getElementById("toast");

    clearTimeout(window.toastTimer);

    toast.textContent = msg;

    toast.style.background =
        type === "error" ? "#d9534f" :
            type === "success" ? "#28a745" : "#222";

    toast.classList.add("show");

    if (!persistent) {
        window.toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }
}

// ---------------- TAB SWITCH ----------------
function showForm(form) {
    document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
    document.getElementById(form).classList.add("active");

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

    if (event.target.classList.contains("tab"))
        event.target.classList.add("active");
}

// ---------------- LOGIN ----------------
function loginValidate(event) {
    event.preventDefault();

    let email = loginEmail.value;
    let pass = loginPassword.value;
    userEmail = email;

    if (!email || !pass) {
        loginError.innerText = "All fields required";
        return;
    }

    if (!isValidEmail(email)) {
        loginError.innerText = "Enter a valid email";
        return;
    }

    checkUserLogin(email, pass);
}

function checkUserLogin(email, pass) {
    let users = JSON.parse(localStorage.getItem("Users")) || [];

    let user = users.find(u => u.email === email);

    if (!user) {
        showToast("Email does not exist!", "error");
        forgotPass.style.display = "none";
        return;
    }

    if (user.password !== pass) {
        showToast("Incorrect password", "error");
        forgotPass.style.display = "block";
        return;
    }

    showToast("Login Successful", "success");
    forgotPass.style.display = "none";
    clearLoginInputs();
}

function clearLoginInputs() {
    loginEmail.value = "";
    loginPassword.value = "";
}

// ---------------- SIGNUP ----------------
function signupValidate(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
    let pass = document.getElementById("password").value;
    let repass = document.getElementById("rePassword").value;

    if (!name || !email || !number || !pass || !repass) {
        signupError.innerText = "All fields required";
        return;
    }

    if (!isValidEmail(email)) {
        signupError.innerText = "Enter a valid email";
        return;
    }

    if (!isStrongPassword(pass)) {
        signupError.innerText = "Password must contain 1 uppercase, 1 number, 1 special character & min 8 chars";
        return;
    }

    if (pass !== repass) {
        signupError.innerText = "Passwords do not match";
        return;
    }

    if (number.length !== 10) {
        signupError.innerText = "Enter 10-digit number";
        return;
    }

    signupError.innerText = "";
    checkSignup(email, number, name, pass);
}

function checkSignup(email, number, name, pass) {
    let users = JSON.parse(localStorage.getItem("Users")) || [];

    if (users.some(u => u.email === email || u.number === number)) {
        showToast("Email or Number already exists", "error");
        return;
    }

    storeUser(name, email, number, pass);
}

function storeUser(name, email, number, pass) {
    let users = JSON.parse(localStorage.getItem("Users")) || [];

    users.push({
        name,
        email,
        number,
        password: pass
    });

    localStorage.setItem("Users", JSON.stringify(users));

    showToast("Signup Successful", "success");
    clearSignupInputs();
}

function clearSignupInputs() {
    ["name", "email", "number", "password", "rePassword"].forEach(id => {
        document.getElementById(id).value = "";
    });
}

// ---------------- FORGOT PASSWORD ----------------
forgotPass.addEventListener("click", () => {
    showForm("otpArea");

    generatedOTP = generateOTP();

    showToast("OTP: " + generatedOTP, "success", true);

    document.getElementById("resendOTP").style.display = "block";
});

// ---------------- OTP SECTION ----------------
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

document.getElementById("resendOTP").addEventListener("click", () => {
    generatedOTP = generateOTP();
    showToast("New OTP: " + generatedOTP, "success", true);
});

function validateOTP(event) {
    event.preventDefault();

    let otp = document.getElementById("otp").value;

    if (otp == generatedOTP) {
        showToast("OTP Verified ✔", "success");

        setTimeout(() => {
            document.getElementById("toast").classList.remove("show");
        }, 800);

        showForm("changePass");
        otpError.innerText = "";
    }
    else {
        otpError.innerText = "Invalid OTP";
    }
}

// ---------------- UPDATE PASSWORD ----------------
function updatePassword(event) {
    event.preventDefault();

    let pass = document.getElementById("pass").value;
    let repass = document.getElementById("rePass").value;

    if (!pass || !repass) {
        setNewPass.innerText = "Fill both fields";
        return;
    }

    if (!isStrongPassword(pass)) {
        setNewPass.innerText = "Weak password (need uppercase, number & special char)";
        return;
    }

    if (pass !== repass) {
        setNewPass.innerText = "Passwords do not match";
        return;
    }

    let users = JSON.parse(localStorage.getItem("Users")) || [];

    users = users.map(user => {
        if (user.email === userEmail) {
            user.password = pass;
        }
        return user;
    });

    localStorage.setItem("Users", JSON.stringify(users));

    showToast("Password Updated", "success");
    document.getElementById("pass").value = "";
    document.getElementById("rePass").value = "";
    setTimeout(() => {
        location.reload();
    }, 1200);

}

// ---------------- TABS ----------------
document.getElementById("loginTab").addEventListener("click", () => {
    clearAllInputs();
});

document.getElementById("signupTab").addEventListener("click", () => {
    clearAllInputs();
});

// ---------------- CLEAR ALL INPUTS ----------------
function clearAllInputs() {
    document.querySelectorAll("input").forEach(inp => inp.value = "");

    document.querySelectorAll(".error").forEach(err => err.innerText = "");
    document.getElementById("forgotPass").style.display = "none";

    document.getElementById("toast").classList.remove("show");
}


// ---------------- PASSWORD EYE TOGGLE ----------------

// Generic toggle function (for all password fields)
function toggleVisibility(inputId, iconElement) {
    let input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        iconElement.classList.remove("fa-eye");
        iconElement.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        iconElement.classList.remove("fa-eye-slash");
        iconElement.classList.add("fa-eye");
    }
}

// SIGNUP + CHANGE PASSWORD Eye Toggle
function togglePassword(icon) {
    toggleVisibility("password", icon.querySelector("i"));
}

// LOGIN Eye Toggle
function toggleLoginPassword(icon) {
    toggleVisibility("loginPassword", icon.querySelector("i"));
}

// CHANGE PASSWORD (new password field)
function toggleNewPass(icon) {
    toggleVisibility("pass", icon.querySelector("i"));
}

