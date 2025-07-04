const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const forbidden = ['rm -rf', 'shutdown', 'reboot'];

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// User login with team name and passkey
app.post('/api/login', async (req, res) => {
  const { username, password, team, teamKey } = req.body;
  const [teams] = await pool.query('SELECT id FROM teams WHERE name=? AND passkey=?', [team, teamKey]);
  if (teams.length === 0) return res.status(401).send('Invalid team or key');

  const teamId = teams[0].id;
  const [users] = await pool.query('SELECT id FROM users WHERE username=? AND password=? AND team_id=?', [username, password, teamId]);
  if (users.length === 0) return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ id: users[0].id, type: 'user' }, process.env.JWT_SECRET);
  res.json({ token, userId: users[0].id });
});

// Manager login
app.post('/api/mgr-login', async (req, res) => {
  const { username, password } = req.body;
  const [mgrs] = await pool.query('SELECT id FROM managers WHERE username=? AND password=?', [username, password]);
  if (mgrs.length === 0) return res.status(401).send('Invalid manager credentials');

  const token = jwt.sign({ id: mgrs[0].id, type: 'manager' }, process.env.JWT_SECRET);
  res.json({ token });
});

// Submit command (User)
app.post('/api/command', async (req, res) => {
  const { command, userId } = req.body;
  const isForbidden = forbidden.some(f => command.toLowerCase().includes(f.toLowerCase()));
  const conn = await pool.getConnection();

  if (isForbidden) {
    await conn.execute('INSERT INTO pending_commands (user_id, command) VALUES (?,?)', [userId, command]);
    conn.release();
    return res.status(200).send({ message: 'Command pending manager approval' });
  }

  await conn.execute('INSERT INTO commands (user_id, command, is_forbidden, timestamp) VALUES (?,?,false,NOW())', [userId, command]);
  conn.release();
  res.sendStatus(200);
});

// Logout with reason
app.post('/api/logout', async (req, res) => {
  const { userId, reason } = req.body;
  const conn = await pool.getConnection();
  await conn.execute(
    'UPDATE commands SET command = CONCAT(command, " [Reason: ", ?, "]") WHERE user_id=? AND DATE(timestamp)=CURDATE()',
    [reason, userId]
  );
  conn.release();
  res.sendStatus(200);
});

// Get all pending commands (Manager)
app.get('/api/pending', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT pc.id, pc.command, pc.timestamp, u.username, t.name as team
    FROM pending_commands pc
    JOIN users u ON pc.user_id = u.id
    JOIN teams t ON u.team_id = t.id
    WHERE pc.approved IS NULL
  `);
  res.json(rows);
});

// Approve/Reject a pending command
app.post('/api/approve', async (req, res) => {
  const { id, approve } = req.body;
  const conn = await pool.getConnection();
  await conn.execute('UPDATE pending_commands SET approved=? WHERE id=?', [approve, id]);

  if (approve) {
    const [[cmd]] = await conn.query('SELECT user_id, command FROM pending_commands WHERE id=?', [id]);
    await conn.execute('INSERT INTO commands (user_id, command, is_forbidden, timestamp) VALUES (?,?,true,NOW())', [cmd.user_id, cmd.command]);
  }

  conn.release();
  res.sendStatus(200);
});

// View all command logs (Manager)
app.get('/api/commands', async (req, res) => {
  const { userId, teamId, date } = req.query;
  let sql = `
    SELECT c.id, u.username, t.name as team, c.command, c.is_forbidden, c.timestamp
    FROM commands c
    JOIN users u ON c.user_id=u.id
    JOIN teams t ON u.team_id=t.id
    WHERE 1=1
  `;
  const params = [];
  if (userId) { sql += ' AND u.id=?'; params.push(userId); }
  if (teamId) { sql += ' AND t.id=?'; params.push(teamId); }
  if (date) { sql += ' AND DATE(c.timestamp)=?'; params.push(date); }
  sql += ' ORDER BY c.timestamp DESC';

  const [rows] = await pool.execute(sql, params);
  res.json(rows);
});

app.get('/', (req, res) => res.send('CommandGuard API is running'));

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
