// src/components/EmployeeDetailModal.jsx
import React from 'react';
import './EmployeeDetailModal.css';

export default function EmployeeDetailModal({ employee, onClose }) {
  if (!employee) return null;

  // build photo URL
  const backendRoot = process.env.REACT_APP_API_URL.replace(/\/api$/, '');
  const photoUrl = employee.photo
    ? `${backendRoot}/uploads/${employee.photo}`
    : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';

  // destructure fields
  const {
    user: { name = '—', email = '—', gender = '—', dob } = {},
    designation = '—',
    joinDate
  } = employee;

  // format dates & compute age
  const formattedJoin = joinDate ? new Date(joinDate).toLocaleDateString() : '—';
  const age = dob
    ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
    : '—';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="employee-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>

        <div className="modal-header">
          <img src={photoUrl} alt={name} className="detail-photo" />
          <div className="header-info">
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
          <button className="btn btn-primary">
            Show Report
          </button>
        </div>
      </div>
    </div>
  );
}
