# n8n-demo Backend

A simple Node.js backend server built with Express.js that provides enhanced error management and status monitoring capabilities. The system includes random error generation with detailed descriptions, IT section assignments, and persistent status tracking for testing error handling workflows.

## 🚀 Features

- **Health Check Endpoint**: Returns current system status (200 OK or 500 Error)
- **Random Error Simulation**: Generates realistic error scenarios with detailed information
- **IT Section Assignment**: Automatically assigns errors to appropriate IT teams (DevOps, Developer)
- **Persistent Status Storage**: Maintains system state across server restarts
- **Error Recovery**: Built-in restart mechanism to clear error states
- **Comprehensive Error Details**: Includes severity levels, descriptions, and resolution steps
- **JSON Responses**: Structured API responses with timestamps and metadata

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd n8n-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Running the Server

Start the server:

```bash
npm start
# or
node server.js
```

The server will start on `http://localhost:3000` by default.

## 📡 API Endpoints

### Health Check (Dynamic Status Response)

- **URL**: `GET /api/health`
- **Status**: 200 OK (if healthy) or 500 Error (if in error state)
- **Description**: Returns current system status with error details if applicable

**Example Response (Healthy):**

```json
{
  "status": "ok",
  "message": "Server is running properly",
  "lastUpdated": "2025-10-27T15:57:58.198Z",
  "errorCount": 0,
  "timestamp": "2025-10-27T16:01:09.531Z"
}
```

**Example Response (Error State):**

```json
{
  "status": "fail",
  "message": "Server is in error state",
  "lastUpdated": "2025-10-27T16:01:07.030Z",
  "errorCount": 2,
  "timestamp": "2025-10-27T16:01:09.531Z",
  "errorDetails": {
    "id": "ssl_certificate",
    "description": "SSL certificate expired - HTTPS connections failing due to expired certificate",
    "severity": "high",
    "itSection": "DevOps",
    "resolution": "Renew SSL certificate and update server configuration"
  }
}
```

### Error Simulation (Random Error Generation)

- **URL**: `GET /api/error`
- **Status**: 500 Internal Server Error
- **Description**: Randomly generates one of 5 predefined error scenarios and sets system status to fail

**Example Response:**

```json
{
  "status": "error",
  "message": "Status set to fail - Server is now in error state",
  "systemStatus": "fail",
  "errorCount": 3,
  "lastUpdated": "2025-10-27T16:01:07.030Z",
  "timestamp": "2025-10-27T16:01:07.031Z",
  "errorDetails": {
    "id": "memory_leak",
    "description": "Memory leak detected - Application memory usage exceeding 90% threshold",
    "severity": "critical",
    "itSection": "Developer",
    "resolution": "Review application code for memory leaks and restart service",
    "reportedAt": "2025-10-27T16:01:07.031Z"
  }
}
```

### System Restart (Error Recovery)

- **URL**: `POST /restart`
- **Status**: 200 OK
- **Description**: Resets system status to healthy and clears error state

**Example Response:**

```json
{
  "status": "success",
  "message": "Status reset to ok - Server is now healthy",
  "systemStatus": "ok",
  "errorCount": 3,
  "lastUpdated": "2025-10-27T16:01:16.840Z",
  "timestamp": "2025-10-27T16:01:16.841Z",
  "previousError": "Error cleared successfully"
}
```

### API Information

- **URL**: `GET /`
- **Status**: 200 OK
- **Description**: Returns comprehensive information about available endpoints and current system status

## 🎲 Available Error Types

The system includes 5 predefined error scenarios that are randomly selected:

### 1. Database Connection (`database_connection`)

- **Severity**: High
- **IT Section**: DevOps
- **Description**: Database connection timeout - Unable to establish connection to primary database
- **Resolution**: Check database server status and network connectivity

### 2. Memory Leak (`memory_leak`)

- **Severity**: Critical
- **IT Section**: Developer
- **Description**: Memory leak detected - Application memory usage exceeding 90% threshold
- **Resolution**: Review application code for memory leaks and restart service

### 3. API Rate Limit (`api_rate_limit`)

- **Severity**: Medium
- **IT Section**: DevOps
- **Description**: API rate limit exceeded - Too many requests from external service
- **Resolution**: Implement rate limiting and contact external service provider

### 4. Disk Space (`disk_space`)

- **Severity**: Critical
- **IT Section**: DevOps
- **Description**: Disk space critical - Available storage below 5% on production server
- **Resolution**: Clean up temporary files and expand storage capacity

### 5. SSL Certificate (`ssl_certificate`)

- **Severity**: High
- **IT Section**: DevOps
- **Description**: SSL certificate expired - HTTPS connections failing due to expired certificate
- **Resolution**: Renew SSL certificate and update server configuration

## 🧪 Testing

Test the endpoints using curl:

```bash
# Test health endpoint (initial state)
curl http://localhost:3000/api/health

# Trigger random error
curl http://localhost:3000/api/error

# Check health with error details
curl http://localhost:3000/api/health

# Reset system to healthy state
curl -X POST http://localhost:3000/restart

# Test multiple error generations
for i in {1..3}; do
  echo "=== Error Call $i ==="
  curl -s http://localhost:3000/api/error | jq '.errorDetails | {id, description, severity, itSection}'
  echo
done

# View all available error types
curl http://localhost:3000/ | jq '.availableErrors'
```

## 📁 Project Structure

```
n8n-demo/
├── server.js          # Main server file with enhanced error management
├── package.json       # Dependencies and scripts
├── package-lock.json  # Lock file for dependencies
├── status.json        # Persistent status storage (auto-generated)
├── .gitignore        # Git ignore file
└── README.md         # This file
```

## 🔧 Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 node server.js
```

## 📊 Status Management

The system maintains persistent status in `status.json`:

```json
{
  "status": "fail",
  "lastUpdated": "2025-10-27T16:01:19.569Z",
  "errorCount": 5,
  "lastError": {
    "id": "api_rate_limit",
    "description": "API rate limit exceeded - Too many requests from external service",
    "severity": "medium",
    "itSection": "DevOps",
    "resolution": "Implement rate limiting and contact external service provider"
  }
}
```

## 📦 Dependencies

- **express**: ^4.18.2 - Web framework for Node.js

## 🎯 Use Cases

This backend is perfect for:

- **Testing Error Handling**: Simulate various error scenarios for testing monitoring systems
- **IT Team Training**: Practice incident response with realistic error descriptions
- **Workflow Testing**: Test error detection and recovery processes
- **Monitoring System Validation**: Verify alert systems respond correctly to different error types
- **Development Testing**: Test application resilience to various failure modes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Issues

If you encounter any issues, please create an issue in the repository or contact the maintainer.
