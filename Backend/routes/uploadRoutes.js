const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { uploadProfileImage, deleteProfileImage, uploadBikeImages, deleteBikeImage } = require('../controllers/uploadController');

const upload = multer({ dest: 'uploads/' });

router.use(auth);

router.post('/profile', upload.single('file'), uploadProfileImage);
router.delete('/profile', deleteProfileImage);
router.post('/bike/:bikeId', upload.array('files', 5), uploadBikeImages);
router.delete('/bike/:bikeId', deleteBikeImage);

module.exports = router;
