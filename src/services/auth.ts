import api from './api';
import { User, UserRole } from '@/data/types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string | null;
    requiresVerification?: boolean;
    verificationIdentifier?: string | null;
  };
  error?: string;
}

export interface VerifyEmailRequest {
  identifier: string;
  code: string;
}

export interface ResendVerificationCodeRequest {
  identifier: string;
}

export interface VerificationStatusResponse {
  username: string;
  email: string;
  isVerified: boolean;
}

export interface VerificationStatusRequest {
  identifier: string;
}

export interface VerificationStatusApiResponse {
  success: boolean;
  message: string;
  data?: VerificationStatusResponse;
  error?: string;
}

// Auth API calls
export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/login', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Login failed',
        error: error.response?.data?.error || error.response?.data?.message || error.message || 'Invalid credentials',
      };
    }
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

  verifyEmail: async (request: VerifyEmailRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/verify-email', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Email verification failed',
        error: error.response?.data?.error || error.response?.data?.message || error.message || 'Invalid verification code',
      };
    }
  },

  resendVerificationCode: async (request: ResendVerificationCodeRequest): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      const response = await api.post('/api/auth/resend-verification-code', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to resend verification code',
        error: error.response?.data?.error || error.response?.data?.message || error.message || 'Unable to resend code',
      };
    }
  },

  getVerificationStatus: async (request: VerificationStatusRequest): Promise<VerificationStatusApiResponse> => {
    try {
      const response = await api.post('/api/auth/verification-status', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch verification status',
        error: error.response?.data?.error || error.response?.data?.message || error.message || 'Unable to check verification status',
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
