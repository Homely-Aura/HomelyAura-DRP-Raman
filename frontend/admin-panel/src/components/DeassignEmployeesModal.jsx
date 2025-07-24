// frontend/admin-panel/src/components/DeassignEmployeesModal.jsx
import React, { useState } from 'react';
import adminService from '../services/adminService';
import './DeassignEmployeesModal.css';

export default function DeassignEmployeesModal({
  subId,
  assigned,      // array of Employee docs, each with .user populated
  onClose,
  onDeassigned
}) {
  // now hold a set of user IDs, not employee‐doc IDs
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);

  const toggle = userId => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // pass user IDs array
      const updatedList = await adminService.deassignEmployeesFromSubAdmin(
        subId,
        Array.from(selected)
      );
      onDeassigned(updatedList);
    } catch (err) {
      console.error('Deassignment failed', err);
      setError('Deassignment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deassign-title"
    >
      <div className="modal-card">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close deassign dialog"
        >
          ×
        </button>
        <h3 id="deassign-title">Deassign Employees</h3>

        {error && <div className="error">{error}</div>}

        <ul className="modal-list">
          {assigned.map(emp => {
            // now grab the user ID & name
            const userId = emp.user?._id;
            const name   = emp.user?.name || 'Unnamed';
            return (
              <li key={userId}>
                <label htmlFor={`deassign-${userId}`}>
                  <input
                    id={`deassign-${userId}`}
                    type="checkbox"
                    checked={selected.has(userId)}
                    onChange={() => toggle(userId)}
                  />
                  <span>{name}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting || selected.size === 0}
        >
          {submitting ? 'Deassigning…' : 'Deassign'}
        </button>
      </div>
    </div>
  );
}
