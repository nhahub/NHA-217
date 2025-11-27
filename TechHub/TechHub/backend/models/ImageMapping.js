const mongoose = require('mongoose');

/**
 * Image Mapping Schema
 * Maps old filename paths to GridFS file IDs for backward compatibility
 */
const imageMappingSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  gridfsFileId: {
    type: String,
    required: true,
    index: true
  },
  originalPath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ImageMapping', imageMappingSchema);


