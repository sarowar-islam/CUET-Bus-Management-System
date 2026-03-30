import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Eye, EyeOff, Check, X, Users, GraduationCap, BookOpen, Shield } from 'lucide-react';
import { UserRole } from '@/data/types';

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    {
      role: 'student' as UserRole,
      title: 'Student',
      description: 'Access bus schedules and book rides',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300',
    },
    {
      role: 'teacher' as UserRole,
      title: 'Teacher',
      description: 'Special transport for faculty members',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-green-500/10 hover:bg-green-500/20 border-green-200 hover:border-green-300',
    },
    {
      role: 'staff' as UserRole,
      title: 'Staff',
      description: 'Staff transport management',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-200 hover:border-orange-300',
    },
  ];

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const showPasswordMismatch = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    const result = await signup({ fullName, username, email, password });
    
    if (result.success) {
      navigate('/signin', { state: { message: 'Account created successfully! Please sign in.' } });
    } else {
      setError(result.error || 'Signup failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <img src="/pictures/logo.png.png" alt="CUET Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">CUET Transport Section</h1>
          <p className="text-muted-foreground">Management System</p>
        </div>

        <Card className="border-0 shadow-soft">
          {!selectedRole ? (
            // Role Selection Screen
            <>
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-center">Select Your Role</CardTitle>
                <CardDescription className="text-center">
                  Choose your role to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {roleOptions.map((option) => (
                    <button
                      key={option.role}
                      onClick={() => setSelectedRole(option.role)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${option.color}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-primary mt-1">{option.icon}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-primary hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </CardContent>
            </>
          ) : (
            // Account Creation Form
            <>
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <button
                    onClick={() => {
                      setSelectedRole(null);
                      setError('');
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Change Role
                  </button>
                </div>
                <CardDescription className="text-center">
                  Creating account as <span className="font-semibold text-primary">{selectedRole?.charAt(0).toUpperCase() + selectedRole?.slice(1)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`h-11 pr-10 ${showPasswordMismatch ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {confirmPassword.length > 0 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {passwordsMatch ? (
                            <Check className="w-4 h-4 text-accent" />
                          ) : (
                            <X className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      )}
                    </div>
                    {showPasswordMismatch && (
                      <p className="text-xs text-destructive">Password and Confirm Password do not match.</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={isLoading || showPasswordMismatch}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-primary hover:underline font-medium">
                      Sign In
                    </Link>
                  </p>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
