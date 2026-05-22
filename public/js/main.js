// ================================================================
// EV Charging System - Main JavaScript
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.station-item, .kpi-card, .history-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease';
    observer.observe(el);
  });

  // Format currency helper
  window.formatVND = function(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };
});

// Toast notification global function
window.showToast = function(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `ev-alert ev-alert-${type}`;
  toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px; transition: all 0.3s ease; opacity: 0; transform: translateY(-10px); background: var(--bg-card); color: var(--text-color); border-left: 4px solid var(--primary-color); padding: 15px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px;';
  
  if (type === 'danger' || type === 'error') {
    toast.style.borderLeftColor = 'var(--danger-color)';
  }

  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="color: ${type === 'success' ? 'var(--primary-color)' : 'var(--danger-color)'}; font-size: 1.2rem;"></i> <span style="font-size: 14px; font-weight: 500;">${message}</span>`;
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Animate out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

document.addEventListener('DOMContentLoaded', function () {
  // Sidebar toggle for mobile admin
  const toggleBtn = document.getElementById('toggleSidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      document.getElementById('adminSidebar').classList.toggle('open');
    });
  }
});
