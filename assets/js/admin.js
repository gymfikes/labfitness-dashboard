/*************************************************
 * LAB FITNESS — ADMIN DASHBOARD JS (FINAL)
 * ✔ Clean
 * ✔ Stable
 * ✔ Insight ready
 * ✔ Pie chart fixed size
 *************************************************/

/* ================= CONFIG ================= */

const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

/* ================= STATE ================= */

const charts = {}; // prevent double render

/* ================= FETCH HELPER ================= */

async function apiFetch(params = {}) {
  const query = new URLSearchParams({
    key: API_KEY,
    role: "admin",
    ...params
  }).toString();

  const res = await fetch(`${API_URL}?${query}`);
  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message || "API error");
  }
  return data;
}

/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadIncomeChart();
  loadDailyChart();
  loadWeeklyChart();
  loadPaymentChart();
  loadInsight();
});

/* ================= KPI ================= */

async function loadDashboard() {
  try {
    const d = await apiFetch({ action: "adminDashboard" });
    setText("total", d.total_member);
    setText("aktif", d.member_aktif);
    setText("expired", d.member_tidak_aktif);
    setCurrency("income", d.total_income);
  } catch (e) {
    console.error("Dashboard error:", e);
  }
}

/* ================= CHART LOADERS ================= */

async function loadIncomeChart() {
  try {
    const d = await apiFetch({ action: "adminIncomeChart" });
    renderLine("incomeChart", d.labels, d.values, "Pemasukan Bulanan");
  } catch (e) {
    console.error("Income chart error:", e);
  }
}

async function loadDailyChart() {
  try {
    const d = await apiFetch({ action: "adminDailyChart" });
    renderLine("dailyChart", d.labels, d.values, "Pemasukan Harian");
  } catch (e) {
    console.error("Daily chart error:", e);
  }
}

async function loadWeeklyChart() {
  try {
    const d = await apiFetch({ action: "adminWeeklyChart" });
    renderBar("weeklyChart", d.labels, d.values, "Pemasukan Mingguan");
  } catch (e) {
    console.error("Weekly chart error:", e);
  }
}

async function loadPaymentChart() {
  try {
    const d = await apiFetch({ action: "adminPaymentPie" });
    renderPie("paymentChart", d.labels, d.values);
  } catch (e) {
    console.error("Payment pie error:", e);
  }
}

/* ================= INSIGHT ================= */

async function loadInsight() {
  try {
    const d = await apiFetch({ action: "adminInsight" });
    const ul = document.getElementById("insightList");
    if (!ul) return;

    ul.innerHTML = "";

    (d.insight || ["Tidak ada insight saat ini"]).forEach(text => {
      const li = document.createElement("li");
      li.textContent = "• " + text;
      ul.appendChild(li);
    });
  } catch (e) {
    console.error("Insight error:", e);
  }
}

/* ================= CHART RENDERERS ================= */

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

function renderLine(id, labels, values, label) {
  const el = document.getElementById(id);
  if (!el) return;

  destroyChart(id);

  charts[id] = new Chart(el, {
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

function renderBar(id, labels, values, label) {
  const el = document.getElementById(id);
  if (!el) return;

  destroyChart(id);

  charts[id] = new Chart(el, {
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

function renderPie(id, labels, values) {
  const el = document.getElementById(id);
  if (!el) return;

  destroyChart(id);

  charts[id] = new Chart(el, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        radius: "65%" // 🔒 size lock
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 12
          }
        }
      }
    }
  });
}

/* ================= UI HELPERS ================= */

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

/* ================= LOGOUT ================= */

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
