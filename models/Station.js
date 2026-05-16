const mongoose = require('mongoose');

const connectorSchema = new mongoose.Schema({
  type: { type: String, enum: ['Type1', 'Type2', 'CCS', 'CHAdeMO', 'Tesla'], required: true },
  power: { type: Number, required: true },
  status: { type: String, enum: ['available', 'in_use', 'maintenance', 'offline'], default: 'available' }
});

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  connectors: [connectorSchema],
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  pricePerKwh: { type: Number, default: 5000 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  operatingHours: {
    open: { type: String, default: '00:00' },
    close: { type: String, default: '23:59' }
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  description: { type: String },
  totalSessions: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 }
}, { timestamps: true });

stationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Station', stationSchema);
