import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';                   // default import

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        const { sub: id, role, name, email } = jwtDecode(token);
        const me = { id: id || name, role, email };
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch (err) {
        console.error('JWT decode failed', err);
        setUser(null);
        localStorage.removeItem('user');
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    window.location.href = '/logout';
  };

  return (
    <AuthContext.Provider value={{ token, user, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
