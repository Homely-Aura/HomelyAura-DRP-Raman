// frontend/admin-panel/src/components/AssignEmployeesModal.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './AssignEmployeesModal.css';

export default function AssignEmployeesModal({ subId, onClose, onAssigned }) {
  const [emps, setEmps]         = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadEmps() {
      setLoading(true);
      try {
        const data = await adminService.getEmployees();
        setEmps(data);
      } catch (err) {
        console.error('Failed to load employees', err);
        setError('Unable to load employees.');
      } finally {
        setLoading(false);
      }
    }
    loadEmps();
  }, []);

  const toggleSelect = id => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const updatedList = await adminService.assignEmployeesToSubAdmin(
        subId,
        Array.from(selected)
      );
      onAssigned(updatedList);
    } catch (err) {
      console.error('Assignment failed', err);
      setError('Assignment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="assign-title">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose} aria-label="Close assign dialog">×</button>
        <h3 id="assign-title">Assign Employees</h3>

        {loading ? (
          <div className="loading">Loading employees…</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <ul className="items-list">
            {emps.map(emp => {
              const name = emp.user?.name || emp.name || 'Unnamed';
              return (
                <li key={emp._id}>
                  <label htmlFor={`assign-${emp._id}`}>
                    <input
                      id={`assign-${emp._id}`}
                      type="checkbox"
                      checked={selected.has(emp._id)}
                      onChange={() => toggleSelect(emp._id)}
                    />
                    <span>{name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading || submitting}
        >
          {submitting ? 'Assigning…' : 'Assign'}
        </button>
      </div>
    </div>
  );
}
  