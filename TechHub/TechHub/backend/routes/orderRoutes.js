const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const {
  orderValidation,
  mongoIdValidation,
  validate
} = require('../middleware/validator');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getUserOrders)
  .post(orderValidation, validate, createOrder);

router.get('/:id', mongoIdValidation, validate, getOrder);
router.put('/:id/cancel', mongoIdValidation, validate, cancelOrder);

module.exports = router;
