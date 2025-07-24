// src/components/EmployeeCard.jsx
import React from 'react';
import './EmployeeCard.css';

export default function EmployeeCard({ employee, onClick }) {
  const name        = employee.user?.name || employee.name || 'Unnamed';
  const designation = employee.designation || '—';
  const backendRoot = process.env.REACT_APP_API_URL.replace(/\/api$/, '');
  const photoUrl    = employee.photo
    ? `${backendRoot}/uploads/${employee.photo}`
    : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';

  return (
    <div
      className="employee-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={e => e.key === 'Enter' && onClick()}
    >
      <img
        src={photoUrl}
        alt={`${name}'s photo`}
        className="employee-photo"
      />
      <div className="employee-name">{name}</div>
      <div className="employee-designation">{designation}</div>
    </div>
  );
}
