// 1) Grab `?token=…` once on page load and persist to localStorage
(() => {
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('token');
  if (token) {
    localStorage.setItem('token', token);
    console.log('📦 Stored subadmin token');
    // remove it from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
