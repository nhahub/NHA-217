const multer = require('multer');
const path = require('path');
const { uploadFile } = require('./gridfs');

// Memory storage - we'll upload directly to GridFS
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

/**
 * Upload file buffer to GridFS
 * @param {Buffer} buffer - File buffer
 * @param {string} originalname - Original filename
 * @param {string} mimetype - MIME type
 * @returns {Promise<string>} GridFS file ID
 */
const uploadToGridFS = async (buffer, originalname, mimetype) => {
  try {
    // Create unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(originalname);
    const filename = uniqueSuffix + ext;
    
    const fileId = await uploadFile(buffer, filename, mimetype, {
      originalName: originalname
    });
    
    return {
      fileId,
      filename,
      originalname
    };
  } catch (error) {
    throw new Error(`Failed to upload to GridFS: ${error.message}`);
  }
};

module.exports = {
  upload,
  uploadToGridFS
};
