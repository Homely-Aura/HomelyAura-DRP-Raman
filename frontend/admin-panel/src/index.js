// preserve token-on-load logic
(() => {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('token');
  if (t) {
    localStorage.setItem('token', t);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 1) Wrap the entire app in AuthProvider */}
    <AuthProvider>
      {/* 2) Only one Router here */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
