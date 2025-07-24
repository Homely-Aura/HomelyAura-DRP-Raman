import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY  = 'user';

const authService = {
  signup: (email, password, role = 'subadmin') =>
    api.post('/auth/signup', { email, password, role })
       .then(res => res.data),

  login: (email, password) =>
    api.post('/auth/login', { email, password })
       .then(res => {
         const { token, user } = res.data;
         localStorage.setItem(TOKEN_KEY, token);
         localStorage.setItem(USER_KEY, JSON.stringify(user));
         return user;
       }),

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // optionally notify backend if you support invalidation
  },

  getCurrentUser: () => {
    const json = localStorage.getItem(USER_KEY);
    return json ? JSON.parse(json) : null;
  },
};

export default authService;
