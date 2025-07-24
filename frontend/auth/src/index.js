// src/index.js (Auth app)
(() => {
  // On every cold load, wipe the session
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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
