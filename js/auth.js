const checkLoginStatus = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "./register_login.html";
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  window.location.href = "./register_login.html";
};

document.getElementById("logout-btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});
