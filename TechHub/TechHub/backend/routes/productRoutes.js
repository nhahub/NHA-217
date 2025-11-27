const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getCategories,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const {
  productValidation,
  mongoIdValidation,
  validate
} = require('../middleware/validator');

// Public routes
router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/featured/list', getFeaturedProducts);
router.get('/:id', mongoIdValidation, validate, getProduct);

// Protected routes (Admin only)
router.post('/', protect, adminOnly, productValidation, validate, createProduct);
router.put('/:id', protect, adminOnly, mongoIdValidation, validate, updateProduct);
router.delete('/:id', protect, adminOnly, mongoIdValidation, validate, deleteProduct);

module.exports = router;
