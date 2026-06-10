require('dotenv').config(); // Loads the .env file

// Import the database connection so it runs and tests the connection
require('./config/db'); 

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🩺 Health check available at http://localhost:${PORT}/api/health`);
});