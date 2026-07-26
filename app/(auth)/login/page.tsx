'use client';

import { AuthShell } from '@/components/auth/auth-shell';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginRequest } from '@/lib/auth';
import { loginSchema, type LoginValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login({ token: data.accessToken, user: data.user });
      router.push('/chat');
    },
    onError: () => {
      setServerError('Incorrect email or password. Please try again.');
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const isPending = isSubmitting || mutation.status === 'pending';

  return (
    <AuthShell
      eyebrow="Secure access"
      title="Welcome back"
      description="Sign in to your document intelligence workspace."
      footerLabel="New to DocuMind?"
      footerHref="/signup"
      footerAction="Create an account"
    >
      <form onSubmit={handleSubmit((v) => { setServerError(null); mutation.mutate(v); })} className="space-y-4" noValidate>

        {/* Email */}
        <div>
          <label htmlFor="login-email" className="mb-2 block text-xs font-medium text-muted-foreground">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              {...register('email')}
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              className="pl-10"
            />
          </div>
          {errors.email && <FieldError message={errors.email.message} />}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="mb-2 block text-xs font-medium text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              {...register('password')}
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              className="pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <FieldError message={errors.password.message} />}
        </div>

        {/* Server error */}
        {serverError && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
            <span className="mt-0.5 shrink-0">⚠</span>
            {serverError}
          </div>
        )}

        <Button type="submit" disabled={isPending} className="h-11 w-full">
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Signing in…
            </span>
          ) : (
            'Sign in to workspace →'
          )}
        </Button>
      </form>
    </AuthShell>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-destructive">{message}</p>;
}
