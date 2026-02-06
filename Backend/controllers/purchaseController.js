const Purchase = require('../models/Purchase');
const cloudinary = require('../config/cloudinary');

const createPurchase = async (req, res) => {
  try {
    const {
      dlpNumber, vehicleNumber, model, brand,
      insurance, insuranceDetails, fine,
      purchaseCommission, purchaseMaintenance, netPurchase,
      owner, rcRemark, runningKm,
      purchaseDate, aadharCard, addressProof, phone,
      email, serviceStatus, buyerType, brokerName,financeName
    } = req.body;

    if (!dlpNumber || !vehicleNumber || !model || !brand) {
      return res.status(400).json({
        message: 'dlpNumber, vehicleNumber, model, and brand are required'
      });
    }

    const purchaseMaintenanceValue = purchaseMaintenance !== undefined && purchaseMaintenance !== null
      ? Number(purchaseMaintenance)
      : 0;

    const purchaseCommissionValue = purchaseCommission !== undefined && purchaseCommission !== null
      ? Number(purchaseCommission)
      : 0;

    const netPurchaseValue = netPurchase !== undefined && netPurchase !== null
      ? Number(netPurchase)
      : 0;

    const fineValue = fine !== undefined && fine !== null
      ? Number(fine)
      : 0;
    
    const totalPurchase = purchaseCommissionValue + purchaseMaintenanceValue + netPurchaseValue + fineValue;

    const purchaseAmount = purchaseCommissionValue + purchaseMaintenanceValue + netPurchaseValue + fineValue;

    let bikeImages = [];
    if (req.files && req.files.bikeImages && req.files.bikeImages.length > 0) {
      const uploadPromises = req.files.bikeImages.map(file =>
        cloudinary.uploader.upload(file.path, { folder: 'bikes/temp' })
      );
      const uploadedResults = await Promise.all(uploadPromises);
      bikeImages = uploadedResults.map(upload => upload.secure_url);

      if (bikeImages.length > 5) {
        return res.status(400).json({ message: 'Cannot upload more than 5 bike images' });
      }
    }

    const purchase = new Purchase({
      dlpNumber,
      vehicleNumber,
      model,
      brand,
      insurance: insurance !== undefined ? {
        hasInsurance: insurance === true || insurance === 'true',
        insuranceDetails: insurance ? insuranceDetails || '' : ''
      } : undefined,
      fine: fineValue,
      purchaseCommission: purchaseCommissionValue,
      purchaseMaintenance: purchaseMaintenanceValue,
      netPurchase: netPurchaseValue,
      totalPurchase,
      purchaseAmount: purchaseAmount > 0 ? purchaseAmount : 0,
      owner: owner !== undefined ? Number(owner) : undefined,
      rcRemark: rcRemark === true || rcRemark === 'true' ? true : rcRemark === false || rcRemark === 'false' ? false : undefined,
      purchaseDate: purchaseDate || new Date(),
      aadharCard,
      addressProof,
      buyerType,
      brokerName,
      financeName,
      phone,
      email,
      serviceStatus: serviceStatus || 'unsold',
      bikeImages,
      runningKm: runningKm !== undefined ? Number(runningKm) : undefined,
    });

    await purchase.save();
    res.status(201).json({
      message: 'Purchase record created',
      purchase,
      totalPurchase
    });

  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0] || 'A unique field';
      return res.status(400).json({ message: `${duplicateField} already exists` });
    }
    console.error('Create failed:', err);
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};




const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: 1 });  // ascending order
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch', error: err.message });
  }
};


const getSinglePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    res.json({
      purchaseId: purchase._id,
      dlpNumber: purchase.dlpNumber,
      vehicleNumber: purchase.vehicleNumber,
      model: purchase.model,
      brand: purchase.brand,
      insurance: purchase.insurance,
      fine: purchase.fine,
      purchaseCommission: purchase.purchaseCommission,
      purchaseMaintenance: purchase.purchaseMaintenance,
      netPurchase: purchase.netPurchase,
      purchaseAmount: purchase.purchaseAmount,
      owner: purchase.owner,
      rcRemark: purchase.rcRemark,
      runningKm: purchase.runningKm,
      total: purchase.total,
      purchaseDate: purchase.purchaseDate,
      createdAt: purchase.createdAt,
      aadharCard: purchase.aadharCard,
      addressProof: purchase.addressProof,
      phone: purchase.phone,
      email: purchase.email,
      serviceStatus: purchase.serviceStatus,
      bikeImages: purchase.bikeImages,
      profilePicture: purchase.profilePicture || '',
      maintenance: [],          // keep empty for now
      maintenanceRecords: []    // keep empty for now
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch purchase', error: err.message });
  }
};


const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (purchase.profilePicture) {
      const match = purchase.profilePicture.match(/\/(purchase_uploads\/[^/.]+)/);
      if (match) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    purchase.profilePicture = req.file?.path || '';
    await purchase.save();

    res.status(200).json({
      message: 'Profile picture uploaded',
      profilePicture: purchase.profilePicture
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile upload failed', error: err.message });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (!purchase.profilePicture) {
      return res.status(400).json({ message: 'No profile picture to delete' });
    }

    const match = purchase.profilePicture.match(/\/(purchase_uploads\/[^/.]+)/);
    if (match) {
      await cloudinary.uploader.destroy(match[1]);
    }

    purchase.profilePicture = '';
    await purchase.save();

    res.status(200).json({ message: 'Profile picture deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Profile delete failed', error: err.message });
  }
};



const editPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Purchase ID is required' });

    const purchase = await Purchase.findById(id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    const updateData = { ...req.body };


    const purchaseCommission = updateData.purchaseCommission !== undefined ? Number(updateData.purchaseCommission) : purchase.purchaseCommission || 0;
    const purchaseMaintenance = updateData.purchaseMaintenance !== undefined ? Number(updateData.purchaseMaintenance) : purchase.purchaseMaintenance || 0;
    const netPurchase = updateData.netPurchase !== undefined ? Number(updateData.netPurchase) : purchase.netPurchase || 0;
    const fine = updateData.fine !== undefined ? Number(updateData.fine) : purchase.fine || 0;

 
    updateData.purchaseAmount = purchaseCommission + purchaseMaintenance + netPurchase + fine;

    
    if (updateData.insurance !== undefined) {
      updateData.insurance = {
        hasInsurance: updateData.insurance === true || updateData.insurance === 'true',
        insuranceDetails: updateData.insuranceDetails || ''
      };
    }

  
    if (updateData.rcRemark !== undefined) {
      updateData.rcRemark = updateData.rcRemark === true || updateData.rcRemark === 'true';
    }
    if (updateData.owner !== undefined) updateData.owner = Number(updateData.owner);
    if (updateData.runningKm !== undefined) updateData.runningKm = Number(updateData.runningKm);
    if (updateData.total !== undefined) updateData.total = Number(updateData.total);

    if (req.files?.bikeImages?.length > 0) {
   
      for (const url of purchase.bikeImages) {
        const match = url.match(/\/(bikes\/temp\/[^/.]+)/);
        if (match) await cloudinary.uploader.destroy(match[1]);
      }
      const uploadedImages = await Promise.all(
        req.files.bikeImages.map(file =>
          cloudinary.uploader.upload(file.path, { folder: 'bikes/temp' })
        )
      );

      const newBikeImages = uploadedImages.map(upload => upload.secure_url);
      if (newBikeImages.length > 5) {
        return res.status(400).json({ message: 'Cannot upload more than 5 bike images' });
      }

      updateData.bikeImages = newBikeImages;
    }

    const updated = await Purchase.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Purchase not found after update' });

    res.json({ message: 'Purchase updated successfully', updated });
  } catch (err) {
    console.error('Edit failed:', err);
    res.status(500).json({ message: 'Edit failed', error: err.message });
  }
};

module.exports = {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  deletePurchase,
  uploadProfilePicture,
  deleteProfilePicture,
  editPurchase,
};

