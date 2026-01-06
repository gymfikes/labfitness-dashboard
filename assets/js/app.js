/*************************************************
 * CONFIG
 *************************************************/
const API_URL =
  "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

/*************************************************
 * API FETCH HELPER
 *************************************************/
function apiFetch(params) {
  const query = new URLSearchParams({
    key: API_KEY,
    ...params
  }).toString();

  return fetch(`${API_URL}?${query}`)
    .then(res => res.json());
}

/*************************************************
 * MAIN SUBMIT HANDLER
 *************************************************/
function submitLogin() {
  hideError();

  const role   = document.querySelector('input[name="role"]:checked')?.value;
  const email  = document.getElementById("email")?.value.trim();
  const secret = document.getElementById("secret")?.value.trim();

  if (!role || !email || !secret) {
    return showError("Semua field wajib diisi");
  }

  if (role === "member") {
    loginMember(email, secret);
  } else {
    loginAdmin(email, secret);
  }
}

/*************************************************
 * MEMBER LOGIN
 *************************************************/
function loginMember(email, code) {
  apiFetch({
    action: "login",
    email,
    code
  })
    .then(data => {
      if (data.status !== "success") {
        throw new Error(data.message || "Login member gagal");
      }

      localStorage.setItem("user", JSON.stringify({
        role: "member",
        member_code: data.member_code,
        name: data.name
      }));

      window.location.href = "member.html";
    })
    .catch(err => showError(err.message || "Server tidak merespons"));
}

/*************************************************
 * ADMIN LOGIN
 *************************************************/
function loginAdmin(email, password) {
  apiFetch({
    action: "adminLogin",
    email,
    password
  })
    .then(data => {
      if (data.status !== "success") {
        throw new Error(data.message || "Login admin gagal");
      }

      localStorage.setItem("user", JSON.stringify({
        role: "admin",
        email: data.admin.email
      }));

      window.location.href = "admin.html";
    })
    .catch(err => showError(err.message || "Server tidak merespons"));
}

/*************************************************
 * UX: ERROR HANDLER
 *************************************************/
function showError(message) {
  const el = document.getElementById("error");
  if (!el) return;

  el.innerText = message;
  el.classList.remove("hidden");
}

function hideError() {
  const el = document.getElementById("error");
  if (!el) return;

  el.classList.add("hidden");
}

/*************************************************
 * UX: DYNAMIC PLACEHOLDER & INPUT TYPE
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const secretInput = document.getElementById("secret");

  document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if (!secretInput) return;

      const isMember = radio.value === "member";

      secretInput.placeholder = isMember
        ? "Kode Member"
        : "Password Admin";

      secretInput.type = isMember ? "text" : "password";
      secretInput.value = "";

      hideError();
    });
  });
});
