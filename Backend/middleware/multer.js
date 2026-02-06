const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'purchase_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
});

module.exports = upload;
