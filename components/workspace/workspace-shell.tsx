'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { ThemeToggle } from '@/components/common/theme-toggle';

import { fetchCollections } from '@/lib/collections';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Upload,
  User,
  Menu,
  X,
  SquareDashedBottomCode,
  PanelLeftClose,
  PanelLeftOpen,
  Mic,
  Layers
} from 'lucide-react';
import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/chat',        label: 'Chat',        icon: MessageSquare },
  { href: '/podcast',     label: 'Podcast',     icon: Mic },
  { href: '/collections', label: 'Collections', icon: BookOpen },
  { href: '/documents',   label: 'Documents',   icon: FileText },
  { href: '/flashcards',  label: 'Flashcards',  icon: Layers },
  { href: '/upload',      label: 'Upload',      icon: Upload },
  { href: '/profile',     label: 'Profile',     icon: User },
];

type WorkspaceShellProps = {
  children: ReactNode;
  logout: () => void;
};

export function WorkspaceShell({ children, logout }: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';

  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
    retry: false,
  });




  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans flex flex-col lg:flex-row">
      
      {/* ── Mobile top bar ───────────────────────────────────── */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <Logo className="h-6 w-6" />
          <p className="text-sm font-medium tracking-tight">DocuMind</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* ── Mobile Bottom Navigation ───────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 p-2 min-w-[64px] transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative flex items-center justify-center p-1.5 z-10">
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 relative z-10 transition-transform duration-300", active ? "scale-110" : "")} />
              </div>
              <span className={cn(
                "text-[10px] transition-all duration-300",
                active ? "font-semibold" : "font-medium opacity-80"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside 
        className={cn(
          "hidden lg:flex shrink-0 flex-col border-border bg-muted/30 transition-[width,opacity,border] duration-300 ease-in-out overflow-hidden",
          isDesktopSidebarOpen ? "w-[260px] border-r opacity-100" : "w-0 border-r-0 opacity-0"
        )}
      >
        <div className="flex flex-col h-[100dvh] w-[260px]">
            {/* Brand */}
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Logo className="h-6 w-6" />
                <span className="text-sm font-normal tracking-tight">DocuMind</span>
              </div>
              <button
                onClick={() => setIsDesktopSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-border/50"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-8">
            
            {/* Nav */}
            <div className="space-y-1">
              <p className="px-2 text-xs font-normal text-muted-foreground mb-3 uppercase tracking-wider">Menu</p>
              <nav className="space-y-1" aria-label="Primary navigation">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-xs font-normal transition-colors',
                        active
                          ? 'bg-primary/10 text-primary font-normal'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

          </div>

          {/* Footer (Profile & Settings) */}
          <div className="p-4 border-t border-border/50 bg-background/50">
            <div className="flex items-center justify-between mb-4 px-2">
              <ThemeToggle />
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <button
                      type="button"
                      className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Sign out"
                    />
                  }
                >
                  <LogOut className="h-4 w-4" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to sign back in to access your workspace.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-normal text-sm">
                {displayName[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden bg-background relative pb-[calc(env(safe-area-inset-bottom)+4rem)] lg:pb-0">
        {/* Toggle Button when sidebar is closed */}
        <button
          onClick={() => setIsDesktopSidebarOpen(true)}
          className={cn(
            "absolute top-4 left-4 z-50 hidden lg:flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/80 backdrop-blur-sm shadow-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300",
            isDesktopSidebarOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
          )}
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-6 lg:p-8">
          <div className="h-full animate-in fade-in duration-500 mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
