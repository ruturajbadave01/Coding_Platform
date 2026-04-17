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
  password: 'Ruturaj@2003',
  database: 'coding_platform'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database!');
    // Ensure required schema exists (safe idempotent migrations)
    try {
      // Check if column exists first, then add if it doesn't
      db.query(
        'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
        ['coding_platform', 'students', 'last_solved_date'],
        (checkErr, checkResults) => {
          if (checkErr) {
            console.error('Schema check error:', checkErr);
          } else if (checkResults.length === 0) {
            // Column doesn't exist, add it
            db.query(
              'ALTER TABLE students ADD COLUMN last_solved_date DATE NULL',
              (alterErr) => {
                if (alterErr) {
                  console.error('Schema ensure error (last_solved_date):', alterErr);
                } else {
                  console.log('Schema ensured: students.last_solved_date');
                }
              }
            );
          } else {
            console.log('Schema already exists: students.last_solved_date');
          }
        }
      );

      // Ensure practice_points column exists (practice-only points for dashboard)
      db.query(
        'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
        ['coding_platform', 'students', 'practice_points'],
        (pErr, pRes) => {
          if (!pErr && (!pRes || pRes.length === 0)) {
            db.query('ALTER TABLE students ADD COLUMN practice_points INT NOT NULL DEFAULT 0', (aErr) => {
              if (aErr) console.error('Schema ensure error (practice_points):', aErr);
              else console.log('Schema ensured: students.practice_points');
            });
          }
        }
      );

      // Ensure solved_problems table exists to track first-time solves
      const createSolvedTableSQL = `
        CREATE TABLE IF NOT EXISTS solved_problems (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_email VARCHAR(255) NOT NULL,
          problem_id INT NOT NULL,
          source ENUM('practice','contest') NOT NULL,
          solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uniq_solve (student_email, problem_id, source)
        ) ENGINE=InnoDB;
      `;
      db.query(createSolvedTableSQL, (spErr) => {
        if (spErr) {
          console.error('Schema ensure error (solved_problems):', spErr);
        } else {
          console.log('Schema ensured: solved_problems');
        }
      });

      // Ensure departments table exists and seed defaults if empty
      const createDepartmentsSQL = `
        CREATE TABLE IF NOT EXISTS departments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          department_name VARCHAR(255) NOT NULL UNIQUE,
          username VARCHAR(255) NULL,
          password VARCHAR(255) NOT NULL
        ) ENGINE=InnoDB;
      `;
      db.query(createDepartmentsSQL, (depErr) => {
        if (depErr) {
          console.error('Schema ensure error (departments):', depErr);
        } else {
          // Detect if 'username' column exists
          db.query('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
            ['coding_platform','departments','username'], (colErr, colRes) => {
              const hasUsername = !colErr && colRes && colRes.length > 0;
              const checkCountSQL = 'SELECT COUNT(*) AS cnt FROM departments';
              db.query(checkCountSQL, (cntErr, cntRes) => {
                if (cntErr) {
                  console.error('Departments count error:', cntErr);
                  return;
                }
                const count = cntRes?.[0]?.cnt || 0;
                if (count === 0) {
                  const defaultDepartments = [
                    'CSE','IT','ENTC','MECH','CIVIL','ELECTRICAL','AIML','AIDS','CHEM','PROD'
                  ];
                  if (hasUsername) {
                    const values = defaultDepartments.map((d) => [d, d, 'password']);
                    db.query('INSERT INTO departments (department_name, username, password) VALUES ?', [values], (seedErr) => {
                      if (seedErr) {
                        console.error('Seeding departments failed:', seedErr);
                      } else {
                        console.log('Seeded default departments (with username) with password "password"');
                      }
                    });
                  } else {
                    const values = defaultDepartments.map((d) => [d, 'password']);
                    db.query('INSERT INTO departments (department_name, password) VALUES ?', [values], (seedErr) => {
                      if (seedErr) {
                        console.error('Seeding departments failed:', seedErr);
                      } else {
                        console.log('Seeded default departments with password "password"');
                      }
                    });
                  }
                }
              });
            });
        }
      });

      // Ensure contest_completions table exists for contest final submissions
      const createContestCompletionsSQL = `
        CREATE TABLE IF NOT EXISTS contest_completions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          contest_id INT NOT NULL,
          department VARCHAR(255) NULL,
          student_email VARCHAR(255) NOT NULL,
          completed_problems TEXT NULL,
          submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_contest (contest_id),
          INDEX idx_student (student_email)
        ) ENGINE=InnoDB;
      `;
      db.query(createContestCompletionsSQL, (ccErr) => {
        if (ccErr) {
          console.error('Schema ensure error (contest_completions):', ccErr);
        } else {
          console.log('Schema ensured: contest_completions');
        }
      });

      // Ensure attempt control columns exist on contest_participants
      const ensureAttemptCols = [
        { name: 'attempt_started_at', ddl: 'ALTER TABLE contest_participants ADD COLUMN attempt_started_at DATETIME NULL' },
        { name: 'attempt_expires_at', ddl: 'ALTER TABLE contest_participants ADD COLUMN attempt_expires_at DATETIME NULL' },
        { name: 'attempt_locked', ddl: 'ALTER TABLE contest_participants ADD COLUMN attempt_locked TINYINT(1) NOT NULL DEFAULT 0' }
      ];
      ensureAttemptCols.forEach((col) => {
        db.query(
          'SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
          ['coding_platform', 'contest_participants', col.name],
          (colErr, colRes) => {
            if (colErr) {
              console.error('Schema check error (contest_participants.' + col.name + '):', colErr);
              return;
            }
            if (!colRes || colRes.length === 0) {
              db.query(col.ddl, (alterErr) => {
                if (alterErr) {
                  console.error('Schema ensure error (contest_participants.' + col.name + '):', alterErr);
                } else {
                  console.log('Schema ensured: contest_participants.' + col.name);
                }
              });
            }
          }
        );
      });
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
  const deptInput = String(department).trim();
  const passInput = String(password).trim();
  const passLc = passInput.toLowerCase();
  console.log('[DEPT LOGIN] request', { department: deptInput, passwordLen: passInput.length });
  db.query(
    'SELECT * FROM departments WHERE LOWER(department_name) = LOWER(?)',
    [deptInput],
    async (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      let user = results[0];
      console.log('[DEPT LOGIN] lookup result count:', results.length);
      if (!user) {
        // Auto-provision department with default password 'password'
        const insertSQL = 'INSERT INTO departments (department_name, password) VALUES (?, ?)';
        db.query(insertSQL, [deptInput, 'password'], (insErr) => {
          if (insErr) {
            console.error('Auto-provision department failed:', insErr);
            return res.status(401).json({ error: 'Wrong credentials.' });
          }
          user = { department_name: deptInput, password: 'password' };
          // Continue with password check below after insert succeeds
          const passOk = (
            passInput === String(user.password).trim() ||
            passInput.toLowerCase() === String(user.department_name).trim().toLowerCase()
          );
          console.log('[DEPT LOGIN] auto-provisioned; passOk:', passOk);
          if (passOk) {
            return res.json({ message: 'Login successful!', provisioned: true });
          }
          return res.status(401).json({ error: 'Wrong credentials.' });
        });
        return; // prevent fall-through while async insert completes
      }
      
      // Accept either stored password or department name as fallback (case-insensitive, trimmed)
      // Accept either stored password or department name as fallback (case-insensitive, trimmed)
      if (
        passLc === String(user.password).trim().toLowerCase() ||
        passLc === String(user.department_name).trim().toLowerCase()
      ) {
        console.log('[DEPT LOGIN] success for', user.department_name);
        res.json({ message: 'Login successful!' });
      } else {
        console.log('[DEPT LOGIN] password mismatch for', user.department_name);
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
    'SELECT problems_solved, total_points, COALESCE(practice_points, 0) AS practice_points, current_streak, global_rank, accuracy, last_solved_date FROM students WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.error('DB Error fetching stats:', err);
        // Fallback: return default stats instead of 500 to avoid breaking UI
        return res.json({
          stats: {
            totalSolved: 0,
            totalPoints: 0,
            currentStreak: 0,
            rank: 999,
            accuracy: 0,
            lastSolvedDate: null
          }
        });
      }
      if (results.length === 0) {
        // If student not found, return default stats to keep UI consistent
        return res.json({
          stats: {
            totalSolved: 0,
            totalPoints: 0,
            currentStreak: 0,
            rank: 999,
            accuracy: 0,
            lastSolvedDate: null
          }
        });
      }
      
      const stats = results[0];
      // Dashboard shows practice points only (not contest points)
      const userStats = {
        totalSolved: stats.problems_solved || 0,
        totalPoints: stats.practice_points != null ? Number(stats.practice_points) : (stats.total_points || 0),
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

// Generate unique 8-digit badge ID
const generateBadgeId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Create badge for student achievement
app.post('/api/badges/create', (req, res) => {
  const { studentEmail, badgeType, badgeTier, badgeLabel, achievementValue, description } = req.body;
  
  if (!studentEmail || !badgeType || !badgeTier || !badgeLabel || achievementValue === undefined) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const badgeId = generateBadgeId();
  
  const query = `
    INSERT INTO badges (badge_id, student_email, badge_type, badge_tier, badge_label, achievement_value, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [badgeId, studentEmail, badgeType, badgeTier, badgeLabel, achievementValue, description], (err, result) => {
    if (err) {
      console.error('DB Error creating badge:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    
    res.json({ 
      success: true, 
      badgeId: badgeId,
      message: 'Badge created successfully!' 
    });
  });
});

// Get student's badges
app.get('/api/badges/student/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  
  const query = `
    SELECT b.*, s.first_name, s.middle_name, s.last_name, s.branch
    FROM badges b
    JOIN students s ON b.student_email = s.email
    WHERE b.student_email = ?
    ORDER BY b.issued_at DESC
  `;
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('DB Error fetching badges:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    
    res.json({ badges: results });
  });
});

// Verify badge by ID
app.get('/api/badges/verify/:badgeId', (req, res) => {
  const badgeId = req.params.badgeId;
  
  if (!/^\d{8}$/.test(badgeId)) {
    return res.status(400).json({ error: 'Invalid badge ID format. Must be 8 digits.' });
  }
  
  const query = `
    SELECT b.*, s.first_name, s.middle_name, s.last_name, s.branch, s.email
    FROM badges b
    JOIN students s ON b.student_email = s.email
    WHERE b.badge_id = ?
  `;
  
  db.query(query, [badgeId], (err, results) => {
    if (err) {
      console.error('DB Error verifying badge:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Badge not found.' });
    }
    
    const badge = results[0];
    res.json({
      success: true,
      badge: {
        badgeId: badge.badge_id,
        studentName: `${badge.first_name} ${badge.middle_name} ${badge.last_name}`.replace(/\s+/g, ' ').trim(),
        studentEmail: badge.email,
        badgeType: badge.badge_type,
        badgeTier: badge.badge_tier,
        badgeLabel: badge.badge_label,
        achievementValue: badge.achievement_value,
        description: badge.description,
        issuedDate: badge.issued_at,
        isVerified: badge.is_verified,
        verifiedAt: badge.verified_at,
        verifiedBy: badge.verified_by,
        department: badge.branch
      }
    });
  });
});

// Mark badge as verified by department
app.post('/api/badges/verify/:badgeId', (req, res) => {
  const badgeId = req.params.badgeId;
  const { verifiedBy, verificationNotes } = req.body;
  
  if (!verifiedBy) {
    return res.status(400).json({ error: 'Verifier information required.' });
  }
  
  const query = `
    UPDATE badges 
    SET is_verified = TRUE, verified_by = ?, verified_at = NOW()
    WHERE badge_id = ?
  `;
  
  db.query(query, [verifiedBy, badgeId], (err, result) => {
    if (err) {
      console.error('DB Error verifying badge:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Badge not found.' });
    }
    
    // Log verification
    const logQuery = `
      INSERT INTO badge_verifications (badge_id, verified_by, verification_notes)
      VALUES (?, ?, ?)
    `;
    
    db.query(logQuery, [badgeId, verifiedBy, verificationNotes || ''], (logErr) => {
      if (logErr) {
        console.error('DB Error logging verification:', logErr);
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Badge verified successfully!' 
    });
  });
});

// Get all badges for department verification
app.get('/api/badges/department/:department', (req, res) => {
  const department = decodeURIComponent(req.params.department);
  
  const query = `
    SELECT b.*, s.first_name, s.middle_name, s.last_name, s.branch
    FROM badges b
    JOIN students s ON b.student_email = s.email
    WHERE s.branch = ?
    ORDER BY b.issued_at DESC
  `;
  
  db.query(query, [department], (err, results) => {
    if (err) {
      console.error('DB Error fetching department badges:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    
    res.json({ badges: results });
  });
});

// Global leaderboard: by practice points only (for student dashboard)
app.get('/api/leaderboard', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const query = `
    SELECT 
      first_name, last_name, email, class, branch,
      COALESCE(practice_points, 0) AS practice_points,
      COALESCE(problems_solved, 0) AS problems_solved
    FROM students
    ORDER BY COALESCE(practice_points, 0) DESC, problems_solved DESC, first_name ASC
    LIMIT ?
  `;

  db.query(query, [limit], (err, results) => {
    if (err) {
      console.error('DB Error fetching leaderboard:', err);
      return res.json([]);
    }

    const leaderboard = results.map((row, index) => ({
      rank: index + 1,
      name: `${row.first_name} ${row.last_name}`.trim(),
      points: row.practice_points != null ? Number(row.practice_points) : 0,
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
    SELECT 
      c.*,
      CASE 
        WHEN NOW() < c.start_date THEN 'upcoming'
        WHEN NOW() BETWEEN c.start_date AND c.end_date THEN 'ongoing'
        ELSE 'completed'
      END AS computed_status,
      COUNT(DISTINCT cp.id) AS problem_count,
      COUNT(DISTINCT cpart.student_email) AS current_participants
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
    const normalized = (results || []).map((row) => ({
      ...row,
      status: row.computed_status || row.status
    }));
    res.json(normalized);
  });
});

// Get contests by department
app.get('/api/contests/department/:department', (req, res) => {
  const department = req.params.department;
  const query = `
    SELECT 
      c.*,
      CASE 
        WHEN NOW() < c.start_date THEN 'upcoming'
        WHEN NOW() BETWEEN c.start_date AND c.end_date THEN 'ongoing'
        ELSE 'completed'
      END AS computed_status,
      COUNT(DISTINCT cp.id) AS problem_count,
      COUNT(DISTINCT cpart.student_email) AS current_participants
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
    const normalized = (results || []).map((row) => ({
      ...row,
      status: row.computed_status || row.status
    }));
    res.json(normalized);
  });
});

// Get contest by ID with problems
app.get('/api/contests/:id', (req, res) => {
  const contestId = req.params.id;
  const studentEmail = req.query.studentEmail;
  
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

    // Optional enforcement: if studentEmail is provided, ensure within window and not locked
    if (studentEmail) {
      const now = new Date();
      const starts = new Date(contest.start_date);
      const ends = new Date(contest.end_date);
      if (now < starts || now > ends) {
        return res.status(403).json({ error: 'Contest is not accessible at this time.' });
      }
      db.query(
        'SELECT attempt_locked, attempt_expires_at FROM contest_participants WHERE contest_id = ? AND student_email = ?',
        [contestId, studentEmail],
        (pErr, pRes) => {
          if (pErr) {
            console.error('DB Error checking attempt lock:', pErr);
            return res.status(500).json({ error: 'Failed to check attempt status.' });
          }
          const row = pRes && pRes[0];
          if (!row) {
            return res.status(403).json({ error: 'Attempt not started for this contest.' });
          }
          if (row.attempt_locked) {
            return res.status(403).json({ error: 'Contest attempt is locked.' });
          }
          if (row.attempt_expires_at && new Date(row.attempt_expires_at) < now) {
            return res.status(403).json({ error: 'Contest attempt window has expired.' });
          }
          // Proceed to load problems below when constraints pass
          loadProblems();
        }
      );
      return; // wait for participants check, prevent fallthrough
    }
    
    function loadProblems() {
      // Get contest problems
      db.query('SELECT * FROM contest_problems WHERE contest_id = ?', [contestId], (err, problemResults) => {
      if (err) {
        console.error('DB Error fetching contest problems:', err);
        return res.status(500).json({ error: 'Failed to fetch contest problems.' });
      }
      
      // Parse JSON fields with error handling
      const problems = problemResults.map(problem => {
        let mcqOptions = null;
        let testCases = null;
        
        try {
          mcqOptions = problem.mcq_options ? JSON.parse(problem.mcq_options) : null;
        } catch (e) {
          console.error('Error parsing mcq_options:', problem.mcq_options);
          mcqOptions = null;
        }
        
        try {
          if (problem.test_cases) {
            // If test_cases is already an object/array, use it directly
            if (typeof problem.test_cases === 'object') {
              testCases = problem.test_cases;
            } else {
              // If it's a string, try to parse it
              testCases = JSON.parse(problem.test_cases);
            }
          } else {
            testCases = [];
          }
        } catch (e) {
          console.error('Error parsing test_cases:', problem.test_cases);
          testCases = [];
        }
        
        return {
          ...problem,
          mcqOptions: mcqOptions,
          testCases: testCases
        };
      });
      
        res.json({
          contest: contest,
          problems: problems
        });
      });
    }

    // If no studentEmail enforcement requested, load problems directly
    loadProblems();
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
        // Return 200 to avoid noisy errors on the client; convey status via message
        return res.json({ message: 'Already participating in this contest.' });
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

// Start a contest attempt (single-attempt control)
app.post('/api/contests/:id/start', (req, res) => {
  const contestId = req.params.id;
  const { studentEmail } = req.body || {};
  if (!studentEmail) {
    return res.status(400).json({ error: 'Student email is required.' });
  }
  // Fetch contest to check window
  db.query('SELECT * FROM contests WHERE id = ?', [contestId], (cErr, cRes) => {
    if (cErr) {
      console.error('DB Error fetching contest for start:', cErr);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!cRes || cRes.length === 0) return res.status(404).json({ error: 'Contest not found.' });
    const contest = cRes[0];
    const now = new Date();
    const starts = new Date(contest.start_date);
    const ends = new Date(contest.end_date);
    if (now < starts || now > ends) {
      return res.status(403).json({ error: 'Contest is not accessible at this time.' });
    }

    // Ensure participant row exists
    db.query('SELECT * FROM contest_participants WHERE contest_id = ? AND student_email = ?', [contestId, studentEmail], (pErr, pRes) => {
      if (pErr) {
        console.error('DB Error checking participant:', pErr);
        return res.status(500).json({ error: 'Database error.' });
      }
      const durationMin = Math.max(Number(contest.duration || 0), 0);
      const expires = durationMin > 0 ? new Date(now.getTime() + durationMin * 60000) : ends;
      if (!pRes || pRes.length === 0) {
        const ins = 'INSERT INTO contest_participants (contest_id, student_email, attempt_started_at, attempt_expires_at, attempt_locked) VALUES (?, ?, NOW(), ?, 0)';
        db.query(ins, [contestId, studentEmail, expires], (iErr) => {
          if (iErr) {
            console.error('DB Error starting attempt (insert):', iErr);
            return res.status(500).json({ error: 'Failed to start attempt.' });
          }
          return res.json({ message: 'Attempt started', expiresAt: expires });
        });
      } else {
        const row = pRes[0];
        if (row.attempt_locked) {
          return res.status(403).json({ error: 'Contest attempt is locked.' });
        }
        const update = 'UPDATE contest_participants SET attempt_started_at = COALESCE(attempt_started_at, NOW()), attempt_expires_at = COALESCE(attempt_expires_at, ?), attempt_locked = 0 WHERE contest_id = ? AND student_email = ?';
        db.query(update, [expires, contestId, studentEmail], (uErr) => {
          if (uErr) {
            console.error('DB Error starting attempt (update):', uErr);
            return res.status(500).json({ error: 'Failed to start attempt.' });
          }
          return res.json({ message: 'Attempt resumed', expiresAt: row.attempt_expires_at || expires });
        });
      }
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
    const { studentEmail, language, code, problemData, testCases: clientTestCases } = req.body;
    
    if (!studentEmail || !language || !code) {
      return res.status(400).json({ error: 'Student email, language, and code are required.' });
    }
    
    // Enforce attempt state and contest window
    db.query('SELECT c.start_date, c.end_date, p.attempt_locked, p.attempt_expires_at FROM contests c LEFT JOIN contest_participants p ON p.contest_id = c.id AND p.student_email = ? WHERE c.id = ?', [studentEmail, contestId], (stErr, stRes) => {
      if (stErr) {
        console.error('DB Error checking attempt state:', stErr);
        return res.status(500).json({ error: 'Database error.' });
      }
      const row = stRes && stRes[0];
      const now = new Date();
      if (!row) {
        return res.status(403).json({ error: 'Attempt not started or contest not found.' });
      }
      if (now < new Date(row.start_date) || now > new Date(row.end_date)) {
        return res.status(403).json({ error: 'Contest is not accessible at this time.' });
      }
      if (row.attempt_locked) {
        return res.status(403).json({ error: 'Contest attempt is locked.' });
      }
      if (row.attempt_expires_at && new Date(row.attempt_expires_at) < now) {
        return res.status(403).json({ error: 'Contest attempt window has expired.' });
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
      const normalizeTc = (tc) => ({
        input: String((tc?.input ?? '')).replace(/,/g, ' '),
        output: String((tc?.output ?? '')),
        description: tc?.description || ''
      });
      
      // Prefer client-provided test cases (from problemData or testCases) if valid; fallback to DB
      let visibleTestCases = [];
      try {
        if (Array.isArray(problemData?.testCases) && problemData.testCases.length > 0) {
          visibleTestCases = problemData.testCases.slice(0, 3).map(normalizeTc);
        } else if (Array.isArray(clientTestCases) && clientTestCases.length > 0) {
          visibleTestCases = clientTestCases.slice(0, 3).map(normalizeTc);
        } else {
          let parsed = [];
          try {
            parsed = problem.test_cases ? JSON.parse(problem.test_cases) : [];
          } catch (e) {
            console.error('Error parsing test_cases:', problem.test_cases);
            parsed = [];
          }
          visibleTestCases = Array.isArray(parsed) ? parsed.slice(0, 3).map(normalizeTc) : [];
        }
      } catch (e) {
        console.error('Error preparing visibleTestCases:', e);
        visibleTestCases = [];
      }
      
      // Execute the code against only the first up to three visible sample test cases
      console.log('Contest submission - executing code with test cases:', visibleTestCases);
      const startedAt = Date.now();
      codeExecutor.executeCodeSimple(language, code, visibleTestCases)
        .then(result => {
          console.log('Contest submission - execution result:', result);
          const totalMs = Date.now() - startedAt;
          // Store submission result
          const submissionQuery = `
            INSERT INTO contest_submissions (contest_id, problem_id, student_email, language, code, 
              output, passed, execution_time, memory_used, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `;
          
          db.query(submissionQuery, [
            contestId, problemId, studentEmail, language, code, 
            result.output || '', result.allTestsPassed ? 1 : 0, totalMs, 0
          ], (err, submissionResult) => {
            if (err) {
              console.error('DB Error storing submission:', err);
            }
          });
          
          // Update real-time streak on ANY successful submission (even repeat solves)
          if (result.allTestsPassed) {
            const updateStreakOnly = `
              UPDATE students
              SET 
                current_streak = CASE
                  WHEN DATE(last_solved_date) = CURDATE() THEN current_streak
                  WHEN DATE(last_solved_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN current_streak + 1
                  ELSE 1
                END,
                last_solved_date = CURDATE()
              WHERE email = ?
            `;
            db.query(updateStreakOnly, [studentEmail], (err) => {
              if (err) console.error('DB Error updating streak (contest):', err);
            });

            // Then, only if first-time solve, add points and solved count
            const pointsToAdd = problem.points || 5;
            const checkSolvedSQL = 'SELECT id FROM solved_problems WHERE student_email = ? AND problem_id = ? AND source = "contest"';
            db.query(checkSolvedSQL, [studentEmail, problemId], (chkErr, chkRes) => {
              if (chkErr) {
                console.error('DB Error checking first-time solve:', chkErr);
                return;
              }
              if (chkRes.length === 0) {
                // First time solving this problem
                const insertSolvedSQL = 'INSERT INTO solved_problems (student_email, problem_id, source) VALUES (?, ?, "contest")';
                db.query(insertSolvedSQL, [studentEmail, problemId], (insErr) => {
                  if (insErr) {
                    console.error('DB Error inserting solved_problems:', insErr);
                  }
                });
                const updatePointsAndSolved = `
                  UPDATE students
                  SET 
                    problems_solved = problems_solved + 1,
                    total_points = total_points + ?
                  WHERE email = ?
                `;
                db.query(updatePointsAndSolved, [pointsToAdd, studentEmail], (err) => {
                  if (err) console.error('DB Error updating points/solved (contest):', err);
                });
                // Update contest_participants score and problems_solved for contest leaderboard
                const updateParticipantSQL = `
                  UPDATE contest_participants
                  SET score = score + ?,
                      problems_solved = problems_solved + 1
                  WHERE contest_id = ? AND student_email = ?
                `;
                db.query(updateParticipantSQL, [pointsToAdd, contestId, studentEmail], (pErr) => {
                  if (pErr) console.error('DB Error updating contest_participants:', pErr);
                });
                // Send success message with points for first-time solve
                res.json({
                  success: true,
                  result: { ...result, executionTimeMs: totalMs },
                  message: `All shown test cases passed! You earned ${pointsToAdd} points!`
                });
              } else {
                // Already solved before - no points added
                res.json({
                  success: true,
                  result: { ...result, executionTimeMs: totalMs },
                  message: 'All shown test cases passed! (Already solved - no points added)'
                });
              }
            });
          } else {
            // Test cases failed
            res.json({
              success: true,
              result: { ...result, executionTimeMs: totalMs },
              message: 'Some shown test cases failed. Check the output details.'
            });
          }
        })
        .catch(executionError => {
          console.error('Execution error:', executionError);
          res.status(500).json({ error: 'Code execution failed.' });
        });
      });
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Submission failed.' });
  }
});


// Final contest submission (student completes contest)
app.post('/api/contests/:contestId/submit', (req, res) => {
  const { contestId } = req.params;
  const { studentEmail, completedProblems = [] } = req.body || {};
  console.log('[CONTEST SUBMIT] incoming', { contestId, studentEmail, completedProblemsCount: Array.isArray(completedProblems) ? completedProblems.length : 'n/a' });
  if (!studentEmail) {
    console.log('[CONTEST SUBMIT] missing studentEmail');
    return res.status(400).json({ success: false, error: 'Student email is required.' });
  }
  // Look up department for contest (to allow department filtering)
  db.query('SELECT department FROM contests WHERE id = ?', [contestId], (cErr, cRes) => {
    if (cErr) {
      console.error('[CONTEST SUBMIT] contest lookup error:', cErr);
    }
    const department = (!cErr && cRes && cRes[0] && cRes[0].department) ? cRes[0].department : null;
    const problemsJson = (() => {
      try { return JSON.stringify(Array.isArray(completedProblems) ? completedProblems : []); } catch (_) { return '[]'; }
    })();
    db.query(
      'INSERT INTO contest_completions (contest_id, department, student_email, completed_problems) VALUES (?, ?, ?, ?)',
      [contestId, department, studentEmail, problemsJson],
      (err, result) => {
        if (err) {
          console.error('[CONTEST SUBMIT] DB insert error:', err);
          return res.status(500).json({ success: false, error: 'Failed to store contest completion', details: err.code || String(err) });
        }
        console.log('[CONTEST SUBMIT] stored', { id: result?.insertId, contestId, studentEmail });
        // Lock the attempt
        db.query('UPDATE contest_participants SET attempt_locked = 1 WHERE contest_id = ? AND student_email = ?', [contestId, studentEmail], (lockErr) => {
          if (lockErr) console.error('[CONTEST SUBMIT] failed to lock attempt:', lockErr);
          return res.json({ success: true, message: 'Contest submitted successfully.' });
        });
      }
    );
  });
});

// Department view: all contest completions for a department (optionally by contest)
app.get('/api/department/:department/contest-completions', (req, res) => {
  const { department } = req.params;
  const { contestId } = req.query;
  const params = [department];
  let sql = 'SELECT id, contest_id, department, student_email, completed_problems, submitted_at FROM contest_completions WHERE department = ?';
  if (contestId) {
    sql += ' AND contest_id = ?';
    params.push(contestId);
  }
  sql += ' ORDER BY submitted_at DESC';
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('DB Error fetching contest completions:', err);
      return res.status(500).json({ error: 'Failed to fetch contest completions' });
    }
    res.json(results || []);
  });
});

// Department view: aggregated report per student for a contest
app.get('/api/contests/:contestId/results', (req, res) => {
  const { contestId } = req.params;
  const sql = `
    SELECT 
      cs.student_email,
      s.first_name,
      s.last_name,
      SUM(CASE WHEN cs.passed = 1 THEN 1 ELSE 0 END) AS correct_count,
      SUM(CASE WHEN cs.passed = 0 THEN 1 ELSE 0 END) AS wrong_count,
      COUNT(*) AS total_submissions,
      MAX(cs.submitted_at) AS last_submission_at,
      SUM(COALESCE(cs.execution_time, 0)) AS total_execution_ms,
      COALESCE(points.points_earned, 0) AS points_earned
    FROM contest_submissions cs
    LEFT JOIN students s ON s.email = cs.student_email
    LEFT JOIN (
      SELECT 
        cs2.student_email,
        SUM(DISTINCT cp.points) AS points_earned
      FROM contest_submissions cs2
      JOIN contest_problems cp ON cp.id = cs2.problem_id
      WHERE cs2.contest_id = ? AND cs2.passed = 1
      GROUP BY cs2.student_email
    ) AS points ON points.student_email = cs.student_email
    WHERE cs.contest_id = ?
    GROUP BY cs.student_email, s.first_name, s.last_name, points.points_earned
    ORDER BY points_earned DESC, correct_count DESC, total_submissions ASC, last_submission_at DESC
  `;
  db.query(sql, [contestId, contestId], (err, results) => {
    if (err) {
      console.error('DB Error fetching contest results:', err);
      return res.status(500).json({ error: 'Failed to fetch contest results' });
    }
    res.json(results || []);
  });
});

// Department view: raw submissions list for a contest
app.get('/api/contests/:contestId/submissions', (req, res) => {
  const { contestId } = req.params;
  const sql = `
    SELECT 
      cs.id,
      cs.contest_id,
      cs.problem_id,
      cp.title AS problem_title,
      cp.question_type,
      cs.student_email,
      cs.language,
      cs.passed,
      cs.execution_time,
      cs.submitted_at
    FROM contest_submissions cs
    LEFT JOIN contest_problems cp ON cp.id = cs.problem_id
    WHERE cs.contest_id = ?
    ORDER BY cs.submitted_at DESC
  `;
  db.query(sql, [contestId], (err, results) => {
    if (err) {
      console.error('DB Error fetching contest submissions:', err);
      return res.status(500).json({ error: 'Failed to fetch contest submissions' });
    }
    res.json(results || []);
  });
});
// Submit solution for practice problems (non-contest)
app.post('/api/problems/:problemId/submit', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { studentEmail, language, code, problemData } = req.body;
    
    if (!studentEmail || !language || !code || !problemData) {
      return res.status(400).json({ error: 'Student email, language, code, and problem data are required.' });
    }
    
    // Evaluate submissions only against up to the first three visible sample test cases
    const visibleTestCases = Array.isArray(problemData.testCases) ? problemData.testCases.slice(0, 3) : [];
    // Execute the code using simple execution against only the visible samples
    const result = await codeExecutor.executeCodeSimple(language, code, visibleTestCases);
    
    // Update streak on ANY successful practice submission
    if (result.allTestsPassed) {
      const updateStreakOnly = `
        UPDATE students
        SET 
          current_streak = CASE
            WHEN DATE(last_solved_date) = CURDATE() THEN current_streak
            WHEN DATE(last_solved_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN current_streak + 1
            ELSE 1
          END,
          last_solved_date = CURDATE()
        WHERE email = ?
      `;
      db.query(updateStreakOnly, [studentEmail], (err) => {
        if (err) console.error('DB Error updating streak (practice):', err);
      });

      // Only on first-time solve: add points and solved count
      const pointsToAdd = problemData.points || 5;
      const checkSolvedSQL = 'SELECT id FROM solved_problems WHERE student_email = ? AND problem_id = ? AND source = "practice"';
      db.query(checkSolvedSQL, [studentEmail, problemData.id], (chkErr, chkRes) => {
        if (chkErr) {
          console.error('DB Error checking first-time practice solve:', chkErr);
          return;
        }
        if (chkRes.length === 0) {
          // First time solving this problem
          const insertSolvedSQL = 'INSERT INTO solved_problems (student_email, problem_id, source) VALUES (?, ?, "practice")';
          db.query(insertSolvedSQL, [studentEmail, problemData.id], (insErr) => {
            if (insErr) console.error('DB Error inserting practice solved_problems:', insErr);
          });
          const updatePointsSolved = `
            UPDATE students
            SET 
              problems_solved = problems_solved + 1,
              total_points = total_points + ?,
              practice_points = COALESCE(practice_points, 0) + ?
            WHERE email = ?
          `;
          db.query(updatePointsSolved, [pointsToAdd, pointsToAdd, studentEmail], (err) => {
            if (err) console.error('DB Error updating practice points/solved:', err);
          });
          
          // Send success message with points for first-time solve
          res.json({
            success: true,
            result: result,
            message: `All shown test cases passed! You earned ${pointsToAdd} points!`
          });
        } else {
          // Already solved before - no points added
          res.json({
            success: true,
            result: result,
            message: 'All shown test cases passed! (Already solved - no points added)'
          });
        }
      });
    } else {
      // Test cases failed
      res.json({
        success: true,
        result: result,
        message: 'Pass only the shown test cases (visible).'
      });
    }
    
  } catch (error) {
    console.error('Practice submission error:', error);
    res.status(500).json({ error: 'Submission failed.' });
  }
});

// Check if a problem is already solved by a student
app.get('/api/problems/:problemId/solved-status', (req, res) => {
  try {
    const { problemId } = req.params;
    const { studentEmail, source = 'practice' } = req.query;
    
    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required.' });
    }
    
    db.query(
      'SELECT id FROM solved_problems WHERE student_email = ? AND problem_id = ? AND source = ?',
      [studentEmail, problemId, source],
      (err, results) => {
        if (err) {
          console.error('DB Error checking solved status:', err);
          return res.status(500).json({ error: 'Database error.' });
        }
        
        res.json({
          isSolved: results.length > 0,
          solvedAt: results.length > 0 ? results[0].solved_at : null
        });
      }
    );
    
  } catch (error) {
    console.error('Solved status check error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(5000, () => console.log('Server running on port 5000'));