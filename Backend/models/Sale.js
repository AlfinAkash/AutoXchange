const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase' 
  },
  buyerName: String,
  aadharNumber: String,
  phone: String,
  addressProof: String,
  vehicleNumber: String,
  rcBookDetails: { type: Boolean, default: false },
  sellingAmount: Number,
  dlsNumber: String,
   finance: { type: Boolean, default: false }, 
  financeAmount: Number,
  advanceAmount: Number,                              
  financeName: String, 
  profit:Number,
  batteryName: String,
  batteryNo:String,
  batteryBrand: String,
  batteryWarrantyExpiry: Date,
  tyreBrand: String,
  bikeImages: [String],
  saleDate: { type: Date},
  cash: { type: Boolean, default: false },
  cashAmount: Number,
  remark: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
