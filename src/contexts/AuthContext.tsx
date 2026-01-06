import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/data/types';
import { users } from '@/data/dummyData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
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
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check default users
    let foundUser = users.find(u => u.username === username && u.password === password);
    
    // Check registered users in localStorage
    if (!foundUser) {
      const registeredUsers = JSON.parse(localStorage.getItem('cuet_bus_registered_users') || '[]');
      foundUser = registeredUsers.find((u: User) => u.username === username && u.password === password);
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('cuet_bus_user', JSON.stringify(foundUser));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid username or password.' };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    // Check if username exists
    const existingUser = users.find(u => u.username === data.username);
    const registeredUsers = JSON.parse(localStorage.getItem('cuet_bus_registered_users') || '[]');
    const existingRegistered = registeredUsers.find((u: User) => u.username === data.username);

    if (existingUser || existingRegistered) {
      return { success: false, error: 'Username already exists.' };
    }

    // Check if email exists
    const existingEmail = users.find(u => u.email === data.email);
    const existingRegisteredEmail = registeredUsers.find((u: User) => u.email === data.email);

    if (existingEmail || existingRegisteredEmail) {
      return { success: false, error: 'Email already registered.' };
    }

    // Create new user (default to student role)
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: 'student' as UserRole,
      password: data.password,
    };

    registeredUsers.push(newUser);
    localStorage.setItem('cuet_bus_registered_users', JSON.stringify(registeredUsers));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cuet_bus_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
