console.log("YAXH JavaScript is working!");
//login functionality
const loginForm = document.querySelector("form");
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

const email = document.getElementById("email").value;