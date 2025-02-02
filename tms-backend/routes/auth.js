const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  authController.login
);

router.post(
  '/signup',
  [
    body('name').trim().not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  authController.signup
);

module.exports = router;