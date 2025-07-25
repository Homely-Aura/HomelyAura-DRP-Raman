import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AssignEmployeesModal from './AssignEmployeesModal';
import DeassignEmployeesModal from './DeassignEmployeesModal';
import './SubAdminCard.css';

export default function SubAdminCard({ subadmin, onUpdated }) {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [showDeassign, setShowDeassign] = useState(false);

  const backendRoot = (process.env.REACT_APP_API_URL || '').replace(/\/api$/, '');
  const defaultAvatar = 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const emps = await adminService.getEmployeesBySubAdmin(subadmin._id);
        setAssigned(Array.isArray(emps) ? emps : []);
        setError(null);
      } catch {
        setError('Could not load assigned employees.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, [subadmin._id, showAssign, showDeassign]);

  const handleAssign = newList => { setAssigned(newList); setShowAssign(false); onUpdated?.(); };
  const handleDeassign = newList => { setAssigned(newList); setShowDeassign(false); onUpdated?.(); };

  const name = subadmin.name || subadmin.user?.name || 'Unnamed';
  const email = subadmin.email || subadmin.user?.email || '—';
  const avatarUrl = subadmin.photo
    ? `${backendRoot}/uploads/${subadmin.photo}`
    : defaultAvatar;

  return (
    <div className="subadmin-card">
      {/* Header */}
      <div className="subadmin-card__header">
        <img src={avatarUrl} alt={name} className="subadmin-card__avatar" />
        <div className="subadmin-card__info">
          <h3 className="subadmin-card__name">{name}</h3>
          <p className="subadmin-card__email" title={email}>{email}</p>
        </div>
      </div>

      {/* Body: Assigned Employees */}
      <div className="subadmin-card__body">
        {loading ? (
          <div className="subadmin-card__status">Loading…</div>
        ) : error ? (
          <div className="subadmin-card__status subadmin-card__error">{error}</div>
        ) : (
          <div className="assigned-section">
            <h4 className="assigned-header">Assigned Employees ({assigned.length})</h4>
            {assigned.length ? (
              <div className="assigned-grid">
                {assigned.map(emp => {
                  const empAvatar = emp.photo
                    ? `${backendRoot}/uploads/${emp.photo}`
                    : emp.user?.photo
                      ? `${backendRoot}/uploads/${emp.user.photo}`
                      : defaultAvatar;
                  const empName = emp.user?.name || emp.name || 'Unnamed';
                  return (
                    <div key={emp._id} className="assigned-card">
                      <img src={empAvatar} alt={empName} className="assigned-card__avatar" />
                      <span className="assigned-card__name" title={empName}>{empName}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="subadmin-card__status">No employees assigned</div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Text Action Buttons */}
      <div className="subadmin-card__footer">
        <button
          className="action-text-btn"
          onClick={() => setShowAssign(true)}
        >
          Assign
        </button>
        <button
          className="action-text-btn"
          onClick={() => setShowDeassign(true)}
          disabled={!assigned.length}
        >
          Deassign
        </button>
      </div>

      {/* Modals */}
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