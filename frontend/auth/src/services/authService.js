import api from './api';

const authService = {
  // Admin login
  adminLogin: (email, password) =>
    api.post('/auth/admin/login', { email, password })
       .then(res => res.data),

  // Sub-admin & Employee signup
  signup: (name, email, password, role) =>
    api.post('/auth/signup', { name, email, password, role })
       .then(res => res.data),

  // Sub-admin & Employee login
  login: (email, password) =>
    api.post('/auth/login', { email, password })
       .then(res => res.data),

  // Request OTP for forgot-password
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email })
       .then(res => res.data),

  // Reset password using OTP
  resetPassword: ({ email, otp, newPassword }) =>
    api.post('/auth/reset-password', { email, otp, newPassword })
       .then(res => res.data)
};

export default authService;
