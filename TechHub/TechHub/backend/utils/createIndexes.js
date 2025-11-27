const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

/**
 * Utility script to create database indexes
 * Run with: node utils/createIndexes.js
 */
const createIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create text index for product search
    try {
      await Product.collection.createIndex(
        { name: 'text', description: 'text', tags: 'text' },
        { name: 'product_text_search' }
      );
      console.log('✓ Text search index created for products');
    } catch (error) {
      if (error.code === 85) {
        console.log('✓ Text search index already exists');
      } else {
        console.error('Error creating text index:', error.message);
      }
    }

    // Create other indexes if needed
    await Product.collection.createIndex({ category: 1, price: 1 });
    await Product.collection.createIndex({ isActive: 1, isFeatured: 1 });
    console.log('✓ Product indexes created');

    console.log('All indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();


