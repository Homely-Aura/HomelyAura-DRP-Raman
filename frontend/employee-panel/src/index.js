// src/index.js
// ───────────────────────────────────────────────────────────────────────────────
// 1) Grab `?token=…` once on page load and persist to localStorage
(() => {
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('token');
  if (token) {
    localStorage.setItem('token', token);
    console.log('📦 Stored employee token:', token);
    // clean the URL so you don’t keep grabbing on every reload
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// import only the weights/styles you need:
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
