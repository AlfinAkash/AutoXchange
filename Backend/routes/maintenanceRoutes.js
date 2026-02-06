const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')

router.get('/unsold-without-maintenance', auth, role('admin'), maintenanceController.getUnsoldPurchasesWithoutMaintenance);
router.get('/', auth, maintenanceController.getAllMaintenance);
router.post('/:bikeId', auth, maintenanceController.addMaintenance);
router.get('/:bikeId', auth, maintenanceController.getMaintenanceByBike);
router.patch('/:id', auth, maintenanceController.updateMaintenance);
router.delete('/:id', auth, maintenanceController.deleteMaintenance); 
router.delete('/:id/parts/:partName', auth, maintenanceController.deleteSinglePart);


module.exports = router;

