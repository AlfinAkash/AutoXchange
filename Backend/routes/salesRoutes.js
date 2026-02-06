const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createSale, getSales, updateSale, deleteSale,getSaleInvoice } = require('../controllers/salesController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.fields([{ name: 'bikeImages', maxCount: 5 }]), createSale);
router.get('/', auth, getSales);
router.put('/:id', auth, updateSale);
router.delete('/:id', auth, deleteSale);
router.get('/:id/invoice', auth, getSaleInvoice);


module.exports = router;
