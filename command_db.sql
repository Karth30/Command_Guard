-- Create the database
CREATE DATABASE IF NOT EXISTS command_db;
USE command_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(100)
);

-- Create commands table
CREATE TABLE IF NOT EXISTS commands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  command TEXT,
  is_forbidden BOOLEAN,
  timestamp DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS pending_commands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  command TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


-- Optional: Insert a test user
INSERT INTO users (username, password) VALUES ('admin', 'admin123');
