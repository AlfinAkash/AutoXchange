const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')
const { exportPurchasesExcel } = require('../controllers/exportController');

router.get('/excel', auth, exportPurchasesExcel);

module.exports = router;
