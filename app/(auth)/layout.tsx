'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

/** Guards auth routes — redirects logged-in users away to /chat */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/chat');
    }
  }, [isAuthenticated, isReady, router]);

  // Don't flash the auth form if user is already authenticated
  if (!isReady || isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
