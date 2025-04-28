let users  = [
  {
    id : 1,
    fullname : "Josh Liam",
    email : "abc@gmail.com",
    password : "1234",
    role : "user"
  }
];

let admins = [
  {
    id : 1,
    fullname : "admin",
    email : "admin@gmail.com",
    password : "1234",
    role : "admin"
  }
]

// let userExample = {
//   id : 1,
//   fullname : "Josh Liam",
//   email : "abc@gmail.com",
//   password : "1234",
//   role : "user"
// }
// users.push(userExample);

console.log(users);
console.log(admins);


const wrapper = document.getElementById("wrapper");

document.querySelector(".register-link").addEventListener("click", (e) => {
  e.preventDefault();
  wrapper.classList.add("active");
});

document.querySelector(".login-link").addEventListener("click", (e) => {
  e.preventDefault();
  wrapper.classList.remove("active");
});

const loginBtn = document.getElementById("login-btn");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const usernameError = document.getElementById("login-username-error");
const passwordError = document.getElementById("login-password-error");

const regBtn = document.getElementById("reg-btn");
const regUsername = document.getElementById("reg-username");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regConfirmPassword = document.getElementById("reg-confirm-password");
const regUsernameError = document.getElementById("reg-username-error");
const regEmailError = document.getElementById("reg-email-error");
const regPasswordError = document.getElementById("reg-password-error");
const regConfirmPasswordError = document.getElementById(
  "reg-confirm-password-error"
);

//     login
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  let isValid = true;
  if (username === "") {
    usernameError.innerText = `Please fill out your name`;
    isValid = false;
  } else {
    usernameError.innerText = "";
  }
  if (password === "") {
    passwordError.innerText = `Please fill out your password`;
    isValid = false;
  } else {
    passwordError.innerText = "";
  }
  if (isValid) {
    // decentralization
    // check if the user belongs to admins or users
    const user = users.find(
      (user)=> user.fullname === username && user.password === password
    );
    const admin = admins.find(
      (admin)=> admin.fullname === username && admin.password === password
    );

    if (user) {
      window.location.href = "home.html";
    } else if (admin) {
      window.location.href = "category_manager.html";
    } else {
      usernameError.innerText = `Invalid username or password`;
    }
  }
});

//    register
regBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const username = regUsername.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();
  const confirmPassword = regConfirmPassword.value.trim();

  let isValid = true;

  // Validate username
  if (username === "") {
    regUsernameError.innerText = `Please fill out your name`;
    isValid = false;
  } else {
    regUsernameError.innerText = "";
  }

  // Validate email
  if (email === "") {
    regEmailError.innerText = `Email cannot be empty`;
    isValid = false;
  } else if (!validateEmail(email)) {
    regEmailError.innerText = `Invalid email format`;
    isValid = false;
  } else if (users.some((user) => user.email === email)) {
    regEmailError.innerText = `Email already exists`;
    isValid = false;
  } else {
    regEmailError.innerText = "";
  }

  // Validate password
  if (password === "") {
    regPasswordError.innerText = `Password cannot be empty`;
    isValid = false;
  } else if (password.length < 8) {
    regPasswordError.innerText = `Password must be at least 8 characters`;
    isValid = false;
  } else {
    regPasswordError.innerText = "";
  }

  // Validate confirm password
  if (confirmPassword === "") {
    regConfirmPasswordError.innerText = `Please confirm your password`;
    isValid = false;
  } else if (password !== confirmPassword) {
    regConfirmPasswordError.innerText = `Passwords do not match`;
    isValid = false;
  } else {
    regConfirmPasswordError.innerText = "";
  }

  if (isValid) {
    const newUser = {
      id: users.length + 1,
      fullname: username,
      email: email,
      password: password,
      role: "user",
    };
    users.push(newUser);
  
    // Show the registration success modal
    const successModal = new bootstrap.Modal(document.getElementById("registrationSuccessModal"));
    successModal.show();
    
    regUsername.value = "";
    regEmail.value = "";
    regPassword.value = "";
    regConfirmPassword.value = "";

    // Switch back to login form after the modal is closed
    document.getElementById("registrationSuccessModal").addEventListener("hidden.bs.modal", () => {
      wrapper.classList.remove("active");
    });
  }
  console.log(users);
});

// Email validation function
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );// regular expression, biet thuc chinh quy
};