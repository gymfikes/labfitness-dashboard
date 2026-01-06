const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") window.location.href = "index.html";

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function apiFetch(params) {
  const query = new URLSearchParams({ key: API_KEY, ...params }).toString();
  return fetch(`${API_URL}?${query}`).then(res => res.json());
}

// Load dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadAdminDashboard();
  loadIncomeChart();
});

function loadAdminDashboard() {
  apiFetch({ action: "adminDashboard", role: "admin" })
    .then(data => {
      if (data.status !== "success") return alert("Gagal memuat dashboard");
      document.getElementById("aktif").innerText = data.aktif;
      document.getElementById("expired").innerText = data.tidak_aktif;
      document.getElementById("total").innerText = data.aktif + data.tidak_aktif;
      document.getElementById("income").innerText = "Rp " + (data.totalIncome || 0).toLocaleString("id-ID");
    })
    .catch(() => alert("Gagal memuat dashboard"));
}

function loadIncomeChart() {
  apiFetch({ action: "adminIncomeChart", role: "admin" })
    .then(data => {
      if (data.status !== "success") return alert("Gagal memuat chart");
      renderIncomeChart(data.labels, data.values);
    })
    .catch(() => alert("Gagal memuat chart"));
}

function renderIncomeChart(labels, values) {
  const ctx = document.getElementById("incomeChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ label: "Pendapatan (Rp)", data: values, backgroundColor: "#1F2937" }] },
    options: { responsive:true, plugins:{legend:{display:false}} }
  });
}
