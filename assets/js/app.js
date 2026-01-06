const API_URL = "PASTE_URL_APPS_SCRIPT_KAMU_DI_SINI";

function loginMember() {
  const email = document.getElementById("email").value.trim();
  const code  = document.getElementById("code").value.trim();

  if (!email || !code) {
    showError("Email dan kode wajib diisi");
    return;
  }

  fetch(`${API_URL}?action=login&email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`)
    .then(res => res.json())
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

function loginAdmin() {
  const email = document.getElementById("email").value.trim();
  const code  = document.getElementById("code").value.trim();

  if (!email || !code) {
    showError("Email dan password wajib diisi");
    return;
  }

  fetch(`${API_URL}?action=adminLogin&email=${encodeURIComponent(email)}&password=${encodeURIComponent(code)}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify({
          role: "admin",
          email: data.admin.email
        }));
        window.location.href = "admin.html";
      } else {
        showError(data.message || "Login admin gagal");
      }
    })
    .catch(() => showError("Gagal terhubung ke server"));
}

function showError(msg) {
  const el = document.getElementById("error");
  el.innerText = msg;
  el.classList.remove("hidden");
}
