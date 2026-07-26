'use client';

import { useAuth } from '@/components/providers/auth-provider';

export function ProfileCard() {
  const { user } = useAuth();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';

  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
          {displayName[0] ?? user?.email?.[0] ?? 'U'}
        </div>
        <div>
          <p className="font-medium text-white">{displayName}</p>
          <p className="text-sm text-slate-400">{user?.email ?? 'No email provided'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-3 text-sm text-slate-400">
        Signed in to your document workspace.
      </div>
    </div>
  );
}
