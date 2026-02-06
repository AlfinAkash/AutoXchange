const Counter = require('../models/counterModel');

const getNextEmpId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'empId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `EMP${counter.value}`;
};

module.exports = getNextEmpId;

