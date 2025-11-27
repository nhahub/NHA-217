const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAdminOrder
} = require('../controllers/adminController');
const {
  getAllSpecialOrders,
  getSpecialOrder,
  updateSpecialOrderStatus,
  deleteSpecialOrder
} = require('../controllers/specialOrderController');
const { protect, adminOnly } = require('../middleware/auth');
const { mongoIdValidation, validate } = require('../middleware/validator');

// All routes require authentication and admin privileges
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/status', mongoIdValidation, validate, updateUserStatus);
router.delete('/users/:id', mongoIdValidation, validate, deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/:id', mongoIdValidation, validate, getAdminOrder);
router.put('/orders/:id/status', mongoIdValidation, validate, updateOrderStatus);

// Special Order management
router.get('/special-orders', getAllSpecialOrders);
router.get('/special-orders/:id', mongoIdValidation, validate, getSpecialOrder);
router.put('/special-orders/:id/status', mongoIdValidation, validate, updateSpecialOrderStatus);
router.delete('/special-orders/:id', mongoIdValidation, validate, deleteSpecialOrder);

module.exports = router;
