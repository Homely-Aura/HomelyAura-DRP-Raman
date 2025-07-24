// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import './Sidebar.css';

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/dashboard" end className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }>
            <HomeOutlined className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/employees" className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }>
            <UserOutlined className="nav-icon" />
            <span>Employees</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/subadmins" className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }>
            <TeamOutlined className="nav-icon" />
            <span>Sub‑Admins</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/pending-signups" className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }>
            <UserAddOutlined className="nav-icon" />
            <span>Pending Sign‑ups</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
