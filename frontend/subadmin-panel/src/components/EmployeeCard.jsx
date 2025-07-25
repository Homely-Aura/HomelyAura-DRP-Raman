// src/components/EmployeeCard.jsx
import React from 'react';
import './EmployeeCard.css';

function EmployeeCard({ employee, onClick }) {
  const name = employee.user?.name || 'Unnamed';

  // Fallback if REACT_APP_API_URL isn't defined
  const rawApi = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const backendRoot = rawApi.replace(/\/api$/, '');

  const photoUrl = employee.photo
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
      <div className="employee-card__accent" />
      <img
        src={photoUrl}
        alt={`${name}'s photo`}
        className="employee-card__photo"
      />
      <div className="employee-card__name">{name}</div>
    </div>
  );
}

export default EmployeeCard;
