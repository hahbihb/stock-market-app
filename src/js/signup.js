import * as utils from "./utils.js";

//LIGHT AND DARK MODE
const modeBtn = document.querySelector(".mode-btn");
const rootElement = document.documentElement;

const currentTheme = localStorage.getItem("theme") || "light";
if (currentTheme.includes("dark")) {
  rootElement.classList.add("dark-mode");
}

modeBtn.addEventListener("click", utils.toggleMode);

//MENU BTN
const menuBtn = document.querySelector(".menu-btn");
menuBtn.addEventListener("click", utils.menuToggler);

//INTERSECTION OBSERVER
const header = document.querySelector(".header");
const observer = document.querySelector(".observer");
utils.navObserver(header, observer);

//form
document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Simulate form submission
    alert(`Sign-Up Successful! Welcome, ${username}`);
  });
