-- Create contests table
CREATE TABLE IF NOT EXISTS contests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(50) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  duration INT DEFAULT 120, -- minutes
  max_participants INT DEFAULT 100,
  difficulty ENUM('Easy', 'Medium', 'Hard', 'Expert') DEFAULT 'Medium',
  current_participants INT DEFAULT 0,
  status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
  created_by VARCHAR(100) NOT NULL, -- email of admin/TPO who created it
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contest_problems table for storing contest problems
CREATE TABLE IF NOT EXISTS contest_problems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  question_type ENUM('coding', 'mcq') DEFAULT 'coding',
  difficulty ENUM('Easy', 'Medium', 'Hard', 'Expert') DEFAULT 'Medium',
  points INT DEFAULT 10,
  time_limit INT DEFAULT 1000, -- milliseconds
  memory_limit INT DEFAULT 256, -- MB
  mcq_options JSON, -- For MCQ questions: ["option1", "option2", "option3", "option4"]
  correct_answer INT DEFAULT 0, -- Index of correct answer for MCQ
  test_cases JSON, -- For coding problems: [{"input": "...", "output": "...", "description": "..."}]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE
);

-- Create contest_participants table for tracking who joined which contest
CREATE TABLE IF NOT EXISTS contest_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INT DEFAULT 0,
  problems_solved INT DEFAULT 0,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
  UNIQUE KEY unique_participant (contest_id, student_email)
);

-- Add indexes for better performance
CREATE INDEX idx_contests_department ON contests(department);
CREATE INDEX idx_contests_status ON contests(status);
CREATE INDEX idx_contests_start_date ON contests(start_date);
CREATE INDEX idx_contest_problems_contest_id ON contest_problems(contest_id);
CREATE INDEX idx_contest_participants_contest_id ON contest_participants(contest_id);
CREATE INDEX idx_contest_participants_student_email ON contest_participants(student_email);
