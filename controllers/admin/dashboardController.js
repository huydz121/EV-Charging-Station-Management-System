const Station = require('../../models/Station');
const User = require('../../models/User');
const ChargingSession = require('../../models/ChargingSession');
const Payment = require('../../models/Payment');
const Maintenance = require('../../models/Maintenance');

exports.getDashboard = async (req, res) => {
  try {
    const totalStations = await Station.countDocuments();
    const activeStations = await Station.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalSessions = await ChargingSession.countDocuments();
    const activeSessions = await ChargingSession.countDocuments({ status: 'charging' });
    const pendingMaintenance = await Maintenance.countDocuments({ status: { $in: ['pending', 'in_progress'] } });
    const revenueResult = await ChargingSession.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalCost' } } }]);
    const totalRevenue = revenueResult[0]?.total || 0;
    
    // Weekly Revenue
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyRevenue = await ChargingSession.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: weekAgo } } }, { $group: { _id: { $dayOfWeek: '$createdAt' }, revenue: { $sum: '$totalCost' }, sessions: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    
    // Monthly Revenue (last 30 days grouped by week of year)
    const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
    const monthlyRevenue = await ChargingSession.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: monthAgo } } }, { $group: { _id: { $week: '$createdAt' }, revenue: { $sum: '$totalCost' }, sessions: { $sum: 1 } } }, { $sort: { _id: 1 } }]);

    // Yearly Revenue (current year grouped by month)
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const yearlyRevenue = await ChargingSession.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfYear } } }, { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalCost' }, sessions: { $sum: 1 } } }, { $sort: { _id: 1 } }]);

    const stationStatus = await Station.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const recentSessions = await ChargingSession.find().populate('user', 'fullName email').populate('station', 'name').sort({ createdAt: -1 }).limit(10);
    res.renderAdmin('dashboard', { 
      title: 'Dashboard', 
      activePage: 'dashboard', 
      stats: { totalStations, activeStations, totalUsers, totalSessions, activeSessions, totalRevenue, pendingMaintenance }, 
      weeklyRevenue, 
      monthlyRevenue,
      yearlyRevenue,
      stationStatus, 
      recentSessions,
      extraScripts: '<script src="/js/chart.js"></script>'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.renderAdmin('dashboard', { title: 'Dashboard', activePage: 'dashboard', stats: {}, weeklyRevenue: [], monthlyRevenue: [], yearlyRevenue: [], stationStatus: [], recentSessions: [], extraScripts: '' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    res.renderAdmin('settings', { title: 'Cài đặt hệ thống', activePage: 'settings' });
  } catch (error) { res.redirect('/admin/dashboard'); }
};
