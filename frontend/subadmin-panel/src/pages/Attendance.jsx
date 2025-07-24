// src/pages/Attendance.jsx

import React, { useState, useEffect } from 'react';
import subAdminService from '../services/subAdminService';
import { handleApiError } from '../utils/helpers';
import EmployeeCard from '../components/EmployeeCard';
import AttendanceCalendar from '../components/AttendanceCalendar';
import './Attendance.css';

const Attendance = () => {
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
      <div className="attendance-detail">
        <button className="back-btn" onClick={() => setSelected(null)}>
          ← Back to Attendance
        </button>
        <h2 className='heading'>Attendance for {selected.user?.name || selected.name}</h2>
        <AttendanceCalendar employeeId={selected._id} />
      </div>
    );
  }

  // Grid view
  return (
    <div className="attendance-grid">
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

export default Attendance;
