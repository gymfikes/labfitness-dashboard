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
 * LOAD MEMBER DASHBOARD
 *************************************************/
loadMemberDashboard();

function loadMemberDashboard() {
  const url =
    `${API_URL}` +
    `?action=memberDashboard` +
    `&code=${encodeURIComponent(user.member_code)}` +
    `&key=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "success") {
        showError("Gagal memuat data member");
        return;
      }

      renderMember(data);
    })
    .catch(() => {
      showError("Tidak dapat terhubung ke server");
    });
}

/*************************************************
 * RENDER UI
 *************************************************/
function renderMember(data) {
  document.getElementById("name").innerText = data.full_name || "-";
  document.getElementById("code").innerText = user.member_code;
  document.getElementById("days").innerText =
    (data.days_to_expired ?? "-") + " hari";
  document.getElementById("level").innerText =
    data.training_level || "-";
  document.getElementById("attendance").innerText =
    data.attendance_30d ?? "0";
  document.getElementById("program").innerText =
    data.program || "-";

  document.getElementById("programDate").innerText =
    data.program_sent_at
      ? "Dikirim: " + data.program_sent_at
      : "";

  setBadge(Number(data.attendance_30d || 0));
}

/*************************************************
 * BADGE LOGIC
 *************************************************/
function setBadge(attendance) {
  const badge = document.getElementById("badge");

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
  alert(message);
}
