const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')

router.post('/', auth, role('admin'), brokerController.createBroker);
router.get('/', auth, brokerController.getBrokers);
router.get('/:id', auth, brokerController.getBrokerById);
router.put('/:id', auth, role('admin'), brokerController.updateBroker);
router.delete('/:id', auth, role('admin'), brokerController.deleteBroker);

module.exports = router;
