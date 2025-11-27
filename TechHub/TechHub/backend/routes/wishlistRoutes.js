const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  syncWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');
const {
  wishlistItemValidation,
  wishlistSyncValidation,
  mongoIdValidation,
  validate,
} = require('../middleware/validator');

router.use(protect);

router
  .route('/')
  .get(getWishlist)
  .post(wishlistItemValidation, validate, addToWishlist);

router.post('/sync', wishlistSyncValidation, validate, syncWishlist);

router.delete('/:id', mongoIdValidation, validate, removeFromWishlist);

module.exports = router;


