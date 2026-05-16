const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'ChargingSession' },
  type: { type: String, enum: ['charge', 'topup', 'refund'], required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['wallet', 'payos', 'bank_transfer'], default: 'wallet' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  payosOrderCode: { type: Number },
  payosPaymentLink: { type: String },
  description: { type: String },
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
