const Purchase = require('../models/Purchase');
const Sale = require('../models/Sale');


const buildBaseQuery = ({
  q,
  vehicleNumber,
  model,
  brand,
  email,
  phone,
  buyerName,
  aadharNumber,
  status,
}) => {
  const query = {};

  if (q) {
    const regex = new RegExp(q, 'i');
    query.$or = [
      { vehicleNumber: regex },
      { model: regex },
      { brand: regex },
      { email: regex },
      { phone: regex },
      { buyerName: regex },
      { aadharNumber: regex }
    ];
  }


  if (vehicleNumber) {
    query.vehicleNumber = vehicleNumber;
  }

  if (model) {
    query.model = model;
  }

  if (brand) {
    query.brand = brand;
  }

  if (email) {
    query.email = email;
  }

  if (phone) {
    query.phone = phone;
  }

  if (buyerName) {
    query.buyerName = buyerName;
  }

  if (aadharNumber) {
    query.aadharNumber = aadharNumber;
  }

  if (status === 'sold' || status === 'unsold') {
    query.serviceStatus = status;
  }

  return query;
};



const applyDateFilters = (query, { from, to, month }, dateField = 'purchaseDate') => {
  if (month) {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    query[dateField] = { $gte: start, $lt: end };
  } else if (from && to) {
    query[dateField] = { $gte: new Date(from), $lte: new Date(to) };
  }
};

const filterAllItems = async (req, res) => {
  try {
    const purchaseQuery = buildBaseQuery(req.query);
    const saleQuery = buildBaseQuery(req.query);

    applyDateFilters(purchaseQuery, req.query, 'purchaseDate');
    applyDateFilters(saleQuery, req.query, 'saleDate');

    const purchases = await Purchase.find(purchaseQuery).sort({ purchaseDate: -1 });
    const sales = await Sale.find(saleQuery).sort({ createdAt: -1 });

    res.json({ purchases, sales });
  } catch (err) {
    res.status(500).json({ message: 'Filter failed', error: err.message });
  }
};

const getCurrentStock = async (req, res) => {
  try {
    const stock = await Purchase.find({ serviceStatus: 'unsold' });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Stock fetch failed', error: err.message });
  }
};

module.exports = {
  filterAllItems,
  getCurrentStock
};
