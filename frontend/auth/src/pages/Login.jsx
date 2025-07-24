import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Try subadmin/employee login first
    try {
      const data = await authService.login(email, password);
      login(data.token, data.user);
      return navigate('/redirect');
    } catch (userErr) {
      // If that fails, try admin login
      try {
        const data = await authService.adminLogin(email, password);
        login(data.token, data.user);
        return navigate('/redirect');
      } catch (adminErr) {
        const msg =
          adminErr.response?.data?.message ||
          userErr.response?.data?.message ||
          'Login failed';
        setError(msg);
      }
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Link to="/signup" className="login-signup">
          Sign up
        </Link>
        {error && <div className="error">{error}</div>}
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
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
