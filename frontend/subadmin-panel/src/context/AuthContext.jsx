import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(null);

  // Whenever token changes, re-sync axios & decode into user
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        const { userId, role } = jwtDecode(token);
        setUser({ _id: userId, role });
      } catch (err) {
        console.error('JWT decode failed:', err);
        setUser(null);
      }
    } else {
      delete api.defaults.headers.common.Authorization;
      setUser(null);
    }
  }, [token]);

  // Call this once you have a fresh token (e.g. from the URL)
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Clears everything and bounces back to your Auth mini-app
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = 'http://localhost:3000/logout';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
