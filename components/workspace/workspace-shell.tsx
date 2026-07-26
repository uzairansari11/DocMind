'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';

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
  PanelLeftOpen
} from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

const navItems = [
  { href: '/chat',        label: 'Chat',        icon: MessageSquare },
  { href: '/collections', label: 'Collections', icon: BookOpen },
  { href: '/documents',   label: 'Documents',   icon: FileText },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 border border-primary/20">
              <Logo className="h-4 w-4" />
            </div>
            <p className="text-sm font-normal tracking-tight">DocuMind</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* ── Mobile nav menu (Overlay) ────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 mt-14 bg-background lg:hidden animate-in fade-in zoom-in-95 duration-200 border-t border-border">
          <nav className="flex flex-col gap-1 p-4 h-full overflow-y-auto pb-24">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="mt-auto pt-8">
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    />
                  }
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
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
          </nav>
        </div>
      )}

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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-sm">
                  <Logo className="h-5 w-5" />
                </div>
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
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden bg-background relative">
        {/* Toggle Button when sidebar is closed */}
        <button
          onClick={() => setIsDesktopSidebarOpen(true)}
          className={cn(
            "absolute top-4 left-4 z-50 hidden lg:flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background shadow-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300",
            isDesktopSidebarOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
          )}
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
        <div className={cn("flex-1 overflow-y-auto scroll-smooth", pathname.startsWith('/chat') ? "p-0" : "p-4 sm:p-6 lg:p-8")}>
          <div className={cn("h-full animate-in fade-in duration-500", pathname.startsWith('/chat') ? "w-full max-w-none" : "mx-auto max-w-7xl")}>
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
