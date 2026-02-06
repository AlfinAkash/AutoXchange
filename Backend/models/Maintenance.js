const mongoose = require('mongoose');
const maintenanceSchema = new mongoose.Schema({
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
  parts: [{
    name: String,
    amount: Number
  }],
  totalAmount: Number
}, { timestamps: true });
module.exports = mongoose.model('Maintenance', maintenanceSchema);
