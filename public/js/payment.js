// ================================================================
// EV Charging System - Payment JS
// ================================================================

async function processPayment(sessionId) {
  try {
    const res = await fetch('/customer/payment/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    const data = await res.json();

    if (data.success) {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        showToast('Thanh toán thành công!', 'success');
        setTimeout(() => location.reload(), 1500);
      }
    } else {
      showToast(data.message || 'Lỗi thanh toán', 'danger');
    }
  } catch (err) {
    showToast('Lỗi kết nối', 'danger');
  }
}
