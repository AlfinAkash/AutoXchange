const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const Purchase = require('../models/Purchase');


const uploadProfileImage = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (purchase.profilePicture) {
      const match = purchase.profilePicture.match(/\/(purchase_uploads\/[^/.]+)/);
      if (match) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No profile picture uploaded' });
    }

    purchase.profilePicture = req.file.path;
    await purchase.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePicture: purchase.profilePicture
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile upload failed', error: err.message });
  }
};


const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const imageUrl = user.profileImage;
    if (!imageUrl) return res.status(404).json({ message: 'No profile image found' });

    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`profiles/${publicId}`);

    await User.findByIdAndUpdate(req.user.id, { $unset: { profileImage: 1 } });

    res.json({ message: 'Profile image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

const uploadBikeImages = async (req, res) => {
  try {
    const { bikeId } = req.params;

    const purchase = await Purchase.findById(bikeId);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No bike images uploaded' });
    }


    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: `bikes/${bikeId}`,
      })
    );

    const uploadedResults = await Promise.all(uploadPromises);
    const newUrls = uploadedResults.map(upload => upload.secure_url);


    const existingImages = purchase.bikeImages || [];
    const combinedImages = [...existingImages, ...newUrls];

    if (combinedImages.length > 5) {
      return res.status(400).json({
        message: `Cannot have more than 5 bike images. You already have ${existingImages.length}, trying to add ${newUrls.length} would exceed the limit.`,
      });
    }

    purchase.bikeImages = combinedImages;
    const updated = await purchase.save();

    res.json({
      message: 'Bike images uploaded successfully',
      uploadedUrls: newUrls,
      purchase: updated,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


const deleteBikeImage = async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { imageUrl } = req.body; 

    if (!imageUrl) {
      return res.status(400).json({ message: 'No image URL provided' });
    }

    const purchase = await Purchase.findById(bikeId);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }


    if (!purchase.bikeImages.includes(imageUrl)) {
      return res.status(404).json({ message: 'Image URL not found in bike images' });
    }
    const parts = imageUrl.split('/');
    const folderIndex = parts.findIndex(part => part === 'bikes');
    if (folderIndex === -1 || parts.length <= folderIndex + 2) {
      return res.status(400).json({ message: 'Invalid image URL format' });
    }
    const publicIdParts = parts.slice(folderIndex).join('/').split('.')[0]; 

    await cloudinary.uploader.destroy(publicIdParts);
    purchase.bikeImages = purchase.bikeImages.filter(url => url !== imageUrl);
    const updated = await purchase.save();

    res.json({ message: 'Bike image deleted', updated });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

module.exports = {
  uploadProfileImage,
  deleteProfileImage,
  uploadBikeImages,
  deleteBikeImage,
};
