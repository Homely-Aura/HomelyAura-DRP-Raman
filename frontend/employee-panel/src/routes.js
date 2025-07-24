import React, { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar       from './components/Sidebar';
import Header        from './components/Header';
import Dashboard     from './pages/Dashboard';
import ReportSubmit  from './pages/ReportSubmit';
import ReportHistory from './pages/ReportHistory';

const ProtectedRoute = ({ children }) => {
  const { token, user, logout } = useAuth();
  if (!token) {
    logout();
    return null;
  }
  if (token && !user) {
    return null;
  }
  if (user.role !== 'employee') {
    logout();
    return null;
  }
  return children;
};

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`app-layout ${isOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isOpen} />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="submit"  element={<ReportSubmit />} />
        <Route path="history" element={<ReportHistory />} />
        <Route path="*"       element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
}
