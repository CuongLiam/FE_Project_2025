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

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const username = loginUsername.value;
  const password = loginPassword.value;

  if (username.trim() === "") {
    usernameError.innerText = `Please fill out your name`;
  } else {
    usernameError.innerText = "";
  }
  if (password.trim() === "") {
    passwordError.innerText = `Please fill out your password`;
  } else {
    passwordError.innerText = "";
  }
});

regBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const username = regUsername.value;
  const email = regEmail.value;
  const password = regPassword.value;
  const confirmPassword = regConfirmPassword.value;

  if (username.trim() === "") {
    regUsernameError.innerText = `Please fill out your name`;
  } else {
    regUsernameError.innerText = "";
  }
  if (email.trim() === "") {
    regEmailError.innerText = `Please fill out your email`;
  } else {
    regEmailError.innerText = "";
  }
  if (password.trim() === "") {
    regPasswordError.innerText = `Please fill out your password`;
  } else {
    regPasswordError.innerText = "";
  }
  if (confirmPassword.trim() === "") {
    regConfirmPasswordError.innerText = `Please fill out your password`;
  } else if (password !== confirmPassword) {
    regConfirmPasswordError.innerText = `Passwords do not match`;
  } else {
    regConfirmPasswordError.innerText = "";
  }
});
