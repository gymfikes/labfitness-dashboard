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
 * LOAD DASHBOARD
 *************************************************/
loadAdminDashboard();
loadIncomeChart();

/*************************************************
 * ADMIN DASHBOARD DATA
 *************************************************/
function loadAdminDashboard() {
  const url =
    `${API_URL}` +
    `?action=adminDashboard` +
    `&key=${API_KEY}` +
    `&role=admin`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "success") {
        showError("Gagal memuat dashboard admin");
        return;
      }

      renderAdminDashboard(data);
    })
    .catch(() => {
      showError("Tidak dapat terhubung ke server");
    });
}

/*************************************************
 * RENDER KPI
 *************************************************/
function renderAdminDashboard(data) {
  document.getElementById("aktif").innerText = data.aktif ?? "0";
  document.getElementById("tidakAktif").innerText = data.tidak_aktif ?? "0";

  const total = Number(data.aktif || 0) + Number(data.tidak_aktif || 0);
  document.getElementById("total").innerText = total;
}

/*************************************************
 * INCOME CHART
 *************************************************/
function loadIncomeChart() {
  const url =
    `${API_URL}` +
    `?action=adminIncomeChart` +
    `&key=${API_KEY}` +
    `&role=admin`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "success") {
        showError("Gagal memuat chart pemasukan");
        return;
      }

      renderIncomeChart(data.labels, data.values);
    })
    .catch(() => {
      showError("Gagal memuat data chart");
    });
}

/*************************************************
 * RENDER CHART (Chart.js)
 *************************************************/
function renderIncomeChart(labels, values) {
  const ctx = document
    .getElementById("incomeChart")
    .getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pendapatan (Rp)",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

/*************************************************
 * ERROR HANDLER
 *************************************************/
function showError(message) {
  alert(message);
}
