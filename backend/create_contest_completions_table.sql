-- Create contest_completions table for storing contest completion data
CREATE TABLE IF NOT EXISTS contest_completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  completed_problems JSON, -- Array of problem IDs that were completed
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
  UNIQUE KEY unique_contest_student (contest_id, student_email),
  INDEX idx_completions_contest (contest_id),
  INDEX idx_completions_student (student_email),
  INDEX idx_completions_date (completed_at)
);









