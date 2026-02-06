const Broker = require('../models/Broker');

exports.createBroker = async (req, res) => {
  try {
    const { name, mobile, address, aadharCard } = req.body;
    const broker = new Broker({ name, mobile, address, aadharCard });
    await broker.save();
    res.status(201).json({ message: 'Broker created', broker });
  } catch (error) {
    res.status(500).json({ message: 'Error creating broker', error: error.message });
  }
};


exports.getBrokers = async (req, res) => {
  try {
    const brokers = await Broker.find();
    res.status(200).json(brokers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brokers', error: error.message });
  }
};


exports.getBrokerById = async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id);
    if (!broker) return res.status(404).json({ message: 'Broker not found' });
    res.status(200).json(broker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching broker', error: error.message });
  }
};


exports.updateBroker = async (req, res) => {
  try {
    const { name, mobile, address, aadharCard } = req.body;
    const broker = await Broker.findByIdAndUpdate(
      req.params.id,
      { name, mobile, address, aadharCard },
      { new: true }
    );
    if (!broker) return res.status(404).json({ message: 'Broker not found' });
    res.status(200).json({ message: 'Broker updated', broker });
  } catch (error) {
    res.status(500).json({ message: 'Error updating broker', error: error.message });
  }
};


exports.deleteBroker = async (req, res) => {
  try {
    const broker = await Broker.findByIdAndDelete(req.params.id);
    if (!broker) return res.status(404).json({ message: 'Broker not found' });
    res.status(200).json({ message: 'Broker deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting broker', error: error.message });
  }
};
