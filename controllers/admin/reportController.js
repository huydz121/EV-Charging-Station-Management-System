const ChargingSession = require('../../models/ChargingSession');
const Station = require('../../models/Station');
const fs = require('fs');
const path = require('path');

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

exports.exportCSV = async (req, res) => {
  try {
    const sessions = await ChargingSession.find().populate('user', 'fullName').populate('station', 'name').sort({ createdAt: -1 });
    const filePath = path.join(__dirname, '../../public/uploads/reports.csv');
    const writeStream = fs.createWriteStream(filePath);
    
    // Write BOM for Excel UTF-8 support
    writeStream.write('\uFEFF');
    writeStream.write('Mã GD,Khách hàng,Trạm sạc,Năng lượng (kWh),Tổng tiền (VNĐ),Trạng thái,Ngày tạo\n');
    
    sessions.forEach(session => {
      const id = session._id.toString();
      const user = session.user ? `"${session.user.fullName}"` : 'Khách lẻ';
      const station = session.station ? `"${session.station.name}"` : 'Trạm xóa';
      const energy = session.energyDelivered;
      const cost = session.totalCost;
      const status = session.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán';
      const date = `"${new Date(session.createdAt).toLocaleString('vi-VN')}"`;
      writeStream.write(`${id},${user},${station},${energy},${cost},${status},${date}\n`);
    });
    
    writeStream.end();
    
    writeStream.on('finish', () => {
      res.download(filePath, 'bao_cao_doanh_thu.csv', (err) => {
        if (err) console.error('Error downloading file:', err);
      });
    });
  } catch (error) {
    console.error(error);
    res.redirect('/admin/reports');
  }
};
