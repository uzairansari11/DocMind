'use client';

import { AuthShell } from '@/components/auth/auth-shell';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerRequest, loginRequest } from '@/lib/auth';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerRequest({ firstName, lastName, email, password });
      const loginResponse = await loginRequest({ email, password });
      login({ token: loginResponse.accessToken, user: loginResponse.user });
      toast.success('Account created successfully');
      router.push('/chat');
    } catch (error) {
      toast.error('Signup failed', { description: error instanceof Error ? error.message : 'Please check your information and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Get Started"
      title="Create an account"
      description="Sign up to start chatting with your knowledge base"
      footerLabel="Already have an account?"
      footerHref="/login"
      footerAction="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="firstName">
              First name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="lastName">
              Last name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="email">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="h-11 w-full mt-2">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Creating account…
            </span>
          ) : (
            'Create account →'
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
