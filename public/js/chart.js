// ================================================================
// EV Charging System - Chart.js for Admin Dashboard
// ================================================================

let revenueChartInstance = null;

document.addEventListener('DOMContentLoaded', function () {
  // Chart.js global defaults for dark theme
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#9ca3af';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
    Chart.defaults.font.family = "'Inter', sans-serif";
  }

  initRevenueChart();
  initStationStatusChart();
});

function initRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const data = typeof weeklyRevenueData !== 'undefined' ? weeklyRevenueData : [];

  // Fill all 7 days
  const revenueByDay = new Array(7).fill(0);
  const sessionsByDay = new Array(7).fill(0);

  data.forEach(item => {
    const idx = (item._id - 1) % 7;
    revenueByDay[idx] = item.revenue || 0;
    sessionsByDay[idx] = item.sessions || 0;
  });

  // If no data, use demo data
  const hasData = revenueByDay.some(v => v > 0);
  const chartData = hasData ? revenueByDay : [150000, 280000, 420000, 350000, 500000, 380000, 450000];

  revenueChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dayNames,
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: chartData,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#00e676';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(0, 230, 118, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 230, 118, 0.8)');
          return gradient;
        },
        borderColor: '#00e676',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: '#00e676'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a2235',
          titleColor: '#e8eaed',
          bodyColor: '#9ca3af',
          borderColor: 'rgba(0, 230, 118, 0.3)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function (context) {
              return '  ' + new Intl.NumberFormat('vi-VN').format(context.raw) + 'đ';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { weight: 600, size: 12 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: {
            font: { size: 11 },
            callback: function (value) {
              return (value / 1000) + 'K';
            }
          }
        }
      }
    }
  });
}

window.updateRevenueChart = function (type) {
  if (!revenueChartInstance) return;

  // Update styles for active button
  document.getElementById('btn-tuan').className = type === 'tuan' ? 'ev-badge ev-badge-success' : 'ev-badge ev-badge-outline';
  document.getElementById('btn-tuan').style.background = type === 'tuan' ? '' : 'transparent';
  document.getElementById('btn-tuan').style.color = type === 'tuan' ? '' : 'var(--text-muted)';
  
  document.getElementById('btn-thang').className = type === 'thang' ? 'ev-badge ev-badge-success' : 'ev-badge ev-badge-outline';
  document.getElementById('btn-thang').style.background = type === 'thang' ? '' : 'transparent';
  document.getElementById('btn-thang').style.color = type === 'thang' ? '' : 'var(--text-muted)';

  document.getElementById('btn-nam').className = type === 'nam' ? 'ev-badge ev-badge-success' : 'ev-badge ev-badge-outline';
  document.getElementById('btn-nam').style.background = type === 'nam' ? '' : 'transparent';
  document.getElementById('btn-nam').style.color = type === 'nam' ? '' : 'var(--text-muted)';

  let labels = [];
  let chartData = [];

  if (type === 'tuan') {
    labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const data = typeof weeklyRevenueData !== 'undefined' ? weeklyRevenueData : [];
    chartData = new Array(7).fill(0);
    data.forEach(item => { chartData[(item._id - 1) % 7] = item.revenue || 0; });
    if (!chartData.some(v => v > 0)) chartData = [150000, 280000, 420000, 350000, 500000, 380000, 450000];
  } else if (type === 'thang') {
    labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    const data = typeof monthlyRevenueData !== 'undefined' ? monthlyRevenueData : [];
    chartData = new Array(4).fill(0);
    data.forEach((item, index) => { if (index < 4) chartData[index] = item.revenue || 0; });
    if (!chartData.some(v => v > 0)) chartData = [1200000, 1500000, 1100000, 1900000];
  } else if (type === 'nam') {
    labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const data = typeof yearlyRevenueData !== 'undefined' ? yearlyRevenueData : [];
    chartData = new Array(12).fill(0);
    data.forEach(item => { if(item._id >= 1 && item._id <= 12) chartData[item._id - 1] = item.revenue || 0; });
    if (!chartData.some(v => v > 0)) chartData = [4500000, 5200000, 4800000, 6100000, 5900000, 7200000, 0, 0, 0, 0, 0, 0];
  }

  revenueChartInstance.data.labels = labels;
  revenueChartInstance.data.datasets[0].data = chartData;
  revenueChartInstance.update();
}

function initStationStatusChart() {
  const canvas = document.getElementById('stationStatusChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const data = typeof stationStatusData !== 'undefined' ? stationStatusData : [];

  const statusMap = { active: 0, inactive: 0, maintenance: 0 };
  data.forEach(item => {
    statusMap[item._id] = item.count || 0;
  });

  const hasData = Object.values(statusMap).some(v => v > 0);
  const chartValues = hasData
    ? [statusMap.active, statusMap.inactive, statusMap.maintenance]
    : [8, 2, 1];

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Hoạt động', 'Ngừng', 'Bảo trì'],
      datasets: [{
        data: chartValues,
        backgroundColor: [
          '#00e676',
          '#ff5252',
          '#ffab00'
        ],
        borderColor: '#151d2e',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyleWidth: 10,
            font: { size: 12, weight: 500 }
          }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          titleColor: '#e8eaed',
          bodyColor: '#9ca3af',
          borderColor: 'rgba(0, 230, 118, 0.3)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12
        }
      }
    }
  });
}
