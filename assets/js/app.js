const API_URL = "PASTE_URL_APPS_SCRIPT_KAMU_DI_SINI";

function loginMember() {
  const email = document.getElementById("email").value;
  const code  = document.getElementById("code").value;

  fetch(`${API_URL}?action=login&email=${email}&code=${code}`)
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
        document.getElementById("error").innerText = data.message;
        document.getElementById("error").classList.remove("hidden");
      }
    });
}
function loginAdmin() {
  const email = document.getElementById("email").value;
  const code  = document.getElementById("code").value;

  fetch(`${API_URL}?action=adminLogin&email=${email}&password=${code}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify({
          role: "admin",
          email: data.admin.email
        }));
        window.location.href = "admin.html";
      } else {
        document.getElementById("error").innerText = data.message;
        document.getElementById("error").classList.remove("hidden");
      }
    });
}
