import React, { useState } from 'react';
import axios from 'axios';

export default function CommandCLI({ userId }) {
  const [command, setCommand] = useState('');
  const [reason, setReason] = useState('');

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/command', { command, userId });
      alert('Command submitted');
      setCommand('');
    } catch {
      alert('Error submitting command');
    }
  };

  const handleLogout = async () => {
    if (!reason) return alert('Enter a reason to logout');
    await axios.post('http://localhost:5000/api/logout', { userId, reason });
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Command CLI</h3>
      <form onSubmit={handleCommandSubmit}>
        <input value={command} onChange={e => setCommand(e.target.value)} required />
        <button type="submit">Send</button>
      </form>

      <br />
      <input placeholder="Logout reason" value={reason} onChange={e => setReason(e.target.value)} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
