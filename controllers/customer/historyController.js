const ChargingSession = require('../../models/ChargingSession');

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const sessions = await ChargingSession.find({ user: req.session.user._id }).populate('station').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const total = await ChargingSession.countDocuments({ user: req.session.user._id });
    res.renderCustomer('history', { title: 'Lịch sử sạc', sessions, currentPage: page, totalPages: Math.ceil(total / limit), activePage: 'history' });
  } catch (error) { res.redirect('/customer'); }
};

exports.getSessionDetail = async (req, res) => {
  try {
    const session = await ChargingSession.findOne({ _id: req.params.id, user: req.session.user._id }).populate('station');
    if (!session) return res.redirect('/customer/history');
    res.json({ success: true, session });
  } catch (error) { res.json({ success: false, message: error.message }); }
};
