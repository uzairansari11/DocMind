'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

/** Guards app routes — redirects unauthenticated users to /login */
export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isReady, router]);

  // Spinner while auth state hydrates from localStorage
  if (!isReady) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <WorkspaceShell logout={logout}>{children}</WorkspaceShell>;
}
