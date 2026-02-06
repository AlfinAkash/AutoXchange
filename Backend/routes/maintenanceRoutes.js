const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')

router.get('/unsold-without-maintenance', maintenanceController.getUnsoldPurchasesWithoutMaintenance);
router.get('/', maintenanceController.getAllMaintenance);
router.post('/:bikeId', maintenanceController.addMaintenance);
router.get('/:bikeId', maintenanceController.getMaintenanceByBike);
router.patch('/:id', maintenanceController.updateMaintenance);
router.delete('/:id', maintenanceController.deleteMaintenance); 
router.delete('/:id/parts/:partName', maintenanceController.deleteSinglePart);


module.exports = router;

