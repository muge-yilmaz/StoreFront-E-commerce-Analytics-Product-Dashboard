document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (fullName.trim().length < 3) {
    alert("Please enter a valid full name (at least 3 characters).");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  localStorage.setItem("userName", fullName.trim());
  localStorage.setItem("isLoggedIn", "true");

  window.location.replace("index.html");
});
