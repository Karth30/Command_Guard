import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManagerDashboard() {
  const [pending, setPending] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ userId: '', teamId: '', date: '' });

  const loadPending = async () => {
    const res = await axios.get('http://localhost:5000/api/pending');
    setPending(res.data);
  };

  const loadLogs = async () => {
    const res = await axios.get('http://localhost:5000/api/commands', {
      params: filters
    });
    setLogs(res.data);
  };

  useEffect(() => {
    loadPending();
    loadLogs();
  }, []);

  const handleApprove = async (id, approve) => {
    await axios.post('http://localhost:5000/api/approve', { id, approve });
    loadPending();
    loadLogs();
  };

  const applyFilters = () => loadLogs();

  return (
    <div style={{ padding: 20 }}>
      <h3>Manager Dashboard</h3>

      <h4>Pending Commands</h4>
      {pending.map(p => (
        <div key={p.id} style={{ borderBottom: '1px solid gray' }}>
          <p><b>{p.username}</b> ({p.team}) tried: <i>{p.command}</i></p>
          <button onClick={() => handleApprove(p.id, true)}>Approve</button>
          <button onClick={() => handleApprove(p.id, false)}>Reject</button>
        </div>
      ))}

      <h4>All Command Logs</h4>
      <input placeholder="User ID" onChange={e => setFilters({ ...filters, userId: e.target.value })} />
      <input placeholder="Team ID" onChange={e => setFilters({ ...filters, teamId: e.target.value })} />
      <input placeholder="Date (YYYY-MM-DD)" onChange={e => setFilters({ ...filters, date: e.target.value })} />
      <button onClick={applyFilters}>Filter</button>

      <table border="1" style={{ marginTop: 10, width: '100%' }}>
        <thead>
          <tr>
            <th>User</th><th>Team</th><th>Command</th><th>Forbidden</th><th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.username}</td>
              <td>{log.team}</td>
              <td>{log.command}</td>
              <td>{log.is_forbidden ? 'Yes' : 'No'}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
