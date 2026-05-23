const Station = require('../../models/Station');

exports.getMap = async (req, res) => {
  try {
    const stations = await Station.find({ status: 'active' });
    res.renderCustomer('map', {
      title: 'Tìm trạm sạc',
      stations: JSON.stringify(stations),
      activePage: 'map'
    });
  } catch (error) {
    console.error(error);
    res.redirect('/customer');
  }
};

const ChargingSession = require('../../models/ChargingSession');

exports.getStationDetail = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.redirect('/customer/map');
    
    let sessionMap = {};
    if (req.session && req.session.user) {
      const activeSessions = await ChargingSession.find({
        station: station._id,
        user: req.session.user._id,
        status: 'charging'
      });
      activeSessions.forEach(s => {
        sessionMap[s.connectorIndex] = s._id.toString();
      });
    }

    res.renderCustomer('station-detail', { title: station.name, station, activePage: 'map', sessionMap });
  } catch (error) {
    res.redirect('/customer/map');
  }
};

exports.searchStations = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, q } = req.query;
    let query = { status: 'active' };
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      };
    }
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } }
      ];
    }
    const stations = await Station.find(query).limit(20);
    res.json({ success: true, stations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
