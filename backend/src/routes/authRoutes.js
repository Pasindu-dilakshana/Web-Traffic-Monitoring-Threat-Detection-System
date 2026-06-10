const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST request to /api/auth/register
router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

module.exports = router;