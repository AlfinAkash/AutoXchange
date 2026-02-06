const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware')

const {
  createUser,
  login,
  sendOtp,
  verifyOtp,
  getAllUsers,
  getProfile,deleteUser,
} = require('../controllers/authController');

router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', auth, getProfile);
router.get('/me',auth, getProfile);
router.post('/create-user',auth, createUser);
router.delete('/delete-user/:userId', auth, role('admin'), deleteUser);
router.get('/all', auth, role('admin'), getAllUsers);


module.exports = router;



