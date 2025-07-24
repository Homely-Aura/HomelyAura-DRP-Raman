import React from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>

        <h1 className="header__title">Subadmin Panel</h1>
      </div>

      <button
        className="header__logout"
        onClick={logout}
        aria-label="Logout"
      >
        <FaSignOutAlt />
      </button>
    </header>
  );
};

export default Header;
