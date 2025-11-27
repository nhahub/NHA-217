const express = require('express');
const router = express.Router();
const { createSpecialOrder } = require('../controllers/specialOrderController');
const {
  specialOrderValidation,
  validate
} = require('../middleware/validator');

// Public route
router.post('/', specialOrderValidation, validate, createSpecialOrder);

module.exports = router;




