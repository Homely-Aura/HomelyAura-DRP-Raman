// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user,  setUser]  = useState(null);

  // Whenever token changes, sync axios header and decode it into `user`
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        const { userId, role } = jwtDecode(token);
        setUser({ _id: userId, role });
      } catch {
        console.error('⚠️ JWT decode failed');
        setUser(null);
      }
    } else {
      delete api.defaults.headers.common.Authorization;
      setUser(null);
    }
  }, [token]);

  // Clears token+user and bounces back to your common auth app
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:3000/logout';
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
