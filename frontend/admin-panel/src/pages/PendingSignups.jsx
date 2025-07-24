import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './PendingSignups.css';

const PendingSignups = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchPending = async () => {
    setLoading(true);
    setError('');
    try {
      const users = await adminService.getPendingUsers();
      setPending(users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending sign-ups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await adminService.approveUser(userId);
      // Remove approved user from list
      setPending(pending.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  if (loading) {
    return <div className="pending-page">Loading pending sign-ups…</div>;
  }

  return (
    <div className="pending-page">
      <h1>Pending Sign-ups</h1>

      {error && <div className="error">{error}</div>}

      {pending.length === 0 ? (
        <p className="empty">No pending registrations.</p>
      ) : (
        <table className="pending-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(user._id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingSignups;
