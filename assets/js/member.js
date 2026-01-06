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
 * API HELPER
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
 * LOAD MEMBER DASHBOARD
 *************************************************/
document.addEventListener("DOMContentLoaded", loadMemberDashboard);

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
 * RENDER UI (desktop + mobile)
 *************************************************/
function renderMember(data) {
  // Ambil semua ID desktop dan mobile
  const elements = [
    { desktop: 'name', mobile: 'nameMobile', value: data.full_name },
    { desktop: 'status', mobile: 'statusMobile', value: data.status_keaktifan },
    { desktop: 'badge', mobile: 'badgeMobile', value: '' }, // nanti set by badge logic
    { desktop: 'code', mobile: 'codeMobile', value: user.member_code },
    { desktop: 'days', mobile: 'daysMobile', value: `${data.days_remaining ?? "-"} hari` },
    { desktop: 'level', mobile: 'levelMobile', value: data.membership_type || "-" },
    { desktop: 'attendance', mobile: 'attendanceMobile', value: data.attendance_30d ?? "0" },
    { desktop: 'program', mobile: 'programMobile', value: data.program || "-" },
    { desktop: 'programDate', mobile: 'programDateMobile', value: data.program_sent_at ? `Dikirim: ${data.program_sent_at}` : "" }
  ];

  elements.forEach(el => {
    setText(el.desktop, el.value);
    setText(el.mobile, el.value);
  });

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
  const badgeText = attendance >= 20 ? "🔥 Consistent" :
                    attendance >= 10 ? "💪 Active" :
                    "🆕 New Member";

  const badgeClass = attendance >= 20 ? "text-sm text-red-500 font-semibold" :
                     attendance >= 10 ? "text-sm text-green-600 font-semibold" :
                     "text-sm text-gray-500 font-semibold";

  // Update desktop & mobile
  ['badge', 'badgeMobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = badgeText;
      el.className = badgeClass;
    }
  });
}

/*************************************************
 * ERROR HANDLER
 *************************************************/
function showError(message) {
  console.error(message);
  alert(message); // bisa diganti toast/modal nanti
}
