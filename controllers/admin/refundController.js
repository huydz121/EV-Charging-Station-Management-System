const Payment = require('../../models/Payment');
const ChargingSession = require('../../models/ChargingSession');
const User = require('../../models/User');

exports.listRefunds = async (req, res) => {
  try {
    const refunds = await Payment.find({ type: 'refund' })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, refunds });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.processRefund = async (req, res) => {
  try {
    const { sessionId, amount, reason } = req.body;
    const session = await ChargingSession.findById(sessionId);

    if (!session) {
      return res.json({ success: false, message: 'Phiên sạc không tồn tại' });
    }

    const refund = await Payment.create({
      user: session.user,
      session: sessionId,
      type: 'refund',
      amount: parseInt(amount),
      status: 'completed',
      description: reason || 'Hoàn tiền phiên sạc'
    });

    session.paymentStatus = 'refunded';
    await session.save();

    const user = await User.findById(session.user);
    user.balance += parseInt(amount);
    await user.save();

    res.json({ success: true, refund });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
