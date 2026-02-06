const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')
const { exportPurchasesExcel } = require('../controllers/exportController');

router.get('/excel', exportPurchasesExcel);

module.exports = router;
