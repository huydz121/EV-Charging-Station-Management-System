const User = require('../../models/User');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.renderAdmin('users', { title: 'Quản lý người dùng', users, activePage: 'users' });
  } catch (error) { res.redirect('/admin/dashboard'); }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.json({ success: false, message: 'User not found' });
    targetUser.isActive = !targetUser.isActive; await targetUser.save();
    res.json({ success: true, isActive: targetUser.isActive });
  } catch (error) { res.json({ success: false, message: error.message }); }
};

exports.deleteUser = async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.json({ success: false, message: error.message }); }
};

exports.getProfile = async (req, res) => {
  try {
    const userRole = req.session.user ? req.session.user.role : 'admin';
    res.renderAdmin('profile', { title: 'Hồ sơ cá nhân', activePage: 'profile' });
  } catch (error) { res.redirect('/admin/dashboard'); }
};
