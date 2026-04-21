import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/data/types';
import { authService } from '@/services/auth';

interface AuthActionResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
  verificationIdentifier?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthActionResult>;
  signup: (data: SignupData) => Promise<AuthActionResult>;
  verifyEmail: (identifier: string, code: string) => Promise<AuthActionResult>;
  resendVerificationCode: (identifier: string) => Promise<{ success: boolean; error?: string }>;
  getVerificationStatus: (identifier: string) => Promise<{ success: boolean; isVerified?: boolean; username?: string; email?: string; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('cuet_bus_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as User;
      if (parsed.isVerified) {
        setUser(parsed);
      } else {
        authService.logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<AuthActionResult> => {
    try {
      const response = await authService.login({ username, password });
      
      if (response.success && response.data) {
        const { user, token, requiresVerification, verificationIdentifier } = response.data;

        if (requiresVerification || !user?.isVerified || !token) {
          return {
            success: false,
            requiresVerification: true,
            verificationIdentifier: verificationIdentifier || user?.email || username,
            error: 'Email not verified. Please verify your email first.',
          };
        }

        setUser(user);
        localStorage.setItem('cuet_bus_user', JSON.stringify(user));
        localStorage.setItem('cuet_bus_token', token);
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (data: SignupData): Promise<AuthActionResult> => {
    try {
      const response = await authService.signup({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      
      if (response.success) {
        return {
          success: true,
          requiresVerification: true,
          verificationIdentifier: response.data?.verificationIdentifier || data.email,
        };
      }
      
      return { success: false, error: response.error || 'Signup failed' };
    } catch (error: any) {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const verifyEmail = async (identifier: string, code: string): Promise<AuthActionResult> => {
    try {
      const response = await authService.verifyEmail(identifier, code);
      if (response.success && response.data?.user && response.data?.token) {
        setUser(response.data.user);
        localStorage.setItem('cuet_bus_user', JSON.stringify(response.data.user));
        localStorage.setItem('cuet_bus_token', response.data.token);
        return { success: true };
      }
      return { success: false, error: response.error || 'Verification failed' };
    } catch (error: any) {
      return { success: false, error: 'An error occurred during verification' };
    }
  };

  const resendVerificationCode = async (identifier: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.resendVerificationCode(identifier);
      if (response.success) {
        return { success: true };
      }
      return { success: false, error: response.error || 'Unable to resend verification code' };
    } catch (error: any) {
      return { success: false, error: 'An error occurred while resending code' };
    }
  };

  const getVerificationStatus = async (identifier: string) => {
    try {
      const response = await authService.getVerificationStatus(identifier);
      if (response.success && response.data) {
        return {
          success: true,
          isVerified: response.data.isVerified,
          username: response.data.username,
          email: response.data.email,
        };
      }
      return { success: false, error: response.error || 'Unable to fetch verification status' };
    } catch (error: any) {
      return { success: false, error: 'An error occurred while checking status' };
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      verifyEmail,
      resendVerificationCode,
      getVerificationStatus,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
