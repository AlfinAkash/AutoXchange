const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  deletePurchase,
  uploadProfilePicture,
  deleteProfilePicture,
  editPurchase  
} = require('../controllers/purchaseController');



router.post(
  '/',
  upload.fields([{ name: 'bikeImages', maxCount: 5 }]),
  createPurchase
);

router.get('/', getAllPurchases);
router.get('/:id', getSinglePurchase);

router.put('/:id', editPurchase); 

router.delete('/:id', deletePurchase);

router.post(
  '/:id/profile-picture',
  upload.single('profilePicture'),
  uploadProfilePicture
);

router.delete(
  '/:id/profile-picture',
  deleteProfilePicture
);

module.exports = router;
