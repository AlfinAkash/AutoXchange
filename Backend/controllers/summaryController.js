
const Purchase = require('../models/Purchase');
const Sale = require('../models/Sale');

const getSummary = async (req, res) => {
  try {
    const soldCount = await Purchase.countDocuments({ serviceStatus: 'sold' });
    const unsoldCount = await Purchase.countDocuments({ serviceStatus: 'unsold' });

    const totalPurchaseResult = await Purchase.aggregate([
      { $group: { _id: null, total: { $sum: '$purchaseAmount' } } }
    ]);
    const totalPurchaseAmount = totalPurchaseResult[0]?.total || 0;

    const totalSales = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSellingAmount: { $sum: '$sellingAmount' },
          totalSalesAmount: { $sum: '$sellingAmount' }, // same for frontend match
          totalProfit: { $sum: '$profit' }
        }
      }
    ]);

    const {
      totalSellingAmount = 0,
      totalSalesAmount = 0,
      totalProfit = 0
    } = totalSales[0] || {};

    const monthlyPurchase = await Purchase.aggregate([
      { $match: { serviceStatus: 'sold' } },
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" }
          },
          total: { $sum: "$purchaseAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlySales = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$saleDate" },
            month: { $month: "$saleDate" }
          },
          total: { $sum: "$sellingAmount" },
          profit: { $sum: "$profit" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const saleRecords = await Sale.find();
    const monthlyProfitMap = new Map();

    for (const sale of saleRecords) {
      const date = new Date(sale.saleDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const purchase = await Purchase.findOne({ vehicleNumber: sale.vehicleNumber });
      const purchaseAmount = purchase?.purchaseAmount || 0;

      const prev = monthlyProfitMap.get(monthKey) || { purchase: 0, sale: 0, profit: 0 };

      monthlyProfitMap.set(monthKey, {
        purchase: prev.purchase + purchaseAmount,
        sale: prev.sale + sale.sellingAmount,
        profit: prev.profit + (sale.sellingAmount - purchaseAmount)
      });
    }

    const monthlyProfit = Array.from(monthlyProfitMap.entries()).map(([month, data]) => ({
      month,
      ...data
    }));

    const yearlyPurchase = await Purchase.aggregate([
      { $match: { serviceStatus: 'sold' } },
      {
        $group: {
          _id: { year: { $year: "$purchaseDate" } },
          total: { $sum: "$purchaseAmount" }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);

    const yearlySales = await Sale.aggregate([
      {
        $group: {
          _id: { year: { $year: "$saleDate" } },
          sellingAmount: { $sum: "$sellingAmount" },
          profit: { $sum: "$profit" }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);


    const yearlyProfitMap = new Map();
    yearlyPurchase.forEach(p => {
      yearlyProfitMap.set(p._id.year, { purchase: p.total, sale: 0, profit: 0 });
    });

    yearlySales.forEach(s => {
      const year = s._id.year;
      const existing = yearlyProfitMap.get(year) || { purchase: 0, sale: 0, profit: 0 };
      existing.sale = s.sellingAmount;
      existing.profit = s.profit;
      yearlyProfitMap.set(year, existing);
    });

    const yearlyProfit = Array.from(yearlyProfitMap.entries()).map(([year, val]) => ({
      year,
      purchase: val.purchase,
      sale: val.sale,
      profit: val.profit
    }));


    res.json({
      soldCount,
      unsoldCount,
      totalPurchaseAmount,
      totalSalesAmount,
      totalSellingAmount,
      profitAmount: totalProfit,
      monthly: {
        purchase: monthlyPurchase,
        sale: monthlySales,
        profit: monthlyProfit
      },
      yearly: {
        purchase: yearlyPurchase,
        sale: yearlySales,
        profit: yearlyProfit
      }
    });

  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ message: 'Failed to get summary', error: err.message });
  }
};

module.exports = { getSummary };


