const mongoose = require('mongoose');

const chargingSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
  connectorIndex: { type: Number, default: 0 },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  status: {
    type: String,
    enum: ['pending', 'charging', 'completed', 'cancelled', 'error'],
    default: 'pending'
  },
  startTime: { type: Date },
  endTime: { type: Date },
  energyDelivered: { type: Number, default: 0 },
  targetEnergy: { type: Number },
  currentPower: { type: Number, default: 0 },
  batteryStart: { type: Number, default: 0 },
  batteryEnd: { type: Number, default: 0 },
  pricePerKwh: { type: Number, required: true },
  totalCost: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: { type: String, default: 'wallet' },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ChargingSession', chargingSessionSchema);
