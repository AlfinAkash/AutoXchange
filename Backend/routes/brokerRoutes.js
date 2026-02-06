const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')

router.post('/', brokerController.createBroker);
router.get('/', brokerController.getBrokers);
router.get('/:id', brokerController.getBrokerById);
router.put('/:id', brokerController.updateBroker);
router.delete('/:id', brokerController.deleteBroker);

module.exports = router;
