import axios, { AxiosInstance, AxiosError } from 'axios';

const DEFAULT_API_URL = 'https://cuet-transport-backend-wd78.onrender.com';
const envApiUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || DEFAULT_API_URL).trim();
const normalizedApiUrl = /^https?:\/\//i.test(envApiUrl) ? envApiUrl : `https://${envApiUrl}`;
const API_BASE_URL = normalizedApiUrl.replace(/\/$/, '').replace(/\/api$/, '');
const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT);
const API_TIMEOUT = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 30000;

// Create axios instance with proper configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using httpOnly cookies
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cuet_bus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      // Clear stored user data
      localStorage.removeItem('cuet_bus_token');
      localStorage.removeItem('cuet_bus_user');
      
      // Redirect to login page
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }
    
    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }
    
    // Handle 404 - Not found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }
    
    // Handle 500 - Server error
    if (error.response?.status === 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;

