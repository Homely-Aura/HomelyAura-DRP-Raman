import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { handleApiError } from '../utils/helpers';
import './Signup.css';

const Signup = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('subadmin');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      await authService.signup(name, email, password, role);
      setSuccess(true);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (success) {
    return (
      <div className="signup-success">
        <h1>Registration Submitted</h1>
        <p>
          Thanks for signing up, <strong>{name}</strong>!  
          Your account is now pending administrator approval.
          You’ll receive an email once it’s approved.
        </p>
        <Link to="/login" className="btn">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <Link to="/login" className="signup-login">
          Log in
        </Link>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="subadmin">Sub-Admin</option>
          <option value="employee">Employee</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
