# Command_Guard

**Secure Command Monitoring & Admin Oversight Tool**  
CommandGuard is a full-stack application to **track, filter, and manage user-submitted shell commands** within teams.  
It enforces **restricted command control**, enables **admin review of sensitive actions**, and ensures accountability across all teams.

---

## Features

- **User Login** with Team & Passkey
- **Restricted command filtering** (e.g., rm -rf, shutdown)
- **Manager Dashboard** to:
  - Approve or reject forbidden commands
  - View and filter all user activity by team/user/date
  - Access logout reasons and user-specific reports
- **Approved commands** go directly to execution log
- **Forbidden commands** go to a "pending" queue until manager approval
- Clean UI with React + Node.js
- MySQL database support with relational data integrity

---

## Tech Stack

| Frontend     | Backend         | Database | Auth   | Styling    |
|--------------|------------------|----------|--------|------------|
| React.js     | Node.js + Express| MySQL    | JWT    | CSS-in-JS  |

---

##  Setup Instructions

### 1. Clone the repository

bash
git clone https://github.com/your-username/commandguard.git
cd commandguard


---

### 2. Backend Setup (/backend)

bash
cd backend
npm install


#### Create .env file inside backend/:

DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=command_db
JWT_SECRET=your_jwt_secret


#### Create DB + Tables

Run the following SQL script in **DBeaver** or **MySQL CLI**:

sql
CREATE DATABASE IF NOT EXISTS command_db;
USE command_db;

CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  passkey VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(100),
  team_id INT,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS managers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS commands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  command TEXT,
  is_forbidden BOOLEAN,
  timestamp DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_commands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  command TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample data
INSERT IGNORE INTO teams (name, passkey) VALUES
  ('design','design123'),
  ('provision','prov456'),
  ('testing','test789'),
  ('planning','plan321');

INSERT IGNORE INTO users (username,password,team_id) VALUES
  ('harry','harrypwd',1),
  ('ron','ronpwd',2), 
  ('dobby','dobbypwd',3),
  ('draco','dracopwd',4),
  ('hermoine','hermoinepwd',1);

INSERT IGNORE INTO managers (username,password) VALUES
  ('mgr1','mgrpass123');


#### Run the backend

bash
node app.js


By default, server runs at http://localhost:5000

---

### 3. Frontend Setup (/frontend)

bash
cd ../frontend
npm install
npm run dev


App runs at: http://localhost:5173

---

## Default Users

| Role     | Username | Password     | Team       | Passkey     |
|----------|----------|--------------|------------|-------------|
| User     | harry    | harrypwd     | design     | design123   |
| Manager  | mgr1     | mgrpass123   | -          | -           |

---

## Application Review
### Login Page

<img src="https://github.com/user-attachments/assets/901cafb2-9ab3-4176-8dd6-b2a913424403" width ="400" height="250"/>
<img src="https://github.com/user-attachments/assets/066344d9-7787-431f-a641-3c27eff58ce4" width ="400" height="250"/>
<img src="https://github.com/user-attachments/assets/56b9db09-654f-493c-be42-cd7142da913e" width ="400" height="250"/>

---

### User Dashboard

<img src="https://github.com/user-attachments/assets/bf22fc0c-364e-4350-ada9-d441681f25e5" width ="400" height="250"/>

---

### Manager Dashboard

<img src="https://github.com/user-attachments/assets/4bf7009f-5fd3-4bd5-bf89-d9489e7dae59" width ="400" height="250"/>
<img src="https://github.com/user-attachments/assets/0f44e3f4-1dda-4b32-9bce-f34b1cb153e5" width ="400" height="250"/>


---
Every command counts. Every action is accountable.
---
