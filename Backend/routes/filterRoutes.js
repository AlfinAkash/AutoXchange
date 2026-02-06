const express = require('express');
const router = express.Router();
const { filterAllItems, getCurrentStock } = require('../controllers/filtersController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')

router.get('/search', auth, filterAllItems);  
router.get('/stock', auth, getCurrentStock);  

module.exports = router;
