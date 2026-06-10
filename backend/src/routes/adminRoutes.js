const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // <-- We need this to talk to the database!
const verifyToken = require('../middleware/authMiddleware'); // Our Bouncer

// Existing test route
router.get('/dashboard-test', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Secret Admin Dashboard!',
        adminDetails: req.user 
    });
});

// === NEW ROUTE: Fetch Traffic Logs ===
// Notice we put 'verifyToken' in the middle! Only logged-in admins can pull logs.
router.get('/logs', verifyToken, async (req, res) => {
    try {
        // Ask the database for all logs, ordered by the newest ones first. We limit to 50 so it doesn't crash the browser.
        const result = await pool.query('SELECT * FROM traffic_logs ORDER BY timestamp DESC LIMIT 50');
        
        // Send the rows back to whoever asked for them
        res.status(200).json(result.rows);
        
    } catch (error) {
        console.error('❌ Error fetching logs:', error.message);
        res.status(500).json({ message: 'Server error while fetching logs' });
    }
});

// === FETCH SECURITY ALERTS ===
router.get('/alerts', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 10');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('❌ Error fetching alerts:', error.message);
        res.status(500).json({ message: 'Server error while fetching alerts' });
    }
});

module.exports = router;