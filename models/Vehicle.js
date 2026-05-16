const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  manufacturer: { type: String },
  model: { type: String },
  year: { type: Number },
  licensePlate: { type: String, required: true },
  batteryCapacity: { type: Number, required: true },
  connectorType: { type: String, enum: ['Type1', 'Type2', 'CCS', 'CHAdeMO', 'Tesla'] },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
