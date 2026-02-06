const mongoose = require('mongoose');
const Maintenance = require('../models/Maintenance');
const Purchase = require('../models/Purchase');

const addMaintenance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(req.params.bikeId).session(session);
    if (!purchase) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Purchase not found' });
    }
    if (purchase.serviceStatus !== 'unsold') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cannot add maintenance on sold bike' });
    }
    if (purchase.maintenance) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Maintenance already added' });
    }

    const inputParts = req.body.parts || [];
    const combinedParts = inputParts.length > 0
      ? inputParts.map(part => ({ name: part.name, amount: part.amount }))
      : [
          { name: 'Water Service', amount: 0 },
          { name: 'Tyre', amount: 0 },
          { name: 'Integrator', amount: 0 },
          { name: 'Chain Bracket', amount: 0 },
          { name: 'Seat Cover', amount: 0 },
          { name: 'Oil Service', amount: 0 },
          { name: 'Brake Pedal', amount: 0 },
          { name: 'Clutch Plate', amount: 0 },
        ];

    const totalAmount = combinedParts.reduce((sum, part) => sum + part.amount, 0);
    const record = await Maintenance.create([{ bikeId: req.params.bikeId, parts: combinedParts, totalAmount }], { session });
    await Purchase.findByIdAndUpdate(purchase._id, { maintenance: true }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Maintenance record added', record: record[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Maintenance error:', err);
    res.status(500).json({ message: 'Add maintenance failed', error: err.message });
  }
};

const getMaintenanceByBike = async (req, res) => {
  try {
    const records = await Maintenance.find({ bikeId: req.params.bikeId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

const getAllMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find().populate('bikeId');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Fetch all failed', error: err.message });
  }
};

const getUnsoldPurchasesWithoutMaintenance = async (req, res) => {
  try {
    const purchases = await Purchase.find({ serviceStatus: 'unsold', maintenance: false });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Fetch unsold without maintenance failed', error: err.message });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { singlePartName, amount, parts } = req.body;

    let updated;

    if (singlePartName && typeof amount === 'number') {
      updated = await Maintenance.findOneAndUpdate(
        { _id: id, 'parts.name': singlePartName },
        {
          $set: {
            'parts.$.amount': amount
          }
        },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: 'Part not found in maintenance record' });

 
      updated.totalAmount = updated.parts.reduce((sum, part) => sum + part.amount, 0);
      await updated.save();

      return res.json({ message: `Updated part '${singlePartName}' successfully`, updated });
    }

    if (Array.isArray(parts) && parts.length > 0) {
      const totalAmount = parts.reduce((sum, part) => sum + (part.amount || 0), 0);

      updated = await Maintenance.findByIdAndUpdate(
        id,
        { parts, totalAmount },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: 'Maintenance record not found' });

      return res.json({ message: 'Maintenance updated successfully', updated });
    }

    return res.status(400).json({ message: 'Provide either singlePartName & amount or parts array for update' });
  } catch (err) {
    console.error('Update maintenance error:', err);
    res.status(500).json({ message: 'Update maintenance failed', error: err.message });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const deleted = await Maintenance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Maintenance record not found' });


    await Purchase.findByIdAndUpdate(deleted.bikeId, { maintenance: false });

    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (err) {
    console.error('Delete maintenance error:', err);
    res.status(500).json({ message: 'Delete maintenance failed', error: err.message });
  }
};

const deleteSinglePart = async (req, res) => {
  try {
    const { id, partName } = req.params;
    const updated = await Maintenance.findByIdAndUpdate(
      id,
      { $pull: { parts: { name: partName } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Maintenance record not found' });


    updated.totalAmount = updated.parts.reduce((sum, part) => sum + part.amount, 0);
    await updated.save();

    res.json({ message: `Part '${partName}' deleted successfully`, updated });
  } catch (err) {
    console.error('Delete single part error:', err);
    res.status(500).json({ message: 'Delete single part failed', error: err.message });
  }
};



module.exports = {
  addMaintenance,
  getMaintenanceByBike,
  getAllMaintenance,
  getUnsoldPurchasesWithoutMaintenance,
  updateMaintenance,
  deleteMaintenance,
  deleteSinglePart
};