import api from './api';
import { User, UserRole } from '@/data/types';
import { users } from '@/data/dummyData';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Auth API calls
export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    // Development: Use dummy data for authentication
    const user = users.find(
      (u) => u.username === request.username && u.password === request.password
    );

    if (user) {
      // Create a dummy JWT-like token
      const token = btoa(JSON.stringify({ userId: user.id, username: user.username, role: user.role }));
      
      return {
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
        },
      };
    }

    return {
      success: false,
      message: 'Login failed',
      error: 'Invalid credentials',
    };
  },

  signup: async (request: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/signup', request);
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return {
        success: false,
        message: 'Signup failed',
        error: error.response?.data?.message || error.message || 'Unable to create account',
      };
    }
  },

  getProfile: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch profile',
        error: error.response?.data?.message || 'Unable to get profile',
      };
    }
  },

  updateProfile: async (data: any): Promise<AuthResponse> => {
    try {
      const response = await api.put('/api/auth/profile', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Update failed',
        error: error.response?.data?.message || 'Unable to update profile',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('cuet_bus_token');
    localStorage.removeItem('cuet_bus_user');
  },
};
