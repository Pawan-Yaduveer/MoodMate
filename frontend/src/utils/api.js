import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔑 Utility function to set/remove auth token
export const setAuthToken = (token) => {
  console.log('setAuthToken called with:', token ? 'token present' : 'no token');
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    console.log('Token stored in localStorage and headers');
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    console.log('Token removed from localStorage and headers');
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null); // clear token if expired
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
