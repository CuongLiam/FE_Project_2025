const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const saveToLocalStorage = () =>{
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("admins", JSON.stringify(admins));
}

const loadFromLocalStorage = () => {
  const usersData = localStorage.getItem("users");
  const adminsData = localStorage.getItem("admins");

  if (usersData) {
    users = JSON.parse(usersData);
  } else {
    // Initialize with example user data if no data exists in localStorage
    users = [
      {
        id: 1,
        fullname: "Josh Liam",
        email: "abc@gmail.com",
        password: "1234",
        role: "user",
      },
    ];
    saveToLocalStorage(); // Save the example data to localStorage
  }

  if (adminsData) {
    admins = JSON.parse(adminsData);
  } else {
    // Initialize with example admin data if no data exists in localStorage
    admins = [
      {
        id: 1,
        fullname: "admin",
        email: "admin@gmail.com",
        password: "1234",
        role: "admin",
      },
    ];
    saveToLocalStorage(); // Save the example data to localStorage
  }
};

let users  = [
  // {
  //   id : 1,
  //   fullname : "Josh Liam",
  //   email : "abc@gmail.com",
  //   password : "1234",
  //   role : "user"
  // }
];

let admins = [
  // {
  //   id : 1,
  //   fullname : "admin",
  //   email : "admin@gmail.com",
  //   password : "1234",
  //   role : "admin"
  // }
];

loadFromLocalStorage();

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
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "user"); // Save role if needed
      // Show success toast
      Toast.fire({
        icon: "success",
        title: "Welcome, " +username,
      });

       // Redirect to home page
      setTimeout(() => {
        window.location.href = "home.html";
      }, 3000); // Redirect after 1 second

    } else if (admin) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      
      // Show success toast
      Toast.fire({
        icon: "success",
        title: "Welcome admin, " +username,
      });

      setTimeout(() => {
        window.location.href = "category_manager.html";
      }, 3000);
    } else {
      usernameError.innerText = `Invalid username or password`;
    }
  }
});

//  **register
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

  saveToLocalStorage();
});

// Email validation function
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );// regular expression, biet thuc chinh quy
};