/*************************************************
 * CONFIG
 *************************************************/
const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

/*************************************************
 * AUTH GUARD
 *************************************************/
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "member" || !user.member_code) window.location.href = "index.html";

/*************************************************
 * LOGOUT
 *************************************************/
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/*************************************************
 * API HELPER
 *************************************************/
function apiFetch(params) {
  const query = new URLSearchParams({ key: API_KEY, ...params }).toString();
  return fetch(`${API_URL}?${query}`).then(res => res.json());
}

/*************************************************
 * LOAD MEMBER DASHBOARD
 *************************************************/
document.addEventListener("DOMContentLoaded", loadMemberDashboard);

function loadMemberDashboard() {
  apiFetch({ action: "memberDashboard", code: user.member_code })
    .then(data => {
      if (data.status !== "success") return showError("Gagal memuat data member");
      renderMember(data);
    })
    .catch(() => showError("Tidak dapat terhubung ke server"));
}

/*************************************************
 * RENDER MEMBER DATA
 *************************************************/
function renderMember(data) {
  // Desktop
  setText("name", data.full_name);
  setText("status", data.status_keaktifan);
  setText("badge", data.attendance_30d_badge);
  setText("code", user.member_code);
  setText("days", `${data.days_remaining ?? "-"} hari`);
  setText("level", data.membership_type || "-");
  setText("attendance", data.attendance_30d ?? "0");
  setText("attendanceTotal", data.attendance_total ?? "0");
  setText("program", data.program || "-");
  setText("programDate", data.program_sent_at ? `Dikirim: ${data.program_sent_at}` : "");

  // Mobile
  setText("nameMobile", data.full_name);
  setText("statusMobile", data.status_keaktifan);
  setText("badgeMobile", data.attendance_30d_badge);
  setText("codeMobile", user.member_code);
  setText("daysMobile", `${data.days_remaining ?? "-"} hari`);
  setText("levelMobile", data.membership_type || "-");
  setText("attendanceMobile", data.attendance_30d ?? "0");
  setText("attendanceTotalMobile", data.attendance_total ?? "0");
  setText("programMobile", data.program || "-");
  setText("programDateMobile", data.program_sent_at ? `Dikirim: ${data.program_sent_at}` : "");
}

/*************************************************
 * SAFE DOM SETTER
 *************************************************/
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "-";
}

/*************************************************
 * ERROR HANDLER
 *************************************************/
function showError(msg) {
  console.error(msg);
  alert(msg);
}
