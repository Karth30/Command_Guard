import React, { useState } from 'react';
import LoginForm from './LoginForm';
import ManagerLogin from './ManagerLogin';
import UserDashboard from './UserDashboard';
import ManagerDashboard from './ManagerDashboard';

function App() {
  const [mode, setMode] = useState(null); // 'user' | 'manager'
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = ({ type, userId }) => {
    setUserId(userId);
    setIsLoggedIn(true);
    setMode(type);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserId(null);
    setIsLoggedIn(false);
    setMode(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerBox}>
        <h1 style={styles.title}>CommandGuard</h1>
        <p style={styles.subtitle}>
           Every command counts. Every action is accountable.
        </p>

        {!isLoggedIn ? (
          <div style={styles.buttonRow}>
            <button style={styles.btn} onClick={() => setMode('user')}>Login as User</button>
            <button style={styles.btn} onClick={() => setMode('manager')}>Login as Manager</button>
          </div>
        ) : (
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        )}

        {!isLoggedIn && mode === 'user' && (
          <div style={styles.card}>
            <LoginForm onLogin={handleLogin} />
          </div>
        )}

        {!isLoggedIn && mode === 'manager' && (
          <div style={styles.card}>
            <ManagerLogin onLogin={handleLogin} />
          </div>
        )}

        {isLoggedIn && mode === 'user' && (
          <div style={styles.card}>
            <UserDashboard userId={userId} />
          </div>
        )}

        {isLoggedIn && mode === 'manager' && (
          <div style={styles.card}>
            <ManagerDashboard />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(to right, #004466, #0077b6)',
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  innerBox: {
    backgroundColor: '#f0faff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '800px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#004466',
    fontSize: '36px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '18px'
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '30px'
  },
  btn: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0077b6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  logoutBtn: {
    padding: '6px 14px',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '700px',
    margin: 'auto'
  }
};

export default App;
