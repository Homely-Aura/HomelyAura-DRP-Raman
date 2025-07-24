// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';
import './Header.css';

export default function Header({ onToggle, sidebarOpen }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = 'http://localhost:3000/login';
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className={`menu-icon ${sidebarOpen ? 'open' : ''}`}
          onClick={onToggle}
          type="button"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="logo">Admin Panel</span>
      </div>
      <div className="header-right">
        {user?.username && <span className="username">{user.username}</span>}
        <button className="logout-button" onClick={handleLogout} type="button">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
