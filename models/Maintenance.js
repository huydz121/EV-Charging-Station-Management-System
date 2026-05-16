const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
  connectorIndex: { type: Number },
  type: { type: String, enum: ['scheduled', 'emergency', 'inspection'], default: 'scheduled' },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: { type: String },
  scheduledDate: { type: Date },
  completedDate: { type: Date },
  cost: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
