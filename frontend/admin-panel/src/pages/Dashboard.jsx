// frontend/admin-panel/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import './Dashboard.css';

function Dashboard() {
  const [counts, setCounts] = useState({ employees: 0, subadmins: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [emps, subs] = await Promise.all([
          adminService.getEmployees(),
          adminService.getSubAdmins(),
        ]);
        setCounts({ employees: emps.length, subadmins: subs.length });
      } catch (err) {
        console.error('Failed to fetch counts', err);
      }
    })();
  }, []);

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="stats-grid">
        <div
          className="stat-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/employees')}
          onKeyPress={e => e.key === 'Enter' && navigate('/employees')}
        >
          <div className="stat-number">{counts.employees}</div>
          <div className="stat-label">Employees</div>
        </div>
        <div
          className="stat-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/subadmins')}
          onKeyPress={e => e.key === 'Enter' && navigate('/subadmins')}
        >
          <div className="stat-number">{counts.subadmins}</div>
          <div className="stat-label">Sub-Admins</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
