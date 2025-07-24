import React from 'react';
import {
  MdWork,
  MdCake,
  MdCalendarToday,
  MdWc
} from 'react-icons/md';
import './EmployeeDetailPanel.css';

const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const EmployeeDetailPanel = ({ employee }) => {
  const {
    user = {},
    designation,
    age,
    dateOfJoining,
    gender,
    photo
  } = employee;

  const name  = user.name || 'Unnamed';
  const email = user.email || '';
  const api   = process.env.REACT_APP_API_URL?.replace(/\/api$/, '') || '';
  const src   = photo ? `${api}/uploads/${photo}` : '/default-avatar.png';

  return (
    <div className="emp-detail-card">
      <div className="emp-detail-card__avatar">
        <img src={src} alt={name} />
      </div>
      <div className="emp-detail-card__content">
        <h2 className="emp-detail-card__name">{name}</h2>
        <p className="emp-detail-card__email">{email}</p>
        <div className="emp-detail-card__details">
          <div className="emp-detail-card__detail-item">
            <MdWork className="emp-detail-card__icon" />
            <div className="emp-detail-card__text">
              <span className="emp-detail-card__label">Designation</span>
              <span className="emp-detail-card__value">{designation || '-'}</span>
            </div>
          </div>
          <div className="emp-detail-card__detail-item">
            <MdCake className="emp-detail-card__icon" />
            <div className="emp-detail-card__text">
              <span className="emp-detail-card__label">Age</span>
              <span className="emp-detail-card__value">{age || '-'}</span>
            </div>
          </div>
          <div className="emp-detail-card__detail-item">
            <MdCalendarToday className="emp-detail-card__icon" />
            <div className="emp-detail-card__text">
              <span className="emp-detail-card__label">Joined</span>
              <span className="emp-detail-card__value">
                {dateOfJoining ? formatDate(dateOfJoining) : '-'}
              </span>
            </div>
          </div>
          <div className="emp-detail-card__detail-item">
            <MdWc className="emp-detail-card__icon" />
            <div className="emp-detail-card__text">
              <span className="emp-detail-card__label">Gender</span>
              <span className="emp-detail-card__value">{gender || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPanel;
