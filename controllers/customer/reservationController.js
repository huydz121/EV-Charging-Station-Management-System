const Reservation = require('../../models/Reservation');
const Station = require('../../models/Station');

exports.createReservation = async (req, res) => {
  try {
    const { stationId, connectorIndex, scheduledTime, duration } = req.body;

    const station = await Station.findById(stationId);
    if (!station) {
      return res.json({ success: false, message: 'Trạm sạc không tồn tại' });
    }

    const reservation = await Reservation.create({
      user: req.session.user._id,
      station: stationId,
      connectorIndex: connectorIndex || 0,
      scheduledTime: new Date(scheduledTime),
      duration: duration || 60,
      status: 'confirmed'
    });

    res.json({ success: true, reservation });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    res.json({ success: true, reservation });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
