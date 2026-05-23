// ================================================================
// EV Charging System - Charging Session (Real-time Simulation)
// ================================================================

let chargingInterval = null;

document.addEventListener('DOMContentLoaded', function () {
  if (typeof sessionId === 'undefined') return;

  // Format start time
  if (startTimeRaw) {
    const st = new Date(startTimeRaw);
    const startTimeEl = document.getElementById('startTime');
    if (startTimeEl) {
      startTimeEl.textContent = st.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
  }

  if (sessionStatus === 'charging') {
    startPolling();
    startTimer();
  } else {
    // Show final state
    updateUI({
      batteryEnd: 100,
      energyDelivered: 0,
      currentPower: 0,
      totalCost: 0,
      status: 'completed'
    });
  }
});

function startPolling() {
  chargingInterval = setInterval(async function () {
    try {
      const res = await fetch(`/customer/charging/${sessionId}/status`);
      const data = await res.json();

      if (data.success && data.session) {
        updateUI(data.session);

        if (data.session.status === 'completed') {
          clearInterval(chargingInterval);
          showCompletedState(data.session);
        }
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, 2000);
}

function updateUI(session) {
  const progress = Math.min((session.batteryEnd || session.batteryStart || 0), 100);
  const circle = document.getElementById('chargingCircle');
  const percentEl = document.getElementById('batteryPercent');
  const energyEl = document.getElementById('energyValue');
  const powerEl = document.getElementById('powerValue');
  const costEl = document.getElementById('costValue');

  if (circle) circle.style.setProperty('--progress', progress + '%');
  if (percentEl) percentEl.textContent = Math.round(progress) + '%';
  if (energyEl) energyEl.textContent = (session.energyDelivered || 0).toFixed(1);
  if (powerEl) powerEl.textContent = (session.currentPower || 0).toFixed(1);
  if (costEl) costEl.textContent = (session.totalCost || 0).toLocaleString('vi-VN') + 'đ';
}

function startTimer() {
  const startTime = new Date(startTimeRaw);
  const timerEl = document.getElementById('elapsedTime');

  setInterval(function () {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    if (timerEl) {
      timerEl.textContent =
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
    }
  }, 1000);
}

async function stopCharging() {
  const btn = document.getElementById('stopBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang dừng...';
  }

  try {
    const res = await fetch(`/customer/charging/${sessionId}/stop`, { method: 'POST' });
    const data = await res.json();

    if (data.success) {
      clearInterval(chargingInterval);
      showCompletedState(data.session);
    } else {
      alert(data.message || 'Lỗi khi dừng sạc');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-stop-circle"></i> Dừng sạc';
      }
    }
  } catch (err) {
    alert('Lỗi kết nối');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-stop-circle"></i> Dừng sạc';
    }
  }
}

function showCompletedState(session) {
  updateUI(session);

  const stopBtn = document.getElementById('stopBtn');
  if (stopBtn) {
    stopBtn.outerHTML = `
      <div class="ev-alert ev-alert-success" style="margin-bottom: 12px;">
        <i class="fas fa-check-circle"></i>
        Phiên sạc hoàn tất! Tổng chi phí: <strong>${(session.totalCost || 0).toLocaleString('vi-VN')}đ</strong>
      </div>
      <a href="/customer" class="btn-ev btn-ev-primary" style="width: 100%;">
        <i class="fas fa-home"></i> Về trang chủ
      </a>
    `;
  }
}
