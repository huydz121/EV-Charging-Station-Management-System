const ChargingSession = require('../../models/ChargingSession');
const Station = require('../../models/Station');
const User = require('../../models/User');

exports.startCharging = async (req, res) => {
  try {
    const userObj = await User.findById(req.session.user._id);
    if (!userObj || userObj.balance < 200000) {
      return res.json({ success: false, message: 'Ví của bạn phải có tối thiểu 200.000đ để có thể bắt đầu sạc.' });
    }

    const { stationId, connectorIndex, targetEnergy } = req.body;
    const station = await Station.findById(stationId);
    if (!station) return res.json({ success: false, message: 'Trạm sạc không tồn tại' });
    const connector = station.connectors[connectorIndex || 0];
    if (!connector || connector.status !== 'available') return res.json({ success: false, message: 'Trụ sạc không khả dụng' });
    station.connectors[connectorIndex || 0].status = 'in_use';
    await station.save();
    const session = await ChargingSession.create({
      user: req.session.user._id, station: stationId, connectorIndex: connectorIndex || 0,
      status: 'charging', startTime: new Date(), pricePerKwh: station.pricePerKwh,
      targetEnergy: targetEnergy || 50, batteryStart: Math.floor(Math.random() * 30) + 10
    });
    res.json({ success: true, sessionId: session._id });
  } catch (error) { res.json({ success: false, message: error.message }); }
};

exports.getChargingSession = async (req, res) => {
  try {
    const session = await ChargingSession.findById(req.params.id).populate('station');
    if (!session) return res.redirect('/customer');
    res.renderCustomer('charging-session', { title: 'Phiên sạc', session, hideNav: true });
  } catch (error) { res.redirect('/customer'); }
};

exports.getChargingStatus = async (req, res) => {
  try {
    const session = await ChargingSession.findById(req.params.id);
    if (!session || session.status !== 'charging') return res.json({ success: true, session });
    const powerKw = 22 + Math.random() * 8;
    const speedMultiplier = 60; // Tăng tốc độ mô phỏng lên 60 lần (1 phút thực tế = 1 tiếng sạc ảo)
    const energyIncrement = (powerKw / 3600) * 2 * speedMultiplier;
    session.energyDelivered = Math.min(session.energyDelivered + energyIncrement, session.targetEnergy || 50);
    session.currentPower = Math.round(powerKw * 10) / 10;
    session.totalCost = Math.round(session.energyDelivered * session.pricePerKwh);
    session.batteryEnd = Math.min(session.batteryStart + (session.energyDelivered / 60) * 100, 100);
    if (session.energyDelivered >= (session.targetEnergy || 50)) {
      session.status = 'completed'; session.endTime = new Date();
      const station = await Station.findById(session.station);
      if (station) { station.connectors[session.connectorIndex].status = 'available'; station.totalSessions += 1; station.totalRevenue += session.totalCost; await station.save(); }
    }
    await session.save();
    res.json({ success: true, session });
  } catch (error) { res.json({ success: false, message: error.message }); }
};

exports.stopCharging = async (req, res) => {
  try {
    const session = await ChargingSession.findById(req.params.id);
    if (!session) return res.json({ success: false, message: 'Phiên sạc không tồn tại' });
    session.status = 'completed'; session.endTime = new Date();
    session.totalCost = Math.round(session.energyDelivered * session.pricePerKwh);
    await session.save();
    const station = await Station.findById(session.station);
    if (station) { station.connectors[session.connectorIndex].status = 'available'; station.totalSessions += 1; station.totalRevenue += session.totalCost; await station.save(); }
    const user = await User.findById(req.session.user._id);
    if (user) { user.balance -= session.totalCost; await user.save(); req.session.user.balance = user.balance; }
    session.paymentStatus = 'paid'; await session.save();
    res.json({ success: true, session });
  } catch (error) { res.json({ success: false, message: error.message }); }
};
