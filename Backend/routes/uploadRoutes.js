const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { uploadProfileImage, deleteProfileImage, uploadBikeImages, deleteBikeImage } = require('../controllers/uploadController');

const upload = multer({ dest: 'uploads/' });

router.use(auth);

router.post('/profile', auth, upload.single('file'), uploadProfileImage);
router.delete('/profile', auth, deleteProfileImage);
router.post('/bike/:bikeId', auth, upload.array('files', 5), uploadBikeImages);
router.delete('/bike/:bikeId', auth, deleteBikeImage);

module.exports = router;
