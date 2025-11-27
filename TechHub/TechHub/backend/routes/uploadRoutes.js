const express = require('express');
const router = express.Router();
const {
  uploadProductImages,
  uploadSingleImage
} = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../utils/upload');

// All routes require authentication and admin privileges
router.use(protect, adminOnly);

// Upload multiple product images
router.post('/product', upload.array('images', 5), uploadProductImages);

// Upload single image
router.post('/single', upload.single('image'), uploadSingleImage);

module.exports = router;
