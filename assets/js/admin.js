const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";

// AUTH GUARD
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") {
  window.location.href = "index.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// LOAD DASHBOARD
fetch(`${API_URL}?action=adminDashboard`)
  .then(res => res.json())
  .then(data => {
    const total = data.aktif + data.tidak_aktif;

    document.getElementById("total").innerText = total;
    document.getElementById("aktif").innerText = data.aktif;
    document.getElementById("expired").innerText = data.tidak_aktif;

    const lastIncome = data.pemasukan[data.pemasukan.length - 1];
    document.getElementById("income").innerText =
      "Rp " + lastIncome.jumlah.toLocaleString("id-ID");

    renderMemberChart(data.aktif, data.tidak_aktif);
  });

// MEMBER STATUS CHART
function renderMemberChart(aktif, expired) {
  new Chart(document.getElementById("memberChart"), {
    type: "doughnut",
    data: {
      labels: ["Aktif", "Expired"],
      datasets: [{
        data: [aktif, expired]
      }]
    }
  });
}

// INCOME CHART
fetch(`${API_URL}?action=adminIncomeChart`)
  .then(res => res.json())
  .then(data => {
    new Chart(document.getElementById("incomeChart"), {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          tension: 0.4
        }]
      }
    });
  });
