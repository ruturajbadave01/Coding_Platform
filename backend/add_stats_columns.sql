-- Add stats columns to students table
ALTER TABLE students 
ADD COLUMN problems_solved INT DEFAULT 0,
ADD COLUMN total_points INT DEFAULT 0,
ADD COLUMN current_streak INT DEFAULT 0,
ADD COLUMN global_rank INT DEFAULT 999,
ADD COLUMN accuracy DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN last_solved_date DATE NULL;