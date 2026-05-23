const Payment = require('../../models/Payment');
const User = require('../../models/User');
const paymentService = require('../../services/paymentService');
const config = require('../../config');

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const payments = await Payment.find({ user: req.session.user._id }).sort({ createdAt: -1 }).limit(20);
    req.session.user.balance = user.balance;
    res.renderCustomer('profile', { title: 'Ví của tôi', payments, activeTab: 'wallet', activePage: 'wallet' });
  } catch (error) { res.redirect('/customer'); }
};

exports.createTopup = async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = parseInt(amount);
    if (!parsedAmount || parsedAmount < 10000) {
      return res.json({ success: false, message: 'Số tiền tối thiểu 10.000đ' });
    }
    const orderCode = Date.now();
    const payment = await Payment.create({
      user: req.session.user._id,
      type: 'topup',
      amount: parsedAmount,
      method: 'payos',
      status: 'pending',
      payosOrderCode: orderCode,
      description: `Nạp tiền ví: ${parsedAmount.toLocaleString('vi-VN')}đ`
    });

    try {
      // Setup demo expiration: 2 minutes
      const expiredAt = Math.floor(Date.now() / 1000) + 120;

      const paymentLink = await paymentService.createPaymentLink({
        orderCode,
        amount: parsedAmount,
        description: `Nap vi ${parsedAmount}VND`,
        returnUrl: `${config.baseUrl}/customer/payment/success?orderCode=${orderCode}`,
        cancelUrl: `${config.baseUrl}/customer/payment/cancel?orderCode=${orderCode}`,
        expiredAt
      });

      payment.payosPaymentLink = paymentLink.checkoutUrl;
      await payment.save();

      // Return QR code URL and order info for in-app display
      return res.json({
        success: true,
        qrCode: paymentLink.qrCode, // PayOS returns base64 QR or URL
        checkoutUrl: paymentLink.checkoutUrl,
        orderCode: orderCode,
        amount: parsedAmount,
        accountNumber: paymentLink.accountNumber || '',
        accountName: paymentLink.accountName || '',
        bin: paymentLink.bin || '',
        description: paymentLink.description || '',
        expiredAt: expiredAt
      });
    } catch (payosError) {
      console.error('PayOS Error:', payosError);
      payment.status = 'failed';
      await payment.save();
      return res.json({ success: false, message: 'Lỗi tạo đơn thanh toán: ' + payosError.message });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check payment status (polling endpoint)
exports.checkTopupStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const payment = await Payment.findOne({ payosOrderCode: parseInt(orderCode), user: req.session.user._id });
    if (!payment) {
      return res.json({ success: false, message: 'Không tìm thấy giao dịch' });
    }

    // If already completed, return immediately
    if (payment.status === 'completed') {
      const user = await User.findById(req.session.user._id);
      req.session.user.balance = user.balance;
      return res.json({ success: true, status: 'completed', balance: user.balance });
    }

    // Check with PayOS
    try {
      const paymentInfo = await paymentService.getPaymentInfo(parseInt(orderCode));
      if (paymentInfo && (paymentInfo.status === 'PAID' || paymentInfo.code === '00')) {
        // Payment confirmed! Update database
        if (payment.status === 'pending') {
          payment.status = 'completed';
          await payment.save();
          const user = await User.findById(req.session.user._id);
          user.balance += payment.amount;
          await user.save();
          req.session.user.balance = user.balance;
          return res.json({ success: true, status: 'completed', balance: user.balance });
        }
      }
      return res.json({ success: true, status: payment.status });
    } catch (e) {
      return res.json({ success: true, status: payment.status });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const { orderCode } = req.query;
    const payment = await Payment.findOne({ payosOrderCode: parseInt(orderCode) });
    if (payment && payment.status === 'pending') {
      payment.status = 'completed';
      await payment.save();
      const user = await User.findById(payment.user);
      user.balance += payment.amount;
      await user.save();
      req.session.user.balance = user.balance;
    }
    res.redirect('/customer/profile?tab=wallet&msg=success');
  } catch (error) { res.redirect('/customer/profile?tab=wallet&msg=error'); }
};

exports.paymentCancel = async (req, res) => {
  try {
    const { orderCode } = req.query;
    const payment = await Payment.findOne({ payosOrderCode: parseInt(orderCode) });
    if (payment) { payment.status = 'failed'; await payment.save(); }
    res.redirect('/customer/profile?tab=wallet&msg=cancelled');
  } catch (error) { res.redirect('/customer/profile?tab=wallet'); }
};

exports.webhook = async (req, res) => {
  try {
    const webhookData = req.body;
    const verifiedData = paymentService.verifyWebhook(webhookData);
    if (verifiedData && verifiedData.code === '00') {
      const payment = await Payment.findOne({ payosOrderCode: verifiedData.data.orderCode });
      if (payment && payment.status === 'pending') {
        payment.status = 'completed';
        await payment.save();
        const user = await User.findById(payment.user);
        user.balance += payment.amount;
        await user.save();
      }
    }
    res.json({ success: true });
  } catch (error) { res.json({ success: false }); }
};
