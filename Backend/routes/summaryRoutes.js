const express = require('express');
const router = express.Router(); 
const auth = require('../middleware/authMiddleware'); 
const role = require('../middleware/roleMiddleware');
const { getSummary } = require('../controllers/summaryController');



router.get('/', auth, role('admin'), getSummary);

module.exports = router;
