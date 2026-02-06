const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createSale, getSales, updateSale, deleteSale,getSaleInvoice } = require('../controllers/salesController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.fields([{ name: 'bikeImages', maxCount: 5 }]), createSale);
router.get('/', getSales);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);
router.get('/:id/invoice', getSaleInvoice);


module.exports = router;
