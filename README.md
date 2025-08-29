# Coding Platform

A coding platform with separated frontend and backend architecture.

## Project Structure

```
coding_platform/
├── backend/          # Backend server (Express.js + MySQL)
│   ├── server.js
│   ├── package.json
│   └── ... (other backend files)
├── frontend/         # Frontend application (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ... (other frontend files)
└── package.json      # Root package.json for managing both
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL database

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Production

Build the frontend:
```bash
npm run build
```

Start the backend:
```bash
npm run start:backend
```

## Backend

The backend is built with:
- Express.js
- MySQL2
- bcryptjs for password hashing
- CORS for cross-origin requests

## Frontend

The frontend is built with:
- React
- Vite
- Modern ES6+ features

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/department-login` - Department login
