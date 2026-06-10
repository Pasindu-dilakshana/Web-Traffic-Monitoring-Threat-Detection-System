const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

// === REGISTER NEW USER ===
exports.registerUser = async (req, res) => {
    // ... (Keep your existing register code here exactly as it is) ...
    try {
        const { username, password, role } = req.body;
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists!' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, hashedPassword, role || 'user']
        );
        res.status(201).json({
            message: 'User registered successfully!',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find the user in the database
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password!' });
        }
        const user = result.rows[0];

        // 2. Check if the password matches the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password!' });
        }

        // 3. Create the JWT Token (The Digital ID Card)
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET, // Signs it with our secret key
            { expiresIn: '1h' }     // Token expires in 1 hour for security
        );

        // 4. Send the token back to the user
        res.status(200).json({
            message: 'Login successful!',
            token: token
        });

    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};