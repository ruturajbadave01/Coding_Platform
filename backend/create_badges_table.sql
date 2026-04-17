-- Create badges table for storing unique student achievement badges
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

-- Create badge_verifications table for tracking verification history
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

