import axios from 'axios';

// Ensure the baseURL points to the /api endpoint and handles trailing slashes correctly
const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Ensure it ends with /api/
  return url.replace(/\/$/, '') + '/';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
