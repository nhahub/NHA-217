const { getFileStream, findFileByFilename } = require('../utils/gridfs');
const ImageMapping = require('../models/ImageMapping');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Serve image from GridFS or disk (backward compatibility)
 * @route   GET /uploads/products/:filename
 * @access  Public
 */
exports.serveImage = async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    // Try to find mapping in database
    const mapping = await ImageMapping.findOne({ filename });

    if (mapping) {
      // File is in GridFS
      try {
        const { stream, contentType } = await getFileStream(mapping.gridfsFileId);
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        
        stream.pipe(res);
      } catch (error) {
        console.error(`GridFS file not found for ID ${mapping.gridfsFileId}:`, error.message);
        // If GridFS file not found, try disk fallback
        return tryDiskFallback(req, res, filename);
      }
    } else {
      // No mapping found, try disk fallback for backward compatibility
      return tryDiskFallback(req, res, filename);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Try to serve image from disk (backward compatibility)
 */
const tryDiskFallback = (req, res, filename) => {
  try {
    const filePath = path.join(__dirname, '../uploads/products', filename);
    
    // Check if file exists on disk
    if (fs.existsSync(filePath)) {
      // Determine content type
      const ext = path.extname(filename).toLowerCase();
      const contentTypeMap = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      
      const contentType = contentTypeMap[ext] || 'application/octet-stream';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      return res.sendFile(path.resolve(filePath));
    }
    
    // File not found
    return res.status(404).json({
      success: false,
      message: `Image not found: ${filename}`,
      filename: filename
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error serving image'
    });
  }
};

