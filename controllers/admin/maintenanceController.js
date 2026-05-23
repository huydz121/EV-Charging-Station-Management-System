const Maintenance = require('../../models/Maintenance');
const Station = require('../../models/Station');

exports.listMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find().populate('station', 'name address').sort({ createdAt: -1 });
    const stations = await Station.find({}, 'name');
    res.renderAdmin('maintenance', { title: 'Bảo trì', records, stations, activePage: 'maintenance' });
  } catch (error) { res.redirect('/admin/dashboard'); }
};

exports.createMaintenance = async (req, res) => {
  try {
    const { station, type, description, assignedTo, scheduledDate } = req.body;
    await Maintenance.create({ station, type, description, assignedTo, scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date() });
    await Station.findByIdAndUpdate(station, { status: 'maintenance' });
    res.redirect('/admin/maintenance');
  } catch (error) { res.redirect('/admin/maintenance'); }
};

exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const record = await Maintenance.findByIdAndUpdate(req.params.id, { status, ...(status === 'completed' ? { completedDate: new Date() } : {}) }, { new: true });
    if (status === 'completed') await Station.findByIdAndUpdate(record.station, { status: 'active' });
    res.json({ success: true, record });
  } catch (error) { res.json({ success: false, message: error.message }); }
};
