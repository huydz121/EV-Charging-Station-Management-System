const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
  connectorIndex: { type: Number, default: 0 },
  scheduledTime: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
    default: 'pending'
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
