import React, { useState, useEffect } from 'react';
import subAdminService from '../services/subAdminService';
import { handleApiError } from '../utils/helpers';
import EmployeeDetailPanel from '../components/EmployeeDetailPanel';
import './Dashboard.css';

const Dashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await subAdminService.getAssignedEmployees();
        setAssigned(data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)                return <p>Loading assigned employees…</p>;
  if (error)                  return <div className="error">{error}</div>;
  if (!assigned.length)       return <p>No employees assigned yet.</p>;

  return (
    
    <div className="dashboard-grid">
      {assigned.map(emp => (
        <EmployeeDetailPanel
          key={emp._id}
          employee={emp}
        />
      ))}
    </div>
  );
};

export default Dashboard;
