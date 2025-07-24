import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// load panel base URLs from env (fallback to localhost)
const PANEL_URLS = {
  admin:    process.env.REACT_APP_ADMIN_URL    || 'http://localhost:3001',
  subadmin: process.env.REACT_APP_SUBADMIN_URL || 'http://localhost:3002',
  employee: process.env.REACT_APP_EMPLOYEE_URL || 'http://localhost:3003',
};

const RoleRedirect = () => {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role).toLowerCase().trim();
  const base = PANEL_URLS[role] || PANEL_URLS.employee;
  window.location.href = `${base}?token=${token}`;
  return null;
};

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/signup"
        element={user ? <Navigate to="/redirect" replace /> : <Signup />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/redirect" replace /> : <Login />}
      />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/redirect" replace /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={user ? <Navigate to="/redirect" replace /> : <ResetPassword />}
      />
      <Route path="/redirect" element={<RoleRedirect />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
