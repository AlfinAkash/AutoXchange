const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  dlpNumber: { type: String, unique: true },
  vehicleNumber: { type: String, unique: true },
  model: String,
  brand: String,
  insurance: {
    hasInsurance: Boolean,
    insuranceDetails: String
  },
  fine: Number,
  purchaseAmount: Number,       
  purchaseCommission: Number,
  purchaseMaintenance: Number,
  totalPurchase:Number,
  owner: Number,
  rcRemark: Boolean,
  netPurchase: Number,
  total: Number,
  purchaseDate: Date,
  aadharCard: String,
  addressProof: String,
  buyerType:String,
  brokerName:String,
  financeName:String,
  phone: String,
  email: String,
  serviceStatus: { type: String, default: 'unsold' },
  profilePicture: String,
  bikeImages: [String],
  runningKm: Number, 
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
