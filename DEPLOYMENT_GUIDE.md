# Real-Time Contest System - Deployment Guide

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

## Step-by-Step Deployment

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd coding_platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create database tables
node setup_database.js

# Test the system
node test_contests.js

# Start the server
npm start
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Database Configuration

Ensure your MySQL database is running and update `backend/config.js` with your credentials:

```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'coding_platform'
});
```

### 5. Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=coding_platform
PORT=5000
```

## Verification Steps

1. **Backend Health Check**:
   - Visit `http://localhost:5000/api/contests`
   - Should return an empty array `[]` (no contests yet)

2. **Database Tables**:
   - Check MySQL for `contests`, `contest_problems`, `contest_participants` tables

3. **Frontend Access**:
   - Visit `http://localhost:5173` (or your Vite port)
   - Navigate to Create Contest page
   - Create a test contest

4. **Student Dashboard**:
   - Login as a student
   - Check if contests appear in real-time

## Production Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name "contest-backend"

# Start frontend with PM2
cd frontend
pm2 start npm --name "contest-frontend" -- run build
pm2 serve dist 3000 --name "contest-frontend-serve"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: coding_platform
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: your_password
      DB_NAME: coding_platform

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

## Monitoring and Maintenance

### Logs

```bash
# Backend logs
pm2 logs contest-backend

# Frontend logs
pm2 logs contest-frontend
```

### Database Backup

```bash
# Create backup
mysqldump -u root -p coding_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u root -p coding_platform < backup_file.sql
```

### Performance Monitoring

- Monitor MySQL query performance
- Check API response times
- Monitor memory usage
- Set up alerts for high CPU/memory usage

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   lsof -i :5000
   kill -9 <PID>
   ```

2. **Database Connection Failed**:
   - Check MySQL service status
   - Verify credentials
   - Check firewall settings

3. **Frontend Build Errors**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Health Check Endpoints

- `GET /api/contests` - List all contests
- `GET /api/students` - List all students
- `GET /health` - Backend health status

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Database Access**: Use strong passwords and limit access
3. **API Rate Limiting**: Implement rate limiting for production
4. **HTTPS**: Use SSL certificates in production
5. **Input Validation**: Validate all user inputs

## Scaling Considerations

1. **Load Balancer**: For multiple backend instances
2. **Database Replication**: For read-heavy workloads
3. **Caching**: Redis for frequently accessed data
4. **CDN**: For static frontend assets

## Support

For deployment issues:
1. Check logs for error messages
2. Verify all prerequisites are met
3. Test with the provided test scripts
4. Check network connectivity and firewall settings
