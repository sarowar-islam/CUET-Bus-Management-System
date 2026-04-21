import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationState {
  identifier?: string;
  message?: string;
}

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = (location.state || {}) as LocationState;
  const initialIdentifier = locationState.identifier || '';

  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [code, setCode] = useState('');
  const [info, setInfo] = useState(locationState.message || 'Enter your email/username and the 6-digit verification code.');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const { verifyEmail, resendVerificationCode, getVerificationStatus } = useAuth();

  const canSubmit = useMemo(() => identifier.trim().length > 0 && code.trim().length === 6, [identifier, code]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!canSubmit) {
      setError('Enter a valid identifier and 6-digit code.');
      return;
    }

    setIsVerifying(true);
    const result = await verifyEmail(identifier.trim(), code.trim());
    setIsVerifying(false);

    if (result.success) {
      navigate('/dashboard');
      return;
    }

    setError(result.error || 'Verification failed. Please try again.');
  };

  const handleResend = async () => {
    setError('');
    setInfo('');

    if (!identifier.trim()) {
      setError('Enter your email or username first.');
      return;
    }

    setIsResending(true);
    const result = await resendVerificationCode(identifier.trim());
    setIsResending(false);

    if (result.success) {
      setInfo('A new verification code has been sent to your email.');
      return;
    }

    setError(result.error || 'Unable to resend verification code.');
  };

  const handleCheckStatus = async () => {
    setError('');
    setInfo('');

    if (!identifier.trim()) {
      setError('Enter your email or username first.');
      return;
    }

    setIsCheckingStatus(true);
    const result = await getVerificationStatus(identifier.trim());
    setIsCheckingStatus(false);

    if (!result.success) {
      setError(result.error || 'Unable to check verification status.');
      return;
    }

    if (result.isVerified) {
      setInfo('Your email is already verified. You can sign in now.');
      return;
    }

    setInfo('Your account is not verified yet. Please enter your code or request a new one.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-0 shadow-soft">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              Verify your account before entering the portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              {info && !error && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm text-center">
                  {info}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Username</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter email or username"
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
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={isVerifying || !canSubmit}>
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={handleResend} disabled={isResending}>
                  {isResending ? 'Sending...' : 'Resend Code'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCheckStatus} disabled={isCheckingStatus}>
                  {isCheckingStatus ? 'Checking...' : 'Check Status'}
                </Button>
              </div>

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
