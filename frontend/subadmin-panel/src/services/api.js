// src/services/api.js

import axios from 'axios';

// Reads the base-URL from your .env (fallback to localhost:5001)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
console.log('🛠️  Subadmin API_URL is:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT on each request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
