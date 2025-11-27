const { uploadToGridFS } = require('../utils/upload');
const ImageMapping = require('../models/ImageMapping');

/**
 * @desc    Upload product image(s)
 * @route   POST /api/upload/product
 * @access  Private/Admin
 */
exports.uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Upload all files to GridFS
    const uploadPromises = req.files.map(async (file) => {
      const { fileId, filename } = await uploadToGridFS(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      // Store mapping for backward compatibility
      const imagePath = `/uploads/products/${filename}`;
      await ImageMapping.create({
        filename: filename,
        gridfsFileId: fileId,
        originalPath: imagePath
      });

      // Return URL in the format /uploads/products/{filename}
      return {
        url: imagePath,
        fileId: fileId, // Store GridFS ID for reference
        alt: req.body.alt || 'Product image'
      };
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: imageUrls
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload single image
 * @route   POST /api/upload/single
 * @access  Private/Admin
 */
exports.uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const { fileId, filename } = await uploadToGridFS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const imageUrl = `/uploads/products/${filename}`;

    // Store mapping for backward compatibility
    await ImageMapping.create({
      filename: filename,
      gridfsFileId: fileId,
      originalPath: imageUrl
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        fileId: fileId,
        filename: filename
      }
    });
  } catch (error) {
    next(error);
  }
};
