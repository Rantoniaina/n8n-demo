const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Status file path
const STATUS_FILE = path.join(__dirname, 'status.json');

// Initialize status file if it doesn't exist
const initializeStatus = () => {
    if (!fs.existsSync(STATUS_FILE)) {
        const initialStatus = {
            status: 'ok',
            lastUpdated: new Date().toISOString(),
            errorCount: 0
        };
        fs.writeFileSync(STATUS_FILE, JSON.stringify(initialStatus, null, 2));
    }
};

// Read current status
const getStatus = () => {
    try {
        const data = fs.readFileSync(STATUS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading status file:', error);
        return { status: 'ok', lastUpdated: new Date().toISOString(), errorCount: 0 };
    }
};

// Update status
const updateStatus = (newStatus) => {
    const currentStatus = getStatus();
    const updatedStatus = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        errorCount: newStatus === 'fail' ? currentStatus.errorCount + 1 : currentStatus.errorCount
    };
    fs.writeFileSync(STATUS_FILE, JSON.stringify(updatedStatus, null, 2));
    return updatedStatus;
};

// Initialize status on startup
initializeStatus();

// Health check endpoint - returns current status
app.get('/api/health', (req, res) => {
    const currentStatus = getStatus();
    const httpStatus = currentStatus.status === 'ok' ? 200 : 500;

    res.status(httpStatus).json({
        status: currentStatus.status,
        message: currentStatus.status === 'ok' ? 'Server is running properly' : 'Server is in error state',
        lastUpdated: currentStatus.lastUpdated,
        errorCount: currentStatus.errorCount,
        timestamp: new Date().toISOString()
    });
});

// Error endpoint - sets status to fail
app.get('/api/error', (req, res) => {
    const updatedStatus = updateStatus('fail');

    res.status(500).json({
        status: 'error',
        message: 'Status set to fail - Server is now in error state',
        systemStatus: updatedStatus.status,
        errorCount: updatedStatus.errorCount,
        lastUpdated: updatedStatus.lastUpdated,
        timestamp: new Date().toISOString()
    });
});

// Restart endpoint - resets status to ok
app.post('/restart', (req, res) => {
    const updatedStatus = updateStatus('ok');

    res.status(200).json({
        status: 'success',
        message: 'Status reset to ok - Server is now healthy',
        systemStatus: updatedStatus.status,
        errorCount: updatedStatus.errorCount,
        lastUpdated: updatedStatus.lastUpdated,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint with API information
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Simple Node.js Backend API with Status Management',
        endpoints: {
            health: 'GET /api/health - Returns current system status (200 OK or 500 Error)',
            error: 'GET /api/error - Sets system status to fail and returns 500',
            restart: 'POST /restart - Resets system status to ok and returns 200'
        },
        currentStatus: getStatus()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /api/health - Returns current system status (200 OK or 500 Error)`);
    console.log(`  GET /api/error - Sets system status to fail and returns 500`);
    console.log(`  POST /restart - Resets system status to ok and returns 200`);
    console.log(`Status file: ${STATUS_FILE}`);
});

module.exports = app;
