const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const fs = require('fs');
const path = require('path');

let gridFSBucket = null;

/**
 * Initialize GridFS bucket
 * @returns {GridFSBucket}
 */
const getGridFSBucket = () => {
  if (!gridFSBucket) {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    gridFSBucket = new GridFSBucket(db, { bucketName: 'productImages' });
  }
  return gridFSBucket;
};

/**
 * Upload file to GridFS
 * @param {Buffer|Stream} fileBuffer - File buffer or stream
 * @param {string} filename - Original filename
 * @param {string} contentType - MIME type
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<string>} GridFS file ID
 */
const uploadFile = async (fileBuffer, filename, contentType, metadata = {}) => {
  try {
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        ...metadata,
        uploadedAt: new Date(),
        originalName: filename
      }
    });

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve(uploadStream.id.toString());
      });

      uploadStream.on('error', (error) => {
        reject(error);
      });

      // Handle both Buffer and Stream
      if (Buffer.isBuffer(fileBuffer)) {
        uploadStream.end(fileBuffer);
      } else {
        fileBuffer.pipe(uploadStream);
      }
    });
  } catch (error) {
    throw new Error(`Failed to upload file to GridFS: ${error.message}`);
  }
};

/**
 * Upload file from disk to GridFS
 * @param {string} filePath - Path to file on disk
 * @param {string} filename - Original filename
 * @param {string} contentType - MIME type
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<string>} GridFS file ID
 */
const uploadFileFromDisk = async (filePath, filename, contentType, metadata = {}) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return await uploadFile(fileBuffer, filename, contentType, metadata);
  } catch (error) {
    throw new Error(`Failed to upload file from disk: ${error.message}`);
  }
};

/**
 * Download file from GridFS
 * @param {string} fileId - GridFS file ID
 * @returns {Promise<Buffer>} File buffer
 */
const downloadFile = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const ObjectId = mongoose.Types.ObjectId;
    
    // Check if fileId is a valid ObjectId
    if (!ObjectId.isValid(fileId)) {
      throw new Error('Invalid file ID');
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    const chunks = [];

    return new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      downloadStream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error(`Failed to download file from GridFS: ${error.message}`);
  }
};

/**
 * Get file stream from GridFS
 * @param {string} fileId - GridFS file ID
 * @returns {Promise<Object>} Stream and metadata
 */
const getFileStream = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const ObjectId = mongoose.Types.ObjectId;
    
    if (!ObjectId.isValid(fileId)) {
      throw new Error('Invalid file ID');
    }

    const fileIdObj = new ObjectId(fileId);
    const downloadStream = bucket.openDownloadStream(fileIdObj);
    
    // Get file metadata
    const files = await bucket.find({ _id: fileIdObj }).toArray();
    const fileInfo = files[0];

    if (!fileInfo) {
      throw new Error('File not found');
    }

    return {
      stream: downloadStream,
      contentType: fileInfo.contentType || 'application/octet-stream',
      filename: fileInfo.filename,
      length: fileInfo.length
    };
  } catch (error) {
    throw new Error(`Failed to get file stream from GridFS: ${error.message}`);
  }
};

/**
 * Find file by filename in GridFS
 * @param {string} filename - Filename to search for
 * @returns {Promise<Object|null>} File document or null
 */
const findFileByFilename = async (filename) => {
  try {
    const bucket = getGridFSBucket();
    const files = await bucket.find({ filename }).sort({ uploadDate: -1 }).limit(1).toArray();
    return files[0] || null;
  } catch (error) {
    throw new Error(`Failed to find file by filename: ${error.message}`);
  }
};

/**
 * Delete file from GridFS
 * @param {string} fileId - GridFS file ID
 * @returns {Promise<void>}
 */
const deleteFile = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const ObjectId = mongoose.Types.ObjectId;
    
    if (!ObjectId.isValid(fileId)) {
      throw new Error('Invalid file ID');
    }

    await bucket.delete(new ObjectId(fileId));
  } catch (error) {
    // If file doesn't exist, that's okay (idempotent)
    if (error.message && error.message.includes('FileNotFound')) {
      return;
    }
    throw new Error(`Failed to delete file from GridFS: ${error.message}`);
  }
};

/**
 * Delete multiple files from GridFS
 * @param {string[]} fileIds - Array of GridFS file IDs
 * @returns {Promise<void>}
 */
const deleteFiles = async (fileIds) => {
  try {
    await Promise.all(fileIds.map(id => deleteFile(id)));
  } catch (error) {
    throw new Error(`Failed to delete files from GridFS: ${error.message}`);
  }
};

/**
 * Extract GridFS file ID from URL path
 * @param {string} urlPath - URL path like /uploads/products/1234567890-filename.jpg
 * @returns {string|null} GridFS file ID or null
 */
const extractFileIdFromPath = (urlPath) => {
  return null;
};

/**
 * Get file info from GridFS
 * @param {string} fileId - GridFS file ID
 * @returns {Promise<Object|null>} File metadata
 */
const getFileInfo = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const ObjectId = mongoose.Types.ObjectId;
    
    if (!ObjectId.isValid(fileId)) {
      return null;
    }

    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
    return files[0] || null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  uploadFile,
  uploadFileFromDisk,
  downloadFile,
  getFileStream,
  findFileByFilename,
  deleteFile,
  deleteFiles,
  extractFileIdFromPath,
  getFileInfo,
  getGridFSBucket
};

