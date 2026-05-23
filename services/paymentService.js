const { PayOS } = require('@payos/node');
const config = require('../config');

let payos = null;

try {
  payos = new PayOS({
    clientId: config.payos.clientId,
    apiKey: config.payos.apiKey,
    checksumKey: config.payos.checksumKey
  });
  console.log('✅ PayOS initialized successfully');
} catch (e) {
  console.warn('⚠️ PayOS not configured. Payment features will be limited.', e.message);
}

module.exports = {
  createPaymentLink: async ({ orderCode, amount, description, returnUrl, cancelUrl, expiredAt }) => {
    if (!payos) {
      throw new Error('PayOS chưa được cấu hình');
    }
    const paymentData = {
      orderCode,
      amount,
      description: description || 'Thanh toan EV Charging',
      returnUrl,
      cancelUrl
    };
    if (expiredAt) {
      paymentData.expiredAt = expiredAt;
    }
    return await payos.paymentRequests.create(paymentData);
  },

  getPaymentInfo: async (orderCode) => {
    if (!payos) throw new Error('PayOS chưa được cấu hình');
    return await payos.paymentRequests.get(orderCode);
  },

  cancelPayment: async (orderCode, reason) => {
    if (!payos) throw new Error('PayOS chưa được cấu hình');
    return await payos.paymentRequests.cancel(orderCode, reason);
  },

  verifyWebhook: (webhookData) => {
    if (!payos) throw new Error('PayOS chưa được cấu hình');
    return payos.webhooks.verifyPaymentWebhookData(webhookData);
  },

  isConfigured: () => !!payos
};
