// src/pages/EmployeeDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import subAdminService from '../services/subAdminService';
import './EmployeeDetails.css';

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await subAdminService.getAssignedEmployees();
        const emp  = list.find(e => e._id === employeeId);
        if (!emp) throw new Error('Employee not found');
        setEmployee(emp);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [employeeId]);

  if (loading) return <p className="emp-loading">Loading employee…</p>;
  if (error)   return <div className="emp-error">{error}</div>;

  return (
    employee && (
      <div className="employee-details">
        <h1>{employee.user?.name || employee.name || 'Employee'}</h1>
        <div className="employee-details__info">
          <p><strong>Email:</strong> {employee.user?.email}</p>
          <p><strong>ID:</strong> {employee._id}</p>
          {/* Add more fields as needed */}
        </div>
      </div>
    )
  );
};

export default EmployeeDetails;
