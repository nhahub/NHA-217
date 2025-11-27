require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const { uploadFileFromDisk } = require('./gridfs');
const ImageMapping = require('../models/ImageMapping');
const Product = require('../models/Product');

/**
 * Migration script to move existing disk images to GridFS
 * Usage: node backend/utils/migrateImages.js
 */
const migrateImages = async () => {
  try {
    console.log('Starting image migration to GridFS...');
    
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    const uploadsDir = path.join(__dirname, '../uploads/products');
    
    // Check if directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log('Uploads directory does not exist. Nothing to migrate.');
      process.exit(0);
    }

    // Read all files from uploads directory
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('No image files found to migrate.');
      process.exit(0);
    }

    console.log(`Found ${imageFiles.length} image files to migrate.`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    // Process each file
    for (const filename of imageFiles) {
      try {
        // Check if already migrated
        const existingMapping = await ImageMapping.findOne({ filename });
        if (existingMapping) {
          console.log(`Skipping ${filename} - already migrated`);
          skipped++;
          continue;
        }

        const filePath = path.join(uploadsDir, filename);
        
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

        // Upload to GridFS
        console.log(`Migrating ${filename}...`);
        const fileId = await uploadFileFromDisk(filePath, filename, contentType, {
          migrated: true,
          migratedAt: new Date()
        });

        // Create mapping
        await ImageMapping.create({
          filename: filename,
          gridfsFileId: fileId,
          originalPath: `/uploads/products/${filename}`
        });

        console.log(`✓ Migrated ${filename} (GridFS ID: ${fileId})`);
        migrated++;

      } catch (error) {
        console.error(`✗ Error migrating ${filename}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total files: ${imageFiles.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already migrated): ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('\nMigration completed!');

    // Optionally, we can verify that products can still access their images
    console.log('\nVerifying product image references...');
    const products = await Product.find({ 'images.url': { $exists: true } });
    console.log(`Found ${products.length} products with image references.`);
    console.log('All images should now be served from GridFS while maintaining backward compatibility.');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateImages();
}

module.exports = migrateImages;


