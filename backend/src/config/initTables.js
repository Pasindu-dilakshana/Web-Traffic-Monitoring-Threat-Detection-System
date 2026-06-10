// Add this line at the very top to load the .env file!
require('dotenv').config({ path: __dirname + '/../../.env' });

const pool = require('./db');

const createTables = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS traffic_logs (
            id SERIAL PRIMARY KEY,
            ip_address VARCHAR(50),
            method VARCHAR(10),
            url TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id SERIAL PRIMARY KEY,
            ip_address VARCHAR(50),
            threat_type VARCHAR(100),
            severity VARCHAR(20),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        console.log('⏳ Creating tables...');
        await pool.query(queryText);
        console.log('✅ All tables created successfully!');
    } catch (error) {
        console.error('❌ Error creating tables:', error.stack);
    } finally {
        pool.end(); 
    }
};

createTables();