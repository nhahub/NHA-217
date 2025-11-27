const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const {
  cartItemValidation,
  mongoIdValidation,
  validate
} = require('../middleware/validator');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', cartItemValidation, validate, addToCart);
router.put('/items/:productId', mongoIdValidation, validate, updateCartItem);
router.delete('/items/:productId', mongoIdValidation, validate, removeFromCart);

module.exports = router;
