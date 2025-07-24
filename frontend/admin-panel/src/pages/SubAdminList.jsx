// frontend/admin-panel/src/pages/SubAdminList.jsx
import React, { useEffect, useState } from 'react';
import SubAdminCard from '../components/SubAdminCard';
import adminService from '../services/adminService';
import './SubAdminList.css';

function SubAdminList() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSubs() {
      try {
        const data = await adminService.getSubAdmins();
        setSubs(data);
      } catch (err) {
        console.error('Failed to load sub-admins', err);
        setError('Failed to load sub-admins.');
      } finally {
        setLoading(false);
      }
    }
    loadSubs();
  }, []);

  return (
    <div className="subadmin-list">
      <h2>Sub-Admins</h2>

      {loading && <div className="loading">Loading sub-admins…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="cards-container">
          {subs.map(sub => (
            <SubAdminCard
              key={sub._id}
              subadmin={sub}
              onUpdated={() => {/* optionally re-fetch if needed */}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SubAdminList;
