import axios, { AxiosInstance, AxiosError } from 'axios';

// Get API base URL from environment or default to localhost
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with proper configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
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

