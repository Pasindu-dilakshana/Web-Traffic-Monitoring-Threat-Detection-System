const express = require('express');
const cors = require('cors');
const trafficLogger = require('./middleware/trafficLogger');

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(trafficLogger);

// Import Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/adminRoutes');

// Use Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);

module.exports = app;