import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import CodeExecutor from './codeExecutor.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sakshi@123',
  database: 'coding_platform'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database!');
    // Ensure required schema exists (safe idempotent migrations)
    try {
      db.query(
        'ALTER TABLE students ADD COLUMN IF NOT EXISTS last_solved_date DATE NULL',
        (alterErr) => {
          if (alterErr) {
            console.error('Schema ensure error (last_solved_date):', alterErr);
          } else {
            console.log('Schema ensured: students.last_solved_date');
          }
        }
      );
    } catch (schemaErr) {
      console.error('Schema ensure try/catch error:', schemaErr);
    }
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  console.log('POST /api/register called');
  console.log('Received registration:', req.body); // <--- Add this
  // Use snake_case to match frontend
  const { first_name, middle_name, last_name, email, prn, class: className, branch, password } = req.body;
  if (!first_name || !middle_name || !last_name || !email || !prn || !className || !branch || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO students (first_name, middle_name, last_name, email, prn, class, branch, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, middle_name, last_name, email, prn, className, branch, hashedPassword],
    (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email or PRN already exists.' });
        }
        return res.status(500).json({ error: 'Database error.' });
      }
      console.log('DB Insert Result:', result);
      res.json({ message: 'Registration successful!' });
    }
  );
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  db.query(
    'SELECT * FROM students WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Wrong credentials.' });
      }
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ error: 'Wrong credentials.' });
      }
    }
  );
});

// Department login endpoint
app.post('/api/department-login', (req, res) => {
  const { department, password } = req.body;
  if (!department || !password) {
    return res.status(400).json({ error: 'Department and password are required.' });
  }
  db.query(
    'SELECT * FROM departments WHERE department_name = ?',
    [department],
    async (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Wrong credentials.' });
      }
      const user = results[0];
      // Use plain comparison since your passwords are not hashed
      if (password === user.password) {
        res.json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ error: 'Wrong credentials.' });
      }
    }
  );
});

// TPO login endpoint
app.post('/api/tpo-login', (req, res) => {
  const { tpoUsername, password } = req.body;
  if (!tpoUsername || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  db.query(
    'SELECT * FROM tpo WHERE username = ?',
    [tpoUsername],
    async (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Wrong credentials.' });
      }
      const user = results[0];
      // If your passwords are NOT hashed, use plain comparison:
      if (password === user.password) {
        res.json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ error: 'Wrong credentials.' });
      }
      // If your passwords ARE hashed, use bcrypt.compare
    }
  );
});

// Get all registered students
app.get('/api/students', (req, res) => {
  db.query('SELECT first_name, middle_name, last_name, email, prn, class, branch FROM students', (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    res.json(results);
  });
});

// Get students by branch/department
app.get('/api/students/:branch', (req, res) => {
  const branch = req.params.branch;
  db.query(
    'SELECT first_name, middle_name, last_name, email, prn, class, branch FROM students WHERE branch = ?',
    [branch],
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      res.json(results);
    }
  );
});

// Get individual student by email
app.get('/api/student/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  
  db.query(
    'SELECT first_name, middle_name, last_name, email, prn, class, branch FROM students WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }
      res.json({ student: results[0] });
    }
  );
});

// Update student name
app.put('/api/student/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const { first_name, middle_name, last_name } = req.body;
  
  db.query(
    'UPDATE students SET first_name = ?, middle_name = ?, last_name = ? WHERE email = ?',
    [first_name, middle_name, last_name, email],
    (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }
      res.json({ message: 'Student name updated successfully!' });
    }
  );
});

// Get user stats/progress
app.get('/api/student/:email/stats', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  
  db.query(
    'SELECT problems_solved, total_points, current_streak, global_rank, accuracy, last_solved_date FROM students WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }
      
      const stats = results[0];
      // If stats are null (new user), return default values
      const userStats = {
        totalSolved: stats.problems_solved || 0,
        totalPoints: stats.total_points || 0,
        currentStreak: stats.current_streak || 0,
        rank: stats.global_rank || 999,
        accuracy: stats.accuracy || 0,
        lastSolvedDate: stats.last_solved_date || null
      };
      
      res.json({ stats: userStats });
    }
  );
});

// Update user stats (when they solve problems, etc.)
app.put('/api/student/:email/stats', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const { problems_solved, total_points, current_streak, global_rank, accuracy } = req.body;
  
  db.query(
    'UPDATE students SET problems_solved = ?, total_points = ?, current_streak = ?, global_rank = ?, accuracy = ? WHERE email = ?',
    [problems_solved, total_points, current_streak, global_rank, accuracy, email],
    (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }
      res.json({ message: 'Stats updated successfully!' });
    }
  );
});

// Global leaderboard: top students by total_points, then problems_solved
app.get('/api/leaderboard', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const query = `
    SELECT 
      first_name, last_name, email, class, branch,
      COALESCE(total_points, 0) AS total_points,
      COALESCE(problems_solved, 0) AS problems_solved
    FROM students
    ORDER BY total_points DESC, problems_solved DESC, first_name ASC
    LIMIT ?
  `;

  db.query(query, [limit], (err, results) => {
    if (err) {
      console.error('DB Error fetching leaderboard:', err);
      return res.status(500).json({ error: 'Failed to fetch leaderboard.' });
    }

    const leaderboard = results.map((row, index) => ({
      rank: index + 1,
      name: `${row.first_name} ${row.last_name}`.trim(),
      points: row.total_points,
      solved: row.problems_solved,
      email: row.email,
      class: row.class,
      branch: row.branch
    }));

    res.json(leaderboard);
  });
});

// Contest-related endpoints

// Create a new contest
app.post('/api/contests', (req, res) => {
  const { 
    title, description, department, startDate, endDate, duration, 
    maxParticipants, difficulty, problems, createdBy 
  } = req.body;

  if (!title || !description || !department || !startDate || !endDate || !problems || !createdBy) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Insert contest
  const contestQuery = `
    INSERT INTO contests (title, description, department, start_date, end_date, duration, max_participants, difficulty, created_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(contestQuery, [
    title, description, department, startDate, endDate, duration || 120, 
    maxParticipants || 100, difficulty || 'Medium', createdBy
  ], (err, result) => {
    if (err) {
      console.error('DB Error creating contest:', err);
      return res.status(500).json({ error: 'Failed to create contest.' });
    }

    const contestId = result.insertId;
    
    // Insert problems
    if (problems && problems.length > 0) {
      const problemQueries = problems.map(problem => {
        const mcqOptions = problem.questionType === 'mcq' ? JSON.stringify(problem.mcqOptions) : null;
        const testCases = problem.questionType === 'coding' ? JSON.stringify(problem.testCases) : null;
        
        return new Promise((resolve, reject) => {
          const problemQuery = `
            INSERT INTO contest_problems (contest_id, title, description, question_type, difficulty, points, time_limit, memory_limit, mcq_options, correct_answer, test_cases) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          db.query(problemQuery, [
            contestId, problem.title, problem.description, problem.questionType, 
            problem.difficulty, problem.points, problem.timeLimit, problem.memoryLimit,
            mcqOptions, problem.correctAnswer, testCases
          ], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      });

      Promise.all(problemQueries)
        .then(() => {
          res.json({ 
            message: 'Contest created successfully!', 
            contestId: contestId 
          });
        })
        .catch(err => {
          console.error('Error inserting problems:', err);
          // Delete the contest if problems insertion fails
          db.query('DELETE FROM contests WHERE id = ?', [contestId]);
          res.status(500).json({ error: 'Failed to create contest problems.' });
        });
    } else {
      res.json({ 
        message: 'Contest created successfully!', 
        contestId: contestId 
      });
    }
  });
});

// Get all contests
app.get('/api/contests', (req, res) => {
  const query = `
    SELECT c.*, 
           COUNT(DISTINCT cp.id) as problem_count,
           COUNT(DISTINCT cpart.student_email) as current_participants
    FROM contests c
    LEFT JOIN contest_problems cp ON c.id = cp.contest_id
    LEFT JOIN contest_participants cpart ON c.id = cpart.contest_id
    GROUP BY c.id
    ORDER BY c.start_date DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('DB Error fetching contests:', err);
      return res.status(500).json({ error: 'Failed to fetch contests.' });
    }
    res.json(results);
  });
});

// Get contests by department
app.get('/api/contests/department/:department', (req, res) => {
  const department = req.params.department;
  const query = `
    SELECT c.*, 
           COUNT(DISTINCT cp.id) as problem_count,
           COUNT(DISTINCT cpart.student_email) as current_participants
    FROM contests c
    LEFT JOIN contest_problems cp ON c.id = cp.contest_id
    LEFT JOIN contest_participants cpart ON c.id = cpart.contest_id
    WHERE c.department = ?
    GROUP BY c.id
    ORDER BY c.start_date DESC
  `;
  
  db.query(query, [department], (err, results) => {
    if (err) {
      console.error('DB Error fetching department contests:', err);
      return res.status(500).json({ error: 'Failed to fetch contests.' });
    }
    res.json(results);
  });
});

// Get contest by ID with problems
app.get('/api/contests/:id', (req, res) => {
  const contestId = req.params.id;
  
  // Get contest details
  db.query('SELECT * FROM contests WHERE id = ?', [contestId], (err, contestResults) => {
    if (err) {
      console.error('DB Error fetching contest:', err);
      return res.status(500).json({ error: 'Failed to fetch contest.' });
    }
    
    if (contestResults.length === 0) {
      return res.status(404).json({ error: 'Contest not found.' });
    }
    
    const contest = contestResults[0];
    
    // Get contest problems
    db.query('SELECT * FROM contest_problems WHERE contest_id = ?', [contestId], (err, problemResults) => {
      if (err) {
        console.error('DB Error fetching contest problems:', err);
        return res.status(500).json({ error: 'Failed to fetch contest problems.' });
      }
      
      // Parse JSON fields
      const problems = problemResults.map(problem => ({
        ...problem,
        mcqOptions: problem.mcq_options ? JSON.parse(problem.mcq_options) : null,
        testCases: problem.test_cases ? JSON.parse(problem.test_cases) : null
      }));
      
      res.json({
        contest: contest,
        problems: problems
      });
    });
  });
});

// Join a contest
app.post('/api/contests/:id/join', (req, res) => {
  const contestId = req.params.id;
  const { studentEmail } = req.body;
  
  if (!studentEmail) {
    return res.status(400).json({ error: 'Student email is required.' });
  }
  
  // Check if contest exists and has space
  db.query('SELECT * FROM contests WHERE id = ?', [contestId], (err, contestResults) => {
    if (err) {
      console.error('DB Error checking contest:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    
    if (contestResults.length === 0) {
      return res.status(404).json({ error: 'Contest not found.' });
    }
    
    const contest = contestResults[0];
    
    // Check if student is already participating
    db.query('SELECT * FROM contest_participants WHERE contest_id = ? AND student_email = ?', 
      [contestId, studentEmail], (err, participantResults) => {
      if (err) {
        console.error('DB Error checking participation:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      
      if (participantResults.length > 0) {
        return res.status(400).json({ error: 'Already participating in this contest.' });
      }
      
      // Check if contest is full
      if (contest.current_participants >= contest.max_participants) {
        return res.status(400).json({ error: 'Contest is full.' });
      }
      
      // Join the contest
      db.query('INSERT INTO contest_participants (contest_id, student_email) VALUES (?, ?)', 
        [contestId, studentEmail], (err, result) => {
        if (err) {
          console.error('DB Error joining contest:', err);
          return res.status(500).json({ error: 'Failed to join contest.' });
        }
        
        // Update participant count
        db.query('UPDATE contests SET current_participants = current_participants + 1 WHERE id = ?', 
          [contestId], (err) => {
          if (err) {
            console.error('DB Error updating participant count:', err);
          }
        });
        
        res.json({ message: 'Successfully joined contest!' });
      });
    });
  });
});

// Update contest status (for scheduled updates)
app.put('/api/contests/:id/status', (req, res) => {
  const contestId = req.params.id;
  const { status } = req.body;
  
  if (!status || !['upcoming', 'ongoing', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  
  db.query('UPDATE contests SET status = ? WHERE id = ?', [status, contestId], (err, result) => {
    if (err) {
      console.error('DB Error updating contest status:', err);
      return res.status(500).json({ error: 'Failed to update contest status.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contest not found.' });
    }
    
    res.json({ message: 'Contest status updated successfully!' });
  });
});

// Initialize code executor
const codeExecutor = new CodeExecutor();

// Code execution endpoints
app.post('/api/execute', async (req, res) => {
  try {
    const { language, code, testCases, timeLimit, memoryLimit } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required.' });
    }
    
    // Execute code using Docker (more secure)
    const result = await codeExecutor.executeCode(
      language, 
      code, 
      testCases || [], 
      timeLimit || 5000, 
      memoryLimit || 512
    );
    
    res.json(result);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: 'Code execution failed.' });
  }
});

// Alternative simple execution endpoint (for development/testing)
app.post('/api/execute-simple', async (req, res) => {
  try {
    const { language, code, testCases } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required.' });
    }
    
    // Execute code using child_process (less secure, but easier for development)
    const result = await codeExecutor.executeCodeSimple(language, code, testCases);
    
    res.json(result);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: 'Code execution failed.' });
  }
});

// Submit solution for a contest problem
app.post('/api/contests/:contestId/problems/:problemId/submit', async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    const { studentEmail, language, code } = req.body;
    
    if (!studentEmail || !language || !code) {
      return res.status(400).json({ error: 'Student email, language, and code are required.' });
    }
    
    // Get problem details and test cases
    db.query('SELECT * FROM contest_problems WHERE id = ? AND contest_id = ?', 
      [problemId, contestId], (err, problemResults) => {
      if (err) {
        console.error('DB Error fetching problem:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      
      if (problemResults.length === 0) {
        return res.status(404).json({ error: 'Problem not found.' });
      }
      
      const problem = problemResults[0];
      const testCases = problem.test_cases ? JSON.parse(problem.test_cases) : [];
      
      // Execute the code using simple execution for now
      codeExecutor.executeCodeSimple(language, code, testCases)
        .then(result => {
          // Store submission result
          const submissionQuery = `
            INSERT INTO contest_submissions (contest_id, problem_id, student_email, language, code, 
              output, passed, execution_time, memory_used, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `;
          
          db.query(submissionQuery, [
            contestId, problemId, studentEmail, language, code, 
            result.output, result.allTestsPassed, 0, 0
          ], (err, submissionResult) => {
            if (err) {
              console.error('DB Error storing submission:', err);
            }
          });
          
          // Update student stats & real-time streak if successful
          if (result.allTestsPassed) {
            const pointsToAdd = problem.points || 5;
            const updateStatsQuery = `
              UPDATE students
              SET 
                problems_solved = problems_solved + 1,
                total_points = total_points + ?,
                current_streak = CASE
                  WHEN DATE(last_solved_date) = CURDATE() THEN current_streak
                  WHEN DATE(last_solved_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN current_streak + 1
                  ELSE 1
                END,
                last_solved_date = CURDATE()
              WHERE email = ?
            `;
            db.query(updateStatsQuery, [pointsToAdd, studentEmail], (err) => {
              if (err) {
                console.error('DB Error updating stats/streak:', err);
              }
            });
          }
          
          res.json({
            success: true,
            result: result,
            message: result.allTestsPassed ? `All test cases passed! You earned ${problem.points || 5} points!` : 'Some test cases failed.'
          });
        })
        .catch(executionError => {
          console.error('Execution error:', executionError);
          res.status(500).json({ error: 'Code execution failed.' });
        });
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Submission failed.' });
  }
});

// Submit solution for practice problems (non-contest)
app.post('/api/problems/:problemId/submit', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { studentEmail, language, code, problemData } = req.body;
    
    if (!studentEmail || !language || !code || !problemData) {
      return res.status(400).json({ error: 'Student email, language, code, and problem data are required.' });
    }
    
    // Execute the code using simple execution
    const result = await codeExecutor.executeCodeSimple(language, code, problemData.testCases || []);
    
    // Update student stats and streak if practice test all passed
    if (result.allTestsPassed) {
      const pointsToAdd = problemData.points || 5;
      const updateStatsQuery = `
        UPDATE students
        SET 
          problems_solved = problems_solved + 1,
          total_points = total_points + ?,
          current_streak = CASE
            WHEN DATE(last_solved_date) = CURDATE() THEN current_streak
            WHEN DATE(last_solved_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN current_streak + 1
            ELSE 1
          END,
          last_solved_date = CURDATE()
        WHERE email = ?
      `;
      db.query(updateStatsQuery, [pointsToAdd, studentEmail], (err) => {
        if (err) {
          console.error('DB Error updating practice stats/streak:', err);
        }
      });
    }
    
    res.json({
      success: true,
      result: result,
      message: result.allTestsPassed ? `All test cases passed! You earned ${problemData.points || 5} points!` : 'Some test cases failed.'
    });
    
  } catch (error) {
    console.error('Practice submission error:', error);
    res.status(500).json({ error: 'Submission failed.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(5000, () => console.log('Server running on port 5000'));