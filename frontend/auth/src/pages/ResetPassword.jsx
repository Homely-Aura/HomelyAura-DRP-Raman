import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './ResetPassword.css';

const ResetPassword = () => {
  const { state }           = useLocation();
  const navigate             = useNavigate();
  const [email, setEmail]    = useState('');
  const [otp, setOtp]        = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError]     = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state?.email) setEmail(state.email);
  }, [state]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) {
      return setError('Passwords do not match');
    }
    try {
      const data = await authService.resetPassword({ email, otp, newPassword });
      setMessage(data.message || 'Password reset successful.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="reset-password-page">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        {message && <div className="message">{message}</div>}
        {error   && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Registered Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNew(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        <div className="back-to-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
