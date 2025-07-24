// TODO: service
import axios from 'axios';

// Base URL for API (from .env or fallback)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
console.log('🛠️  Employee API_URL is:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
