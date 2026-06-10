const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost', // Docker will use process.env.DB_HOST to find the database!
    database: process.env.DB_NAME || 'traffic_monitor',
    password: process.env.DB_PASSWORD || '1234', 
    port: process.env.DB_PORT || 5432,
});

module.exports = pool;