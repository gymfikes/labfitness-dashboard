const API_URL = "https://script.google.com/macros/s/AKfycbzVS9DZ6SdoZ5o5-ODUnKOWGh-JstZ9_6HfE4UTsDZetFJt2GkNtULY3dChn17c7yhb/exec";
const API_KEY = "LABFITNESS_2026_SECURE";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") location.href = "index.html";

function logout(){
  localStorage.clear();
  location.href="index.html";
}

function apiFetch(params){
  return fetch(`${API_URL}?` + new URLSearchParams({key:API_KEY,...params}))
    .then(r=>r.json());
}

document.addEventListener("DOMContentLoaded",()=>{
  loadSummary();
  loadCharts();
});

function loadSummary(){
  apiFetch({action:"adminDashboard"}).then(d=>{
    total.innerText = d.total;
    aktif.innerText = d.aktif;
    expired.innerText = d.tidak_aktif;
    income.innerText = "Rp " + d.pemasukan_bulan_ini.toLocaleString("id-ID");
  });
}

function loadCharts(){
  apiFetch({action:"adminIncomeChart"}).then(d=>{
    renderChart("incomeChart", "bar", d.labels, d.values);
  });

  apiFetch({action:"adminPaymentPie"}).then(d=>{
    renderChart("paymentChart", "pie", d.labels, d.values);
  });

  apiFetch({action:"adminDailyChart"}).then(d=>{
    renderChart("dailyChart", "line", d.labels, d.values);
  });

  apiFetch({action:"adminWeeklyChart"}).then(d=>{
    renderChart("weeklyChart", "bar", d.labels, d.values);
  });
}

function renderChart(id,type,labels,data){
  new Chart(document.getElementById(id),{
    type,
    data:{labels,datasets:[{data,backgroundColor:"#111"}]},
    options:{responsive:true,plugins:{legend:{display:type==="pie"}}}
  });
}
