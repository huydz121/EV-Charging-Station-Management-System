const ChargingSession = require('../../models/ChargingSession');
const Station = require('../../models/Station');

exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    if (startDate && endDate) { dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59') } }; }
    const sessions = await ChargingSession.find(dateFilter).populate('user', 'fullName email').populate('station', 'name').sort({ createdAt: -1 }).limit(100);
    const monthlyRevenue = await ChargingSession.aggregate([{ $match: { paymentStatus: 'paid', ...dateFilter } }, { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalCost' }, sessions: { $sum: 1 }, energy: { $sum: '$energyDelivered' } } }, { $sort: { _id: 1 } }]);
    const topStations = await ChargingSession.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: '$station', revenue: { $sum: '$totalCost' }, sessions: { $sum: 1 } } }, { $sort: { revenue: -1 } }, { $limit: 5 }, { $lookup: { from: 'stations', localField: '_id', foreignField: '_id', as: 'station' } }, { $unwind: { path: '$station', preserveNullAndEmptyArrays: true } }]);
    res.renderAdmin('reports', { title: 'Báo cáo & Thống kê', sessions, monthlyRevenue, topStations, startDate: startDate || '', endDate: endDate || '', activePage: 'reports' });
  } catch (error) { console.error(error); res.redirect('/admin/dashboard'); }
};
