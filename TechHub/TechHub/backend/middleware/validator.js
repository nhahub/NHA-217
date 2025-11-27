const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Validation rules for user login
 */
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for creating/updating products
 */
exports.productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .notEmpty().withMessage('Category is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

/**
 * Validation rules for adding items to cart
 */
exports.cartItemValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

/**
 * Validation rules for creating orders
 */
exports.orderValidation = [
  body('shippingAddress.name')
    .trim()
    .notEmpty().withMessage('Recipient name is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
];

/**
 * Validation for MongoDB ObjectId parameters
 */
exports.mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

/**
 * Validation rules for wishlist operations
 */
exports.wishlistItemValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID')
];

exports.wishlistSyncValidation = [
  body('productIds')
    .optional({ nullable: true })
    .isArray().withMessage('productIds must be an array'),
  body('productIds.*')
    .optional()
    .isMongoId().withMessage('Each product ID must be a valid Mongo ID')
];

/**
 * Validation rules for special order creation
 */
exports.specialOrderValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('products')
    .isArray({ min: 1 }).withMessage('At least one product is required'),
  body('products.*.name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
  body('products.*.quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('products.*.targetPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Target price must be a positive number'),
  body('products.*.referenceUrl')
    .optional()
    .isURL().withMessage('Reference URL must be a valid URL'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
];