/*************************************************
 * CONFIG
 *************************************************/
const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

/*************************************************
 * AUTH GUARD
 *************************************************/
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "member" || !user.member_code) {
  window.location.href = "index.html";
}

/*************************************************
 * LOGOUT
 *************************************************/
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/*************************************************
 * SIDEBAR MOBILE TOGGLE
 *************************************************/
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  if (!sidebar || !overlay) return;

  const isHidden = sidebar.classList.contains("translate-x-full");

  if (isHidden) {
    sidebar.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
  } else {
    sidebar.classList.add("translate-x-full");
    overlay.classList.add("hidden");
  }
}

/*************************************************
 * API HELPER
 *************************************************/
function apiFetch(params) {
  const query = new URLSearchParams({
    key: API_KEY,
    ...params
  }).toString();

  return fetch(`${API_URL}?${query}`).then(res => res.json());
}

/*************************************************
 * LOAD MEMBER DASHBOARD
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  loadMemberDashboard();
});

function loadMemberDashboard() {
  apiFetch({
    action: "memberDashboard",
    code: user.member_code
  })
    .then(data => {
      if (data.status !== "success") {
        showError("Gagal memuat data member");
        return;
      }
      renderMember(data);
    })
    .catch(() => showError("Tidak dapat terhubung ke server"));
}

/*************************************************
 * RENDER MEMBER UI
 *************************************************/
function renderMember(data) {
  setText("name", data.full_name);
  setText("code", user.member_code);
  setText("days", `${data.days_remaining ?? "-"} hari`);
  setText("level", data.membership_type || "-");
  setText("attendance", data.attendance_30d ?? "0");
  setText("attendanceTotal", data.attendance_total ?? "0");
  setText("program", data.program || "-");
  setText("programDate", data.program_sent_at ? `Dikirim: ${data.program_sent_at}` : "");
  setText("statusKeaktifan", data.status_keaktifan || "-");

  setBadge(Number(data.attendance_30d || 0));
}

/*************************************************
 * SAFE DOM SETTER
 *************************************************/
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "-";
}

/*************************************************
 * BADGE LOGIC
 *************************************************/
function setBadge(attendance) {
  const badge = document.getElementById("badge");
  if (!badge) return;

  if (attendance >= 20) {
    badge.innerText = "🔥 Consistent";
    badge.className = "text-sm text-red-500 font-semibold";
  } else if (attendance >= 10) {
    badge.innerText = "💪 Active";
    badge.className = "text-sm text-green-600 font-semibold";
  } else {
    badge.innerText = "🆕 New Member";
    badge.className = "text-sm text-gray-500 font-semibold";
  }
}

/*************************************************
 * ERROR HANDLER
 *************************************************/
function showError(message) {
  console.error(message);
  alert(message);
}
