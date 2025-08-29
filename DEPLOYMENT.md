# Deployment Guide

## Development Environment

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coding_platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure database**
   - Make sure MySQL is running
   - Create database: `coding_platform`
   - Update database credentials in `backend/config.js` if needed

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run dev:backend    # Backend on http://localhost:5000
   npm run dev:frontend   # Frontend on http://localhost:5173
   ```

## Production Deployment

### Backend Deployment

1. **Build the backend**
   ```bash
   cd backend
   npm install --production
   ```

2. **Configure environment**
   - Update `backend/config.js` with production database credentials
   - Set up environment variables for sensitive data

3. **Start the backend**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the built files**
   - The built files will be in `frontend/dist/`
   - Serve them using any static file server (nginx, Apache, etc.)

### Docker Deployment (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=your_password
      - DB_NAME=coding_platform
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=your_password
      - MYSQL_DATABASE=coding_platform
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## Environment Variables

### Backend (.env file)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coding_platform
PORT=5000
JWT_SECRET=your-secret-key
```

### Frontend
The frontend is configured to connect to `http://localhost:5000` for API calls. Update this URL in production to point to your backend server.

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Limit database access
   - Regular backups

2. **API Security**
   - Implement rate limiting
   - Add input validation
   - Use HTTPS in production

3. **Frontend Security**
   - Serve over HTTPS
   - Implement proper CORS policies
   - Sanitize user inputs

## Monitoring

- Set up logging for both frontend and backend
- Monitor database performance
- Set up error tracking (Sentry, etc.)
- Monitor server resources 