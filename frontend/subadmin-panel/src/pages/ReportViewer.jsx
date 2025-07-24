// src/pages/ReportViewer.jsx

import React, { useState, useEffect } from 'react';
import subAdminService from '../services/subAdminService';
import { handleApiError } from '../utils/helpers';
import EmployeeCard from '../components/EmployeeCard';
import ReportTable from '../components/ReportTable';
import './ReportViewer.css';

const ReportViewer = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await subAdminService.getAssignedEmployees();
        setEmployees(data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading employees…</p>;
  if (error)   return <div className="error">{error}</div>;

  // Detail view
  if (selected) {
    return (
      <div className="reports-detail">
        <h2>Reports for {selected.user?.name || selected.name}</h2>
        <ReportTable employeeId={selected._id} />
      </div>
    );
  }

  // Grid view
  return (
    <div className="reports-grid">
      {employees.map(emp => (
        <EmployeeCard
          key={emp._id}
          employee={emp}
          onClick={() => setSelected(emp)}
        />
      ))}
    </div>
  );
};

export default ReportViewer;
