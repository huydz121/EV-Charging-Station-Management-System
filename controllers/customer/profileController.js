const User = require('../../models/User');
const Payment = require('../../models/Payment');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const payments = await Payment.find({ user: req.session.user._id }).sort({ createdAt: -1 }).limit(10);
    req.session.user.balance = user.balance;
    res.renderCustomer('profile', { title: 'Tài khoản', userDetail: user, payments, activeTab: req.query.tab || 'profile', activePage: 'profile' });
  } catch (error) { res.redirect('/customer'); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.session.user._id, { fullName, phone }, { new: true });
    req.session.user.fullName = user.fullName; req.session.user.phone = user.phone;
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) { res.json({ success: false, message: error.message }); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user._id);
    if (!(await user.comparePassword(currentPassword))) return res.json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    user.password = newPassword; await user.save();
    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) { res.json({ success: false, message: error.message }); }
};
