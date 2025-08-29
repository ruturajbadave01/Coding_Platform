-- Create contest_submissions table for storing student submissions
CREATE TABLE IF NOT EXISTS contest_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  problem_id INT NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  language VARCHAR(20) NOT NULL,
  code TEXT NOT NULL,
  output TEXT,
  passed BOOLEAN DEFAULT FALSE,
  execution_time INT DEFAULT 0, -- milliseconds
  memory_used INT DEFAULT 0, -- MB
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (problem_id) REFERENCES contest_problems(id) ON DELETE CASCADE,
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
  INDEX idx_submissions_contest (contest_id),
  INDEX idx_submissions_problem (problem_id),
  INDEX idx_submissions_student (student_email),
  INDEX idx_submissions_submitted (submitted_at)
);
