const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalDiv = document.getElementById('total');
const chartCanvas = document.getElementById('categoryChart');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let categoryChart;

function updateList() {
  list.innerHTML = '';
  let total = 0;
  const categorySum = {};

  expenses
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // ✅ 根據日期排序（最新在上）
    .forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${e.date}</td><td>${e.item}</td><td>$${e.amount}</td><td>${e.category}</td>`;
      list.appendChild(tr);
      total += Number(e.amount);
      categorySum[e.category] = (categorySum[e.category] || 0) + Number(e.amount);
    });

  totalDiv.textContent = `總金額：$${total}`;
  localStorage.setItem('expenses', JSON.stringify(expenses));

  updateChart(categorySum);
}

function updateChart(categorySum) {
  const labels = Object.keys(categorySum);
  const data = Object.values(categorySum);

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8'
        ]
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: '各分類支出比例'
        }
      }
    }
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const newExpense = {
    date: document.getElementById('date').value,
    item: document.getElementById('item').value,
    amount: document.getElementById('amount').value,
    category: document.getElementById('category').value
  };
  expenses.push(newExpense);
  updateList();
  form.reset();
});

document.getElementById('clear').addEventListener('click', () => {
  if (confirm("確定要清空所有支出紀錄嗎？")) {
    localStorage.removeItem('expenses');
    expenses = [];
    updateList();
  }
});

function exportCSV() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  if (expenses.length === 0) {
    alert("目前沒有任何支出資料可匯出！");
    return;
  }

  const sorted = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  let csvContent = "日期,項目,金額,分類\n";
  sorted.forEach(e => {
    csvContent += `${e.date},${e.item},${e.amount},${e.category}\n`;
  });

  // ✅ 在開頭加入 BOM（Byte Order Mark）防止 Excel 顯示亂碼
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "支出資料.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// 初始化畫面
updateList();
