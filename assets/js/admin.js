/*************************************************
 * CONFIG
 *************************************************/
const API_URL = "PASTE_URL_GAS_KAMU_DI_SINI";
const API_KEY = "LABFITNESS_2026_SECURE";

/*************************************************
 * FETCH HELPER
 *************************************************/
async function apiFetch(params = {}) {
  const q = new URLSearchParams({ key: API_KEY, ...params }).toString();
  const res = await fetch(`${API_URL}?${q}`);
  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message || "API error");
  }
  return data;
}

/*************************************************
 * DOM READY
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadIncomeChart();
  loadDailyChart();
  loadWeeklyChart();
  loadPaymentChart();
});

/*************************************************
 * DASHBOARD KPI
 *************************************************/
async function loadDashboard() {
  try {
    const d = await apiFetch({ action: "adminDashboard", role: "admin" });

    setText("total", d.total_member);
    setText("aktif", d.member_aktif);
    setText("expired", d.member_tidak_aktif);
    setCurrency("income", d.total_income);

  } catch (e) {
    console.error(e);
    alert("Gagal memuat dashboard");
  }
}

/*************************************************
 * INCOME (MONTHLY)
 *************************************************/
async function loadIncomeChart() {
  try {
    const d = await apiFetch({ action: "adminIncomeChart", role: "admin" });
    renderLine("incomeChart", d.labels, d.values, "Pemasukan Bulanan");
  } catch (e) {
    console.error(e);
  }
}

/*************************************************
 * DAILY
 *************************************************/
async function loadDailyChart() {
  try {
    const d = await apiFetch({ action: "adminDailyChart", role: "admin" });
    renderLine("dailyChart", d.labels, d.values, "Pemasukan Harian");
  } catch (e) {
    console.error(e);
  }
}

/*************************************************
 * WEEKLY
 *************************************************/
async function loadWeeklyChart() {
  try {
    const d = await apiFetch({ action: "adminWeeklyChart", role: "admin" });
    renderBar("weeklyChart", d.labels, d.values, "Pemasukan Mingguan");
  } catch (e) {
    console.error(e);
  }
}

/*************************************************
 * PAYMENT PIE
 *************************************************/
async function loadPaymentChart() {
  try {
    const d = await apiFetch({ action: "adminPaymentPie", role: "admin" });
    renderPie("paymentChart", d.labels, d.values);
  } catch (e) {
    console.error(e);
  }
}

/*************************************************
 * CHART RENDERERS
 *************************************************/
function renderLine(id, labels = [], values = [], label = "") {
  const el = document.getElementById(id);
  if (!el) return;

  new Chart(el, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label,
        data: values,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function renderBar(id, labels = [], values = [], label = "") {
  const el = document.getElementById(id);
  if (!el) return;

  new Chart(el, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label,
        data: values
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function renderPie(id, labels = [], values = []) {
  const el = document.getElementById(id);
  if (!el) return;

  new Chart(el, {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: values }]
    },
    options: { responsive: true }
  });
}

/*************************************************
 * UI HELPERS
 *************************************************/
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent =
    typeof value === "number" ? value.toLocaleString("id-ID") : value || "-";
}

function setCurrency(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent =
    typeof value === "number"
      ? "Rp " + value.toLocaleString("id-ID")
      : "Rp 0";
}

/*************************************************
 * LOGOUT
 *************************************************/
function logout() {
  localStorage.clear();
  location.href = "index.html";
}
