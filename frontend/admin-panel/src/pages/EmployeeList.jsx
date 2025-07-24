  // src/pages/EmployeeList.jsx
  import React, { useEffect, useState } from 'react';
  import EmployeeCard from '../components/EmployeeCard';
  import EmployeeDetailModal from '../components/EmployeeDetailModal';
  import adminService from '../services/adminService';
  import './EmployeeList.css';

  export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    // New: track which employee is selected
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
      async function loadEmployees() {
        try {
          const data = await adminService.getEmployeesWithProfile();
          setEmployees(data);
        } catch (err) {
          console.error('Error loading employees:', err);
          setError('Failed to load employees.');
        } finally {
          setLoading(false);
        }
      }
      loadEmployees();
    }, []);

    return (
      <div className="employee-list">
        <h2>Employees</h2>

        {loading && <div className="loading">Loading employees…</div>}
        {error   && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="employee-cards">
            {employees.map(emp => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onClick={() => setSelectedEmployee(emp)}
              />
            ))}
          </div>
        )}

        {/* Render the detail modal when an employee is selected */}
        {selectedEmployee && (
          <EmployeeDetailModal
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}
      </div>
    );
  }
