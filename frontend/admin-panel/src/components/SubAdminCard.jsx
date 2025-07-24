// frontend/admin-panel/src/components/SubAdminCard.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AssignEmployeesModal from './AssignEmployeesModal';
import DeassignEmployeesModal from './DeassignEmployeesModal';
import './SubAdminCard.css';

export default function SubAdminCard({ subadmin, onUpdated }) {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showAssign, setShowAssign]     = useState(false);
  const [showDeassign, setShowDeassign] = useState(false);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const emps = await adminService.getEmployeesBySubAdmin(subadmin._id);
      setAssigned(Array.isArray(emps) ? emps : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load assigned employees', err);
      setError('Could not load assigned employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [subadmin._id, showAssign, showDeassign]);

  const handleAssign    = newList => { setAssigned(newList); setShowAssign(false); onUpdated?.(); };
  const handleDeassign  = newList => { setAssigned(newList); setShowDeassign(false); onUpdated?.(); };

  return (
    <div className="subadmin-card">
      <h3 className="subadmin-card__name">{subadmin.name}</h3>
      <p className="subadmin-card__email">{subadmin.email}</p>

      {loading ? (
        <div className="subadmin-card__loading">Loading…</div>
      ) : error ? (
        <div className="subadmin-card__error">{error}</div>
      ) : (
        <div className="subadmin-card__assigned">
          {assigned.length ? (
            assigned.map(emp => (
              <span key={emp._id} className="subadmin-card__assigned-item">
                {emp.user?.name || emp.name || 'Unnamed'}
              </span>
            ))
          ) : (
            <em className="subadmin-card__none">No employees assigned</em>
          )}
        </div>
      )}

      <div className="subadmin-card__actions">
        <button className="action-btn" onClick={() => setShowAssign(true)}>
          Assign
        </button>
        <button
          className="action-btn"
          onClick={() => setShowDeassign(true)}
          disabled={!assigned.length}
        >
          Deassign
        </button>
      </div>

      {showAssign && (
        <AssignEmployeesModal
          subId={subadmin._id}
          onClose={() => setShowAssign(false)}
          onAssigned={handleAssign}
        />
      )}

      {showDeassign && (
        <DeassignEmployeesModal
          subId={subadmin._id}
          assigned={assigned}
          onClose={() => setShowDeassign(false)}
          onDeassigned={handleDeassign}
        />
      )}
    </div>
  );
}
