const mongoose = require('mongoose');

const productEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1
  },
  targetPrice: Number,
  referenceUrl: String
}, { _id: false });

const specialOrderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  products: {
    type: [productEntrySchema],
    validate: [array => array.length > 0, 'At least one product is required']
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Generate unique order number before saving
specialOrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Special order created'
    });
  }
  next();
});

// Index for faster queries
specialOrderSchema.index({ status: 1, createdAt: -1 });
specialOrderSchema.index({ phone: 1 });
specialOrderSchema.index({ email: 1 });

module.exports = mongoose.model('SpecialOrder', specialOrderSchema);




