const Station = require('../../models/Station');

exports.listStations = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const stations = await Station.find(filter).sort({ createdAt: -1 });
    res.renderAdmin('stations/index', { title: 'Quản lý trạm sạc', stations, activePage: 'stations', search: search || '' });
  } catch (error) { res.redirect('/admin/dashboard'); }
};

exports.getCreateStation = (req, res) => {
  res.renderAdmin('stations/create', { title: 'Thêm trạm sạc', activePage: 'stations' });
};

exports.createStation = async (req, res) => {
  try {
    const { name, address, lat, lng, pricePerKwh, description, connectors } = req.body;
    const parsedConnectors = [];
    if (connectors && Array.isArray(connectors.type)) {
      for (let i = 0; i < connectors.type.length; i++) parsedConnectors.push({ type: connectors.type[i], power: parseInt(connectors.power[i]) || 22, status: 'available' });
    } else if (connectors && connectors.type) {
      parsedConnectors.push({ type: connectors.type, power: parseInt(connectors.power) || 22, status: 'available' });
    }
    if (parsedConnectors.length === 0) parsedConnectors.push({ type: 'Type2', power: 22, status: 'available' });
    await Station.create({ name, address, location: { type: 'Point', coordinates: [parseFloat(lng) || 106.6297, parseFloat(lat) || 10.8231] }, pricePerKwh: parseInt(pricePerKwh) || 5000, description, connectors: parsedConnectors });
    
    // Add notification globally
    global.adminNotifications.push({ text: `Đã thêm trạm sạc: ${name}`, time: new Date() });
    res.redirect('/admin/stations?msg=created');
  } catch (error) { console.error(error); res.redirect('/admin/stations/create?error=1'); }
};

exports.getEditStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.redirect('/admin/stations');
    res.renderAdmin('stations/edit', { title: 'Sửa trạm sạc', station, activePage: 'stations' });
  } catch (error) { res.redirect('/admin/stations'); }
};

exports.updateStation = async (req, res) => {
  try {
    const { name, address, lat, lng, pricePerKwh, status, description } = req.body;
    await Station.findByIdAndUpdate(req.params.id, { name, address, status, description, pricePerKwh: parseInt(pricePerKwh) || 5000, location: { type: 'Point', coordinates: [parseFloat(lng) || 106.6297, parseFloat(lat) || 10.8231] } });
    
    // Add notification globally
    global.adminNotifications.push({ text: `Đã cập nhật trạm sạc: ${name}`, time: new Date() });
    res.redirect('/admin/stations?msg=updated');
  } catch (error) { res.redirect('/admin/stations'); }
};

exports.deleteStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (station) {
      await Station.findByIdAndDelete(req.params.id);
      global.adminNotifications.push({ text: `Đã xóa trạm sạc: ${station.name}`, time: new Date() });
    }
    res.redirect('/admin/stations?msg=deleted');
  } catch (error) {
    console.error('Delete error:', error);
    res.redirect('/admin/stations?error=delete');
  }
};
