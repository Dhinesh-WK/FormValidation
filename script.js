function showForm(form) {
    document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
    document.getElementById(form).classList.add("active");

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    event.target.classList.add("active");
}


function clearSignupInputs() {
    let fields = ["name", "email", "number", "password", "rePassword"];

    fields.forEach(id => {
        document.getElementById(id).value = "";
    });
}

function clearLoginInputs() {
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
}

// LOGIN VALIDATION
function loginValidate(event) {
    event.preventDefault(); 

    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPassword").value;

    if (email === "" || pass === "") {
        loginError.innerText = "All fields are required";
        return false;
    }
    else 
        checkUserLogin(email,pass)

    loginError.innerText = "";
    return true;
}

function checkUserLogin(email,pass){
    let users = JSON.parse(localStorage.getItem("Users")) || [];

    let emailMatch = false
    let passMatch = false

    users.forEach(user => {
        if(user.email == email){
            emailMatch = true
        }
        if(user.email == email && user.password == pass){
            passMatch = true
        }
    })

    if(emailMatch && !passMatch) {
        alert("PassWord is incorrect")
    }
    else if(!emailMatch) {
        alert("email is Not Exists Please do Signup")
    }
    else if(emailMatch && passMatch) {
        alert("Login Successfully")
        clearLoginInputs()
    }
}

let isValidate = true;
// SIGNUP VALIDATION
function signupValidate(event) {
    event.preventDefault(); 

    isValidate = true;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
    let pass = document.getElementById("password").value;
    let repass = document.getElementById("rePassword").value;

    if (!name || !email || !number || !pass || !repass) {
        signupError.innerText = "All fields required";
        isValidate = false;
        return false;
    }

    if (pass !== repass) {
        signupError.innerText = "Passwords do not match";
        isValidate = false;
        return false;
    }

    if (number.length !== 10) {
        signupError.innerText = "Enter 10-digit mobile number";
        isValidate = false;
        return false;
    }

    signupError.innerText = "";

    if(isValidate) {
        checkUserSignUp(email,number,name,pass)
    }

    clearSignupInputs()
    return true;
}

function checkUserSignUp(email, number, name, pass) {

    console.log("Checked user");

    let isPresent = false;

    // Load old users From localStorage
    let users = JSON.parse(localStorage.getItem("Users")) || [];

    users.forEach(user => {
        if (user.email === email || user.number === number) {
            isPresent = true;
        }
    });

    // If already exists
    if (isPresent) {
        alert("Email or Number already exists (Please Login) or Try new Email and Number");
    }

    // If new user
    if (!isPresent) {
        storeUser(name, email, number, pass);
    }
}


function storeUser(name, email, number, pass) {
    console.log("Stored user")
    let newUser = {
        name,
        email,
        number,
        password: pass
    };

    // Load old users or create empty array
    let users = JSON.parse(localStorage.getItem("Users")) || [];

    // Add new user
    users.push(newUser);

    // Save back to localStorage
    localStorage.setItem("Users", JSON.stringify(users));

    alert("Signup Successful");
}
