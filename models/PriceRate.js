const mongoose = require('mongoose');

const priceRateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['standard', 'peak', 'off_peak', 'weekend'], default: 'standard' },
  pricePerKwh: { type: Number, required: true },
  startHour: { type: Number, default: 0 },
  endHour: { type: Number, default: 24 },
  days: [{ type: Number }],
  isActive: { type: Boolean, default: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PriceRate', priceRateSchema);
