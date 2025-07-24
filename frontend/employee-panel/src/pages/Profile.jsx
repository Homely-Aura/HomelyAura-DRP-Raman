// src/pages/Profile.jsx
import React from 'react';
import {
  Briefcase,
  Cake,
  Mars,
  CalendarCheck
} from 'lucide-react';
import './Profile.css';

const Profile = ({ profile }) => {
  const joined = new Date(profile.dateOfJoining).toLocaleDateString();
  return (
    <div className="profile-card">
      {/* Left panel: Avatar */}
      <div className="profile-avatar-section">
        <img
          src={profile.photo}
          alt={profile.name}
          className="profile-avatar"
        />
      </div>

      {/* Right panel: Info */}
      <div className="profile-info-section">
        <h1 className="profile-name">{profile.name}</h1>
        <p className="profile-role">
          <Briefcase size={20} /> {profile.designation}
        </p>

        <div className="profile-stats">
          <div className="stat-item">
            <Cake size={20} />
            <span>Age : <strong>{profile.age}yrs</strong></span>
          </div>
          <div className="stat-item">
            <Mars size={20} />
            <span>Gender :  <strong>{profile.gender}</strong></span>
          </div>
          <div className="stat-item">
            <CalendarCheck size={20} />
            <span>Joined :  <strong>{joined}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
