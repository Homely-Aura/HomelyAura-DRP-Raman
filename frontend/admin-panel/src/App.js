import React from 'react';
import AppRoutes from './routes';
import './App.css';

export default function App() {
  // App.js no longer renders Header/Sidebar – 
  // that happens in ProtectedLayout inside routes.js
  return <AppRoutes />;
}