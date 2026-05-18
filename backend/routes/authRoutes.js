// routes/authRoutes.js - Authentication routes
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register - Register new user
router.post('/register', registerValidation, register);

// POST /api/auth/login - Login user
router.post('/login', loginValidation, login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', protect, getMe);

module.exports = router;
