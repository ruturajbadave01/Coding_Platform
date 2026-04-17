-- ============================================
-- COMPLETE DATABASE SCHEMA FOR CODING PLATFORM
-- ============================================
-- Run this script to create all required tables
-- Make sure to create the database first: CREATE DATABASE coding_platform;

USE coding_platform;

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  prn VARCHAR(50) UNIQUE NOT NULL,
  class VARCHAR(50) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  problems_solved INT DEFAULT 0,
  total_points INT DEFAULT 0,
  practice_points INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  global_rank INT DEFAULT 999,
  accuracy DECIMAL(5,2) DEFAULT 0.00,
  last_solved_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_students_email (email),
  INDEX idx_students_prn (prn),
  INDEX idx_students_branch (branch),
  INDEX idx_students_points (total_points),
  INDEX idx_students_rank (global_rank)
);

-- ============================================
-- 2. DEPARTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_departments_name (department_name)
);

-- Insert default departments
INSERT INTO departments (department_name, username, password) VALUES
('CSE', 'CSE', 'password'),
('IT', 'IT', 'password'),
('ENTC', 'ENTC', 'password'),
('MECH', 'MECH', 'password'),
('CIVIL', 'CIVIL', 'password'),
('ELECTRICAL', 'ELECTRICAL', 'password'),
('AIML', 'AIML', 'password'),
('AIDS', 'AIDS', 'password'),
('CHEM', 'CHEM', 'password'),
('PROD', 'PROD', 'password')
ON DUPLICATE KEY UPDATE department_name = department_name;

-- ============================================
-- 3. TPO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tpo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tpo_username (username)
);

-- ============================================
-- 4. SOLVED_PROBLEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS solved_problems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_email VARCHAR(255) NOT NULL,
  problem_id INT NOT NULL,
  source ENUM('practice','contest') NOT NULL,
  solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_solve (student_email, problem_id, source),
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
  INDEX idx_solved_student (student_email),
  INDEX idx_solved_problem (problem_id),
  INDEX idx_solved_source (source)
) ENGINE=InnoDB;

-- ============================================
-- 5. CONTESTS TABLE
-- ============================================
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contests_department (department),
  INDEX idx_contests_status (status),
  INDEX idx_contests_start_date (start_date)
);

-- ============================================
-- 6. CONTEST_PROBLEMS TABLE
-- ============================================
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
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  INDEX idx_contest_problems_contest_id (contest_id)
);

-- ============================================
-- 7. CONTEST_PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contest_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INT DEFAULT 0,
  problems_solved INT DEFAULT 0,
  attempt_started_at DATETIME NULL,
  attempt_expires_at DATETIME NULL,
  attempt_locked TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
  UNIQUE KEY unique_participant (contest_id, student_email),
  INDEX idx_contest_participants_contest_id (contest_id),
  INDEX idx_contest_participants_student_email (student_email)
);

-- ============================================
-- 8. CONTEST_SUBMISSIONS TABLE
-- ============================================
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

-- ============================================
-- 9. CONTEST_COMPLETIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contest_completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  department VARCHAR(255) NULL,
  student_email VARCHAR(255) NOT NULL,
  completed_problems TEXT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
  INDEX idx_contest (contest_id),
  INDEX idx_student (student_email),
  INDEX idx_department (department)
);

-- ============================================
-- 10. BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  badge_id VARCHAR(8) UNIQUE NOT NULL, -- 8-digit unique badge ID
  student_email VARCHAR(255) NOT NULL,
  badge_type ENUM('streak', 'problems', 'contest') NOT NULL,
  badge_tier VARCHAR(50) NOT NULL, -- Bronze, Silver, Gold, Diamond, Conquer
  badge_label VARCHAR(100) NOT NULL, -- Display name of the badge
  achievement_value INT NOT NULL, -- Problems solved, streak days, etc.
  description TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  verified_by VARCHAR(255) NULL, -- Department head who verified
  is_verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
  INDEX idx_badges_student (student_email),
  INDEX idx_badges_badge_id (badge_id),
  INDEX idx_badges_type (badge_type),
  INDEX idx_badges_issued (issued_at),
  INDEX idx_badges_verified (is_verified)
);

-- ============================================
-- 11. BADGE_VERIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badge_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  badge_id VARCHAR(8) NOT NULL,
  verified_by VARCHAR(255) NOT NULL, -- Department head email
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verification_notes TEXT,
  FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE,
  INDEX idx_verifications_badge (badge_id),
  INDEX idx_verifications_verifier (verified_by),
  INDEX idx_verifications_date (verified_at)
);

-- ============================================
-- END OF SCHEMA
-- ============================================
-- All tables have been created successfully!
-- You can now start using the coding platform.

