import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VerifyEmailLocationState {
  identifier?: string;
  message?: string;
}

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as VerifyEmailLocationState) || {};

  const [identifier, setIdentifier] = useState(state.identifier || '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(state.message || 'Enter the 6-digit verification code sent to your email.');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!state.identifier && !identifier) {
      setMessage('Please provide your username or email and verify your account.');
    }
  }, [state.identifier, identifier]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!identifier.trim()) {
      setError('Username or email is required.');
      return;
    }

    if (code.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    const response = await authService.verifyEmail({ identifier: identifier.trim(), code: code.trim() });

    if (!response.success) {
      setError(response.error || 'Verification failed.');
      setIsVerifying(false);
      return;
    }

    navigate('/signin', {
      state: { message: 'Email verified successfully. Please sign in.' },
    });
  };

  const handleResend = async () => {
    setError('');
    setMessage('');

    if (!identifier.trim()) {
      setError('Username or email is required to resend code.');
      return;
    }

    setIsResending(true);
    const response = await authService.resendVerificationCode({ identifier: identifier.trim() });

    if (response.success) {
      setMessage('A new verification code has been sent to your email.');
    } else {
      setError(response.error || 'Unable to resend verification code.');
    }

    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <img src="/pictures/logo.png.png" alt="CUET Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
          <p className="text-muted-foreground">CUET Transport Section</p>
        </div>

        <Card className="border-0 shadow-soft">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              Complete verification to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              {message && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm text-center">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="identifier">Username or Email</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>

              <Button type="button" variant="outline" className="w-full h-11" onClick={handleResend} disabled={isResending}>
                {isResending ? 'Sending...' : 'Resend Code'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Back to{' '}
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
