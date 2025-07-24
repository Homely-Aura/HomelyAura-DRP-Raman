import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [message, setMessage] = useState('');
  const navigate              = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message || 'OTP sent. Check your email.');
      // forward email to reset page
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    }
  };

  return (
    <div className="forgot-password-page">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        {message && <div className="message">{message}</div>}
        {error   && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Your registered email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
        <div className="back-to-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
