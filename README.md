# n8n-demo Backend

A simple Node.js backend server built with Express.js that provides two API endpoints for testing purposes - one that returns a successful response (200) and another that returns an error response (500).

## 🚀 Features

- **Health Check Endpoint**: Returns 200 OK status
- **Error Simulation Endpoint**: Returns 500 Internal Server Error
- **Simple & Lightweight**: Minimal dependencies
- **JSON Responses**: Structured API responses with timestamps

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

### Health Check (Success Response)

- **URL**: `GET /api/health`
- **Status**: 200 OK
- **Description**: Returns a successful response indicating the server is running properly

**Example Response:**

```json
{
  "status": "success",
  "message": "Server is running properly",
  "timestamp": "2025-10-27T15:26:45.064Z"
}
```

### Error Simulation (Error Response)

- **URL**: `GET /api/error`
- **Status**: 500 Internal Server Error
- **Description**: Returns an intentional error response for testing error handling

**Example Response:**

```json
{
  "status": "error",
  "message": "Internal Server Error - This is intentional",
  "error": "Simulated server error for testing purposes",
  "timestamp": "2025-10-27T15:26:51.302Z"
}
```

### API Information

- **URL**: `GET /`
- **Status**: 200 OK
- **Description**: Returns information about available endpoints

## 🧪 Testing

Test the endpoints using curl:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test error endpoint
curl http://localhost:3000/api/error

# Test root endpoint
curl http://localhost:3000/
```

## 📁 Project Structure

```
n8n-demo/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── package-lock.json  # Lock file for dependencies
├── .gitignore        # Git ignore file
└── README.md         # This file
```

## 🔧 Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 node server.js
```

## 📦 Dependencies

- **express**: ^4.18.2 - Web framework for Node.js

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
