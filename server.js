const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint - returns 200 OK
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running properly',
        timestamp: new Date().toISOString()
    });
});

// Error endpoint - returns 500 Internal Server Error
app.get('/api/error', (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error - This is intentional',
        error: 'Simulated server error for testing purposes',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint with API information
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Simple Node.js Backend API',
        endpoints: {
            health: 'GET /api/health - Returns 200 OK',
            error: 'GET /api/error - Returns 500 Internal Server Error'
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /api/health - Returns 200 OK`);
    console.log(`  GET /api/error - Returns 500 Internal Server Error`);
});

module.exports = app;
