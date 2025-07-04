import React, { useState } from 'react';
import axios from 'axios';

export default function LogoutForm({ userId, onLogout }) {
  const [reason, setR] = useState('');

  const handle = async () => {
    if (!reason) return alert('Enter logout reason');
    await axios.post('http://localhost:5000/api/logout', { userId, reason });
    onLogout();
  };

  return (
    <div>
      <h3>Logout</h3>
      <input placeholder="Reason" value={reason} onChange={e => setR(e.target.value)} />
      <button onClick={handle}>Logout</button>
    </div>
  );
}
