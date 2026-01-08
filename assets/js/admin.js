<script>
/*************************************************
 * CONFIG
 *************************************************/
const API_URL = "PASTE_URL_GAS_KAMU_DI_SINI";
const API_KEY = "LABFITNESS_2026_SECURE";

/*************************************************
 * HELPER FETCH
 *************************************************/
async function apiFetch(params = {}) {
  const query = new URLSearchParams({
    ...params,
    key: API_KEY
  }).toString();

  const res = await fetch(`${API_URL}?${query}`);
  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message || "API Error");
  }
  return data;
}

/*************************************************
 * DOM READY
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadIncomeChart();
});

/*************************************************
 * LOAD DASHBOARD
 *************************************************/
async function loadDashboard() {
  try {
    showSkeleton(true);

    const data = await apiFetch({
      action: "adminDashboard",
      role: "admin"
    });

    console.log("ADMIN DASHBOARD:", data);

    setText("total", data.total_member);
    setText("aktif", data.member_aktif);
    setText("expired", data.member_tidak_aktif);
    setCurrency("income", data.total_income);

  } catch (err) {
    console.error(err);
    alert("Gagal memuat dashboard admin");
  } finally {
    showSkeleton(false);
  }
}

/*************************************************
 * LOAD INCOME CHART
 *************************************************/
async function loadIncomeChart() {
  try {
    const data = await apiFetch({
      action: "adminIncomeChart",
      role: "admin"
    });

    renderIncomeChart(data.labels, data.values);

  } catch (err) {
    console.error(err);
  }
}

/*************************************************
 * RENDER CHART (Chart.js)
 *************************************************/
function renderIncomeChart(labels = [], values = []) {
  const ctx = document.getElementById("incomeChart");

  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Pemasukan",
        data: values,
        tension: 0.4
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
 * EXPORT PDF
 *************************************************/
async function exportPDF() {
  try {
    const data = await apiFetch({
      action: "exportPDF",
      role: "admin"
    });

    window.open(data.pdf_url, "_blank");

  } catch (err) {
    console.error(err);
    alert("Gagal export PDF");
  }
}

/*************************************************
 * UI HELPERS
 *************************************************/
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent =
    typeof value === "number"
      ? value.toLocaleString("id-ID")
      : value || "-";
}

function setCurrency(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent =
    typeof value === "number"
      ? "Rp " + value.toLocaleString("id-ID")
      : "Rp 0";
}

function showSkeleton(show) {
  document
    .querySelectorAll(".skeleton")
    .forEach(el => el.classList.toggle("hidden", !show));

  document
    .querySelectorAll(".real-content")
    .forEach(el => el.classList.toggle("hidden", show));
}
</script>

