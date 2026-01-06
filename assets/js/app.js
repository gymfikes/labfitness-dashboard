/*************************************************
 * CONFIG
 *************************************************/
const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

/*************************************************
 * HELPER FETCH
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
 * MEMBER LOGIN
 *************************************************/
function loginMember() {
  const email = document.getElementById("email").value.trim();
  const code  = document.getElementById("code").value.trim();

  if (!email || !code) {
    showError("Email dan kode wajib diisi");
    return;
  }

  apiFetch({
    action: "login",
    email,
    code
  })
    .then(data => {
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify({
          role: "member",
          member_code: data.member_code,
          name: data.name
        }));
        window.location.href = "member.html";
      } else {
        showError(data.message || "Login gagal");
      }
    })
    .catch(() => showError("Gagal terhubung ke server"));
}

/*************************************************
 * ADMIN LOGIN
 *************************************************/
function loginAdmin() {
  con
