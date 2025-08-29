# Real-Time Contest System

This system allows admins and TPOs to create contests that are immediately visible to students in real-time.

## Features

- **Real-time Contest Creation**: Admins/TPOs can create contests with coding problems and MCQ questions
- **Department-based Contest Distribution**: Contests are automatically filtered by student department
- **Live Updates**: Contests are updated every 30 seconds on the student dashboard
- **Contest Participation**: Students can join contests and see real-time participant counts
- **Bulk Question Import**: Support for importing MCQ questions from text, Word, and PDF files

## Setup Instructions

### 1. Database Setup

First, run the database setup script to create the necessary tables:

```bash
cd backend
node setup_database.js
```

This will create:
- `contests` table - stores contest information
- `contest_problems` table - stores contest problems and questions
- `contest_participants` table - tracks student participation

### 2. Backend Server

The backend server now includes new API endpoints:

- `POST /api/contests` - Create a new contest
- `GET /api/contests` - Get all contests
- `GET /api/contests/department/:department` - Get contests by department
- `GET /api/contests/:id` - Get contest details with problems
- `POST /api/contests/:id/join` - Join a contest
- `PUT /api/contests/:id/status` - Update contest status

### 3. Frontend Updates

The frontend has been updated with:

- **CreateContest Component**: Enhanced with database integration and department selection
- **StudentDashboard**: Real-time contest fetching and display
- **ContestCard**: Updated to work with database structure

## How It Works

### Contest Creation Flow

1. **Admin/TPO creates contest**:
   - Fills in contest details (title, description, department, dates, etc.)
   - Adds problems (coding or MCQ)
   - Optionally imports bulk MCQ questions from files
   - Submits to create contest

2. **Contest is saved to database**:
   - Contest details stored in `contests` table
   - Problems stored in `contest_problems` table
   - JSON fields used for MCQ options and test cases

3. **Students see contests in real-time**:
   - Contests are fetched from database based on student's department
   - Updates every 30 seconds via polling
   - Students can join contests immediately

### Real-Time Updates

- **Polling**: Student dashboard polls the server every 30 seconds
- **Immediate Updates**: When students join contests, participant counts update immediately
- **Status Changes**: Contest status (upcoming → ongoing → completed) can be updated via API

## File Structure

```
backend/
├── create_contests_table.sql    # Database schema
├── setup_database.js            # Database setup script
├── server.js                    # Enhanced with contest APIs
└── ...

frontend/src/components/
├── CreateContest.jsx            # Enhanced contest creation
├── StudentDashboard.jsx         # Real-time contest display
├── ContestCard.jsx              # Updated contest display
└── ...
```

## Usage Examples

### Creating a Contest

1. Navigate to the Create Contest page
2. Fill in contest details:
   - Title: "CSE Programming Challenge 2024"
   - Department: "CSE"
   - Start/End dates
   - Difficulty level
3. Add problems manually or import from file
4. Submit to create contest

### Student Joining Contest

1. Students see contests on their dashboard
2. Click "Join Contest" button
3. Contest participant count updates immediately
4. Student is added to contest participants

### Real-Time Monitoring

- Contest creators can monitor participant counts
- Students see live updates of contest status
- Department admins can track contest participation

## Technical Details

### Database Schema

- **contests**: Main contest information with timestamps
- **contest_problems**: Problems linked to contests with JSON fields for flexible data
- **contest_participants**: Many-to-many relationship between contests and students

### API Design

- RESTful endpoints for CRUD operations
- JSON responses with consistent error handling
- Foreign key constraints for data integrity

### Frontend Architecture

- React hooks for state management
- useEffect for real-time updates
- Error handling and user feedback
- Responsive design for all screen sizes

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check MySQL service is running
   - Verify database credentials in `config.js`

2. **Contests Not Showing**:
   - Ensure database tables are created
   - Check student department matches contest department
   - Verify API endpoints are working

3. **Real-time Updates Not Working**:
   - Check browser console for errors
   - Verify polling interval (30 seconds)
   - Ensure backend server is running

### Debug Mode

Enable debug logging by checking browser console and backend server logs for detailed error information.

## Future Enhancements

- WebSocket support for instant updates
- Contest timer and auto-status updates
- Real-time leaderboards
- Contest result analytics
- Email notifications for contest updates

## Support

For issues or questions, check the console logs and ensure all setup steps are completed correctly.
