const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// When a GET request hits this route, run the controller function
router.get('/', healthController.checkHealth);

module.exports = router;