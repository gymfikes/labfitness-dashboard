function submitLogin() {
  hideError();

  const role = document.querySelector("input[name=role]:checked").value;
  const email = document.getElementById("email").value.trim();
  const secret = document.getElementById("secret").value.trim();

  if (!email || !secret) {
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
        return showError(data.message || "Login member gagal");
      }

      localStorage.setItem("user", JSON.stringify({
        role: "member",
        member_code: data.member_code,
        name: data.name
      }));

      window.location.href = "member.html";
    })
    .catch(() => showError("Server tidak merespons"));
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
        return showError(data.message || "Login admin gagal");
      }

      localStorage.setItem("user", JSON.stringify({
        role: "admin",
        email: data.admin.email
      }));

      window.location.href = "admin.html";
    })
    .catch(() => showError("Server tidak merespons"));
}

/*************************************************
 * ERROR UX
 *************************************************/
function showError(msg) {
  const el = document.getElementById("error");
  el.innerText = msg;
  el.classList.remove("hidden");
}

function hideError() {
  document.getElementById("error").classList.add("hidden");
}
