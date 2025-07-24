import React, { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header  from './components/Header';

import Dashboard    from './pages/Dashboard';
import ReportViewer from './pages/ReportViewer';
import Attendance   from './pages/Attendance';
import AssignTasks  from './pages/AssignTasks';   // ← NEW

// Guard that waits for decode, then kicks you back if not a subadmin
const ProtectedRoute = ({ children }) => {
  const { token, user, logout } = useAuth();
  if (!token) {
    logout();
    return null;
  }
  if (token && !user) {
    return null; // still decoding
  }
  if (user.role !== 'subadmin') {
    logout();
    return null;
  }
  return children;
};

// Shared layout with collapsible Sidebar + Header + <Outlet>
const SubadminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`main-content${collapsed ? ' collapsed' : ''}`}>
      <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

      <div className="app-layout">
        <Sidebar collapsed={collapsed} />
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
            <SubadminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="reports"    element={<ReportViewer />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="tasks"      element={<AssignTasks />} />      {/* ← NEW */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
}
