// Toggle password visibility
function togglePassword(icon, fieldId = 'password') {
  const input = document.getElementById(fieldId);
  if (input.type === "password") {
      input.type = "text";
      icon.textContent = "👁️"; // open eye
  } else {
      input.type = "password";
      icon.textContent = "👁️‍🗨️"; // closed eye
  }
}

// Register form submit
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const message = document.getElementById("password-message");

      if (password.length < 8) {
          message.textContent = "❗Password must be at least 8 characters.";
          return;
      }

      if (password !== confirmPassword) {
          message.textContent = "❗Passwords do not match.";
          return;
      }

      message.textContent = "";

      try {
          const res = await fetch("http://localhost:5000/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password }),
          });

          const data = await res.json();
          if (res.ok) {
              alert("✅ Registration successful! Redirecting to login...");
              window.location.href = "login.html";
          } else {
              message.textContent = "❌ " + data.message;
          }
      } catch (err) {
          console.error("Error:", err);
          alert("❌ An error occurred while registering.");
      }
  });
}

// Login form submit
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
          const res = await fetch("http://localhost:5000/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          if (res.ok) {
              localStorage.setItem("token", data.token);
              alert("✅ Login successful!");
              window.location.href = "dashboard.html";
          } else {
              alert("❌ " + data.message);
          }
      } catch (err) {
          console.error("Error:", err);
          alert("❌ An error occurred while logging in.");
      }
  });
}

// ---------- Dashboard Access ----------
const message = document.getElementById("message");
if (message) {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/dashboard", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => (res.ok ? res.text() : Promise.reject("Unauthorized")))
    .then((text) => {
      message.textContent = text;
    })
    .catch(() => {
      alert("❌ Access denied. Please login.");
      window.location.href = "login.html";
    });
}

// ---------- Notes + Google Search ----------
document.addEventListener("DOMContentLoaded", function () {
  const noteInput = document.querySelector(".notes");
  const saveButton = document.querySelector(".save");
  const deleteNoteBtn = document.getElementById("deleteNoteBtn");
  const savedNoteText = document.getElementById("savedNoteText");

  const savedNote = localStorage.getItem("userNote");

  if (savedNote) {
    noteInput.value = savedNote;
    savedNoteText.textContent = savedNote;
  }

  saveButton.addEventListener("click", () => {
    const note = noteInput.value.trim();
    if (note) {
      localStorage.setItem("userNote", note);
      savedNoteText.textContent = note;
      alert("✅ Note saved!");
    } else {
      alert("⚠️ Please write something before saving.");
    }
  });

  deleteNoteBtn.addEventListener("click", () => {
    localStorage.removeItem("userNote");
    noteInput.value = "";
    savedNoteText.textContent = "No note saved yet.";
    alert("🗑️ Note deleted!");
  });

  const searchInput = document.querySelector(".search-bar");
  const searchButton = document.querySelector(".search");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(googleSearchUrl, "_blank");
    } else {
      alert("⚠️ Enter something to search!");
    }
  });
});