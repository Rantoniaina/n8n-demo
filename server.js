const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Status file path
const STATUS_FILE = path.join(__dirname, 'status.json');

// Error descriptions with IT sections
const ERROR_DESCRIPTIONS = [
    {
        id: 'database_connection',
        description: 'Database connection timeout - Unable to establish connection to primary database',
        severity: 'high',
        itSection: 'DevOps',
        resolution: 'Check database server status and network connectivity'
    },
    {
        id: 'memory_leak',
        description: 'Memory leak detected - Application memory usage exceeding 90% threshold',
        severity: 'critical',
        itSection: 'Developer',
        resolution: 'Review application code for memory leaks and restart service'
    },
    {
        id: 'api_rate_limit',
        description: 'API rate limit exceeded - Too many requests from external service',
        severity: 'medium',
        itSection: 'DevOps',
        resolution: 'Implement rate limiting and contact external service provider'
    },
    {
        id: 'disk_space',
        description: 'Disk space critical - Available storage below 5% on production server',
        severity: 'critical',
        itSection: 'DevOps',
        resolution: 'Clean up temporary files and expand storage capacity'
    },
    {
        id: 'ssl_certificate',
        description: 'SSL certificate expired - HTTPS connections failing due to expired certificate',
        severity: 'high',
        itSection: 'DevOps',
        resolution: 'Renew SSL certificate and update server configuration'
    }
];

// Initialize status file if it doesn't exist
const initializeStatus = () => {
    if (!fs.existsSync(STATUS_FILE)) {
        const initialStatus = {
            status: 'ok',
            lastUpdated: new Date().toISOString(),
            errorCount: 0,
            lastError: null
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
        return { status: 'ok', lastUpdated: new Date().toISOString(), errorCount: 0, lastError: null };
    }
};

// Get random error description
const getRandomError = () => {
    const randomIndex = Math.floor(Math.random() * ERROR_DESCRIPTIONS.length);
    return ERROR_DESCRIPTIONS[randomIndex];
};

// Update status
const updateStatus = (newStatus, errorDetails = null) => {
    const currentStatus = getStatus();
    const updatedStatus = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        errorCount: newStatus === 'fail' ? currentStatus.errorCount + 1 : currentStatus.errorCount,
        lastError: newStatus === 'fail' ? errorDetails : null
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

    const response = {
        status: currentStatus.status,
        message: currentStatus.status === 'ok' ? 'Server is running properly' : 'Server is in error state',
        lastUpdated: currentStatus.lastUpdated,
        errorCount: currentStatus.errorCount,
        timestamp: new Date().toISOString()
    };

    // Include error details if system is in error state
    if (currentStatus.status === 'fail' && currentStatus.lastError) {
        response.errorDetails = currentStatus.lastError;
    }

    res.status(httpStatus).json(response);
});

// Error endpoint - sets status to fail
app.get('/api/error', (req, res) => {
    const randomError = getRandomError();
    const updatedStatus = updateStatus('fail', randomError);

    res.status(500).json({
        status: 'error',
        message: 'Status set to fail - Server is now in error state',
        systemStatus: updatedStatus.status,
        errorCount: updatedStatus.errorCount,
        lastUpdated: updatedStatus.lastUpdated,
        timestamp: new Date().toISOString(),
        errorDetails: {
            id: randomError.id,
            description: randomError.description,
            severity: randomError.severity,
            itSection: randomError.itSection,
            resolution: randomError.resolution,
            reportedAt: new Date().toISOString()
        }
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
        timestamp: new Date().toISOString(),
        previousError: updatedStatus.lastError ? 'Error cleared successfully' : 'No previous error to clear'
    });
});

// Root endpoint with API information
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Simple Node.js Backend API with Enhanced Error Management',
        endpoints: {
            health: 'GET /api/health - Returns current system status (200 OK or 500 Error)',
            error: 'GET /api/error - Sets system status to fail with random error details and returns 500',
            restart: 'POST /restart - Resets system status to ok and returns 200'
        },
        currentStatus: getStatus(),
        availableErrors: ERROR_DESCRIPTIONS.map(err => ({
            id: err.id,
            description: err.description,
            severity: err.severity,
            itSection: err.itSection
        }))
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /api/health - Returns current system status (200 OK or 500 Error)`);
    console.log(`  GET /api/error - Sets system status to fail with random error details and returns 500`);
    console.log(`  POST /restart - Resets system status to ok and returns 200`);
    console.log(`Status file: ${STATUS_FILE}`);
    console.log(`Available error types: ${ERROR_DESCRIPTIONS.length}`);
    console.log(`Error types: ${ERROR_DESCRIPTIONS.map(e => e.id).join(', ')}`);
});

module.exports = app;
