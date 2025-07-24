import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/admin`,  // exactly matches your back-end prefix
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// automatically inject the Bearer token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('→ Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

// optional: centralized error logging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('← Response error:', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);

export default api;
