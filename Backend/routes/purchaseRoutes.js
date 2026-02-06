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
  '/',auth, 
  upload.fields([{ name: 'bikeImages', maxCount: 5 }]),
  createPurchase
);

router.get('/', auth, getAllPurchases);
router.get('/:id', auth, getSinglePurchase);

router.put('/:id', auth, editPurchase); 

router.delete('/:id', auth, deletePurchase);

router.post(
  '/:id/profile-picture',auth,
  upload.single('profilePicture'),
  uploadProfilePicture
);

router.delete(
  '/:id/profile-picture',auth,
  deleteProfilePicture
);

module.exports = router;
