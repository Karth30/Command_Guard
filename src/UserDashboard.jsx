import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDashboard({ userId }) {
  const [command, setCommand] = useState('');
  const [reason, setReason] = useState('');

  const submitCommand = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/command', {
        command,
        userId
      });
      alert(res.data.message || 'Command sent');
      setCommand('');
    } catch (err) {
      alert('Failed to send command');
    }
  };

  const logout = async () => {
    if (!reason.trim()) return alert('Enter reason');
    await axios.post('http://localhost:5000/api/logout', { userId, reason });
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>User Dashboard</h3>
      <form onSubmit={submitCommand}>
        <input
          value={command}
          onChange={e => setCommand(e.target.value)}
          placeholder="Enter command"
          required
        />
        <button type="submit">Send</button>
      </form>
      <br />
      <input
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Logout reason"
      />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
