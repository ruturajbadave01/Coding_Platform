import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';

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

app.listen(5000, () => console.log('Server running on port 5000'));

function handleSubmit(e) {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length === 0) {
    if (role === 'student') {
      // ...existing student login code...
    } else if (role === 'department') {
      fetch('http://localhost:5000/api/department-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: form.department, password: form.password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            setSubmitted(true);
            setErrors({});
          } else {
            setErrors({ api: data.error || 'Login failed' });
            setSubmitted(false);
          }
        })
        .catch(() => {
          setErrors({ api: 'Network error' });
          setSubmitted(false);
        });
    } else if (role === 'tpo') {
      fetch('http://localhost:5000/api/tpo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tpoUsername: form.tpoUsername, password: form.password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            setSubmitted(true);
            setErrors({});
          } else {
            setErrors({ api: data.error || 'Login failed' });
            setSubmitted(false);
          }
        })
        .catch(() => {
          setErrors({ api: 'Network error' });
          setSubmitted(false);
        });
    }
  }
}