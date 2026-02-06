const express = require('express');
const router = express.Router();
const { filterAllItems, getCurrentStock } = require('../controllers/filtersController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')

router.get('/search', filterAllItems);  
router.get('/stock', getCurrentStock);  

module.exports = router;
