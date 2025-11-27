const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;
