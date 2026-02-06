const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const cloudinary = require('../config/cloudinary');
const generateInvoice = require('../utils/generateInvoice');
const axios = require('axios');



const WHATSAPP_API_URL = 'https://graph.facebook.com/v20.0';
const WHATSAPP_NUMBER_ID = process.env.WHATSAPP_NUMBER_ID; 
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; 

const createSale = async (req, res) => {
  try {
    const {
      buyerName, aadharNumber, phone, addressProof,
      vehicleNumber, rcBookDetails = false, sellingAmount,
      dlsNumber, finance, financeAmount, advanceAmount, financeName,
      batteryName, batteryNo, batteryBrand, batteryWarrantyExpiry, tyreBrand,
      saleDate,cash,remark
    } = req.body;

    const purchase = await Purchase.findOne({ vehicleNumber });
    if (!purchase) return res.status(400).json({ message: 'Vehicle not found in purchases' });
    if (purchase.serviceStatus === 'sold') return res.status(400).json({ message: 'Vehicle is already sold' });

    let bikeImages = [];
    if (req.files?.bikeImages?.length > 0) {
      const uploadedResults = await Promise.all(
        req.files.bikeImages.map(file =>
          cloudinary.uploader.upload(file.path, { folder: 'sales/temp' })
        )
      );
      bikeImages = uploadedResults.map(upload => upload.secure_url);
      if (bikeImages.length > 5) return res.status(400).json({ message: 'Cannot upload more than 5 images' });
    }

    const finalSaleDate = saleDate ? new Date(saleDate) : new Date();
    const sellingAmountValue = sellingAmount ? Number(sellingAmount) : 0;
    const purchaseAmountValue = purchase.purchaseAmount || 0;
    const profit = sellingAmountValue - purchaseAmountValue;

    const sale = new Sale({
      buyerName,
      aadharNumber,
      phone,
      addressProof,
      vehicleNumber,
      rcBookDetails: rcBookDetails === true || rcBookDetails === 'true',
      sellingAmount: sellingAmountValue,
      dlsNumber,
      finance: finance === true || finance === 'true',
      financeAmount: financeAmount ? Number(financeAmount) : undefined,
      advanceAmount: advanceAmount ? Number(advanceAmount) : undefined,
      financeName,
      batteryName,
      batteryNo,
      batteryBrand,
      batteryWarrantyExpiry,
      tyreBrand,
      bikeImages,
      saleDate: finalSaleDate,
      cash: cash === true || cash === 'true',
      cashAmount: req.body.cashAmount !== undefined ? Number(req.body.cashAmount) : undefined ,
      remark,
      profit
    });

    await sale.save();
    await Purchase.findByIdAndUpdate(purchase._id, {
      serviceStatus: 'sold',
      saleDate: finalSaleDate
    });

    try {
      const invoiceBuffer = await generateInvoice(sale, purchase);

      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', invoiceBuffer, { filename: `Invoice_${sale._id}.pdf` });
      form.append('type', 'application/pdf');
      form.append('messaging_product', 'whatsapp');

      const mediaUpload = await axios.post(
        `${WHATSAPP_API_URL}/${WHATSAPP_NUMBER_ID}/media`,
        form,
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            ...form.getHeaders()
          }
        }
      );

      const mediaId = mediaUpload.data.id;

      await axios.post(
        `${WHATSAPP_API_URL}/${WHATSAPP_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: `91${phone}`,
          type: 'document',
          document: {
            id: mediaId,
            filename: `Invoice_${sale._id}.pdf`
          }
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(` WhatsApp invoice sent to ${phone}`);
    } catch (whatsappErr) {
      console.error('WhatsApp send failed:', whatsappErr.response?.data || whatsappErr.message);
    }

    res.status(201).json({
      message: 'Sale recorded' + (phone ? ' (WhatsApp invoice attempted)' : ''),
      sale
    });

  } catch (err) {
    console.error('Create sale failed:', err);
    res.status(500).json({ message: 'Sale creation failed', error: err.message });
  }
};



const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    const salesWithPurchase = await Promise.all(
      sales.map(async (sale) => {
        const purchase = await Purchase.findOne({ vehicleNumber: sale.vehicleNumber });
        return {
          sale,
          purchase: purchase || null
        };
      })
    );
    res.json({ message: 'Sales fetched successfully', sales: salesWithPurchase });
  } catch (err) {
    console.error('Get sales failed:', err);
    res.status(500).json({ message: 'Failed to fetch sales', error: err.message });
  }
};

const updateSale = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.rcBookDetails !== undefined) updateData.rcBookDetails = updateData.rcBookDetails === true || updateData.rcBookDetails === 'true';
    if (updateData.aadharNumber !== undefined) updateData.aadharNumber = Number(updateData.aadharNumber);
    if (updateData.phone !== undefined) updateData.phone = Number(updateData.phone);
    if (updateData.sellingAmount !== undefined) updateData.sellingAmount = Number(updateData.sellingAmount);
    if (updateData.financeAmount !== undefined) updateData.financeAmount = Number(updateData.financeAmount);
    if (updateData.finance !== undefined)
  updateData.finance = updateData.finance === true || updateData.finance === 'true';

    if (updateData.advanceAmount !== undefined)
  updateData.advanceAmount = Number(updateData.advanceAmount);

    if (updateData.financeName !== undefined)
  updateData.financeName = updateData.financeName;
    
    if (updateData.cash !== undefined) updateData.cash = updateData.cash === true || updateData.cash === 'true';

    if (updateData.remark !== undefined) updateData.remark = String(updateData.remark);

    if (updateData.cashAmount !== undefined) updateData.cashAmount = Number(updateData.cashAmount);


    const sale = await Sale.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    res.json({ message: 'Sale updated', sale });
  } catch (err) {
    console.error('Update sale failed:', err);
    res.status(500).json({ message: 'Sale update failed', error: err.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const purchase = await Purchase.findOneAndUpdate(
      { vehicleNumber: sale.vehicleNumber },
      { serviceStatus: 'unsold' }
    );

    if (!purchase) {
      console.warn(`No purchase found for vehicleNumber: ${sale.vehicleNumber}`);
    }

    return res.status(200).json({
      message: 'Sale deleted successfully and vehicle marked as unsold',
      saleId: id,
      vehicleNumber: sale.vehicleNumber
    });
  } catch (err) {
    console.error('Delete sale failed:', err);
    return res.status(500).json({
      message: 'Sale deletion failed',
      error: err.message
    });
  }
};


const editSale = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Sale ID is required' });

    const updateData = {};

    if ('buyerName' in req.body) updateData.buyerName = req.body.buyerName;
    if ('aadharNumber' in req.body) updateData.aadharNumber = req.body.aadharNumber;
    if ('phone' in req.body) updateData.phone = req.body.phone;
    if ('addressProof' in req.body) updateData.addressProof = req.body.addressProof;
    if ('vehicleNumber' in req.body) updateData.vehicleNumber = req.body.vehicleNumber;
    if ('rcBookDetails' in req.body) updateData.rcBookDetails = req.body.rcBookDetails === 'true' || req.body.rcBookDetails === true;
    if ('sellingAmount' in req.body) updateData.sellingAmount = Number(req.body.sellingAmount);
    if ('dlsNumber' in req.body) updateData.dlsNumber = req.body.dlsNumber;
    if ('finance' in req.body) updateData.finance = req.body.finance;
    if ('financeAmount' in req.body) updateData.financeAmount = Number(req.body.financeAmount);
    if ('batteryName' in req.body) updateData.batteryName = req.body.batteryName;
    if ('batteryNo' in req.body) updateData.batteryNo = req.body.batteryNo;
    if ('batteryBrand' in req.body) updateData.batteryBrand = req.body.batteryBrand;
    if ('batteryWarrantyExpiry' in req.body) updateData.batteryWarrantyExpiry = req.body.batteryWarrantyExpiry;
    if ('tyreBrand' in req.body) updateData.tyreBrand = req.body.tyreBrand;
    if ('saleDate' in req.body) updateData.saleDate = new Date(req.body.saleDate);
    if ('cash' in req.body) updateData.cash = req.body.cash === true || req.body.cash === 'true';
    if ('remark' in req.body) updateData.remark = req.body.remark;
    if ('cashAmount' in req.body) updateData.cashAmount = Number(req.body.cashAmount);

    if ('finance' in req.body)
  updateData.finance = req.body.finance === true || req.body.finance === 'true';  

   if ('advanceAmount' in req.body)
  updateData.advanceAmount = Number(req.body.advanceAmount);                     

   if ('financeName' in req.body)
  updateData.financeName = req.body.financeName;                                  

    const updatedSale = await Sale.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedSale) return res.status(404).json({ message: 'Sale not found' });

    res.json({ message: 'Sale updated successfully', sale: updatedSale });

  } catch (err) {
    console.error('Edit sale failed:', err);
    res.status(500).json({ message: 'Edit sale failed', error: err.message });
  }
};

const getSaleInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    const purchase = await Purchase.findOne({ vehicleNumber: sale.vehicleNumber });
    await generateInvoice(sale, purchase, res);
  } catch (err) {
    console.error('Invoice generation failed:', err);
    res.status(500).json({ message: 'Failed to generate invoice', error: err.message });
  }
};



module.exports = { createSale, getSales, updateSale, deleteSale, editSale, getSaleInvoice};
