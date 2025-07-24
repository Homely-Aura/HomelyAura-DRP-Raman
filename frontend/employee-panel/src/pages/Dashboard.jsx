// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import { handleApiError } from '../utils/helpers';
import ProfileSetup from './ProfileSetup';
import Profile from './Profile';
import AttendanceCalendar from '../components/AttendanceCalendar';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const { profile } = await employeeService.getProfile();
        setProfile(profile);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <div className="error">{error}</div>;

  if (!profile || !profile.designation) {
    return <ProfileSetup />;
  }

  return (
    <>
      <Profile profile={profile} />
      {/* Use profile._id here so employeeId is valid */}
      <AttendanceCalendar employeeId={profile._id} />
    </>
  );
};

export default Dashboard;
