import React from 'react';
import './EmployeeDetailModal.css';

export default function EmployeeDetailModal({ employee, onClose }) {
  if (!employee) return null;

  const backendRoot = process.env.REACT_APP_API_URL.replace(/\/api$/, '');
  const photoUrl = employee.photo
    ? `${backendRoot}/uploads/${employee.photo}`
    : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';

  const {
    user: { name = '—', email = '—' } = {},
    designation = '—',
    gender = '—',
    age = '—',
    dateOfJoining,
    createdAt
  } = employee;

  const joinDate = dateOfJoining || createdAt;
  const formattedJoin = joinDate
    ? new Date(joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '—';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="employee-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-header">
          <img src={photoUrl} alt={`${name}'s photo`} className="detail-photo" />
          <div className="detail-info">
            <h2 className="detail-name">{name}</h2>
            <p className="detail-designation">{designation}</p>
          </div>
        </div>

        <div className="modal-body">
          <div className="field-row">
            <span className="field-label">Email</span>
            <span className="field-value">{email}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Gender</span>
            <span className="field-value">{gender}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Age</span>
            <span className="field-value">{age}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Date of Joining</span>
            <span className="field-value">{formattedJoin}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Leave Calendar
          </button>
          <button className="btn btn-primary" onClick={() => {/* navigate to report */}}>
            Show Report
          </button>
        </div>
      </div>
    </div>
  );
}
