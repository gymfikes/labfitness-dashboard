/*************************************************
 * CONFIG
 *************************************************/
const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

/*************************************************
 * AUTH GUARD
 *************************************************/
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
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
    role: "admin",
    ...params
  }).toString();

  return fetch(`${API_URL}?${query}`).then(res => res.json());
}

/*************************************************
 * INIT
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  loadAdminDashboard();
});

/*************************************************
 * LOAD DASHBOARD
 *************************************************/
function loadAdminDashboard() {
  apiFetch({ action: "adminDashboard" })
    .then(data => {
      if (data.status !== "success") {
        showError("Gagal memuat dashboard admin");
        return;
      }

      renderKPI(data);
      renderIncomeChartFromDashboard(data.pemasukan || []);
    })
    .catch(() => showError("Tidak dapat terhubung ke server"));
}

/*************************************************
 * RENDER KPI
 *************************************************/
function renderKPI(data) {
  const aktif = Number(data.aktif || 0);
  const expired = Number(data.tidak_aktif || 0);
  const total = aktif + expired;

  setText("total", total);
  setText("aktif", aktif);
  setText("expired", expired);

  const incomeTotal = (data.pemasukan || [])
    .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);

  setText("income", formatRupiah(incomeTotal));
}

/*************************************************
 * INCOME CHART
 *************************************************/
let incomeChartInstance = null;

function renderIncomeChartFromDashboard(pemasukan) {
  const labels = pemasukan.map(p => p.bulan);
  const values = pemasukan.map(p => Number(p.jumlah || 0));

  const ctx = document.getElementById("incomeChart");
  if (!ctx) return;

  if (incomeChartInstance) {
    incomeChartInstance.destroy();
  }

  incomeChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Pendapatan (Rp)",
        data: values
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/*************************************************
 * HELPERS
 *************************************************/
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "0";
}

function formatRupiah(number) {
  return "Rp " + Number(number || 0).toLocaleString("id-ID");
}

/*************************************************
 * ERROR HANDLER
 *************************************************/
function showError(message) {
  console.error(message);
  alert(message);
}
