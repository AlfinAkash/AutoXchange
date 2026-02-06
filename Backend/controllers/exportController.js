const ExcelJS = require('exceljs');
const Purchase = require('../models/Purchase'); 

const exportPurchasesExcel = async (req, res) => {
  try {
    const purchases = await Purchase.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Purchases');

  
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 24 },
      { header: 'User ID', key: 'userId', width: 24 },
      { header: 'Metal', key: 'metal', width: 10 },
      { header: 'Purity', key: 'purity', width: 10 },
      { header: 'Amount', key: 'amount', width: 10 },
      { header: 'Scheme', key: 'scheme', width: 15 },
      { header: 'Payment ID', key: 'razorpayPaymentId', width: 24 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    purchases.forEach((purchase) => {
      worksheet.addRow({
        _id: purchase._id.toString(),
        userId: purchase.userId?.toString() || '',
        metal: purchase.metal,
        purity: purchase.purity,
        amount: purchase.amount,
        scheme: purchase.scheme,
        razorpayPaymentId: purchase.razorpayPaymentId,
        createdAt: purchase.createdAt?.toISOString().slice(0, 19).replace('T', ' ')
      });
    });


    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=purchases.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting Excel:', err);
    res.status(500).json({ error: 'Failed to export purchases to Excel' });
  }
};

module.exports = { exportPurchasesExcel };
