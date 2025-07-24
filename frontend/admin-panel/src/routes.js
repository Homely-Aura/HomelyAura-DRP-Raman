// src/routes.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetail from './pages/EmployeeDetail';
import SubAdminList from './pages/SubAdminList';
import PendingSignups from './pages/PendingSignups';

const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:3000';

function ProtectedLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(o => !o);

  // redirect to login if not authenticated
  if (!user) {
    return <Navigate to={AUTH_URL + '/login'} replace />;
  }

  return (
    <div className="app-container">
      <Header onToggle={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className={`main-content ${sidebarOpen ? '' : 'collapsed'}`}>
        <Sidebar collapsed={!sidebarOpen} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to={AUTH_URL + '/login'} replace />} />
      <Route path="/*" element={<ProtectedLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="subadmins" element={<SubAdminList />} />
        <Route path="pending-signups" element={<PendingSignups />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
