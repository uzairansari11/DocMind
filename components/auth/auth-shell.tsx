import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import type { ReactNode } from 'react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  footerLabel: string;
  footerHref: string;
  footerAction: string;
  children: ReactNode;
};

const authWorkflow = [
  { icon: '↑', label: 'Upload' },
  { icon: '≡', label: 'Chunk' },
  { icon: '✦', label: 'Embed' },
  { icon: 'AI', label: 'Answer' },
];

export function AuthShell({
  eyebrow,
  title,
  description,
  footerLabel,
  footerHref,
  footerAction,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 sm:px-6">

        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
              <Logo className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DocuMind</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>
        </header>

        {/* Body */}
        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-2 lg:py-16">

          {/* Left — product pitch */}
          <section className="hidden lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Intelligent document workspace
            </span>

            <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Search less.{' '}
              <span className="text-primary">Understand more.</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              Sign in to turn your documents into a searchable knowledge base. Retrieve trusted
              context and generate answers grounded in your selected sources.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {['Document collections', 'Grounded responses', 'Conversation history'].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <span className="text-primary">✓</span>
                  {item}
                </span>
              ))}
            </div>

            {/* Process preview */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                </div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Document processing
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="text-[9px] text-primary">Live</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-[9px] font-semibold text-destructive">
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <p className="truncate text-[10px] font-medium text-foreground">product-research.pdf</p>
                    <span className="text-[9px] text-primary">Processing</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                    <div className="h-full w-3/4 rounded-full bg-primary transition-all" />
                  </div>
                </div>
              </div>

              <div className="relative mt-4 px-2">
                <div className="absolute left-[10%] right-[10%] top-4 h-px bg-border" />
                <div className="relative z-10 grid grid-cols-4">
                  {authWorkflow.map((step) => (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-[8px] font-semibold text-muted-foreground">
                        {step.icon}
                      </div>
                      <p className="mt-2 text-[8px] text-muted-foreground">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Right — auth form */}
          <section className="mx-auto w-full max-w-[440px]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {eyebrow}
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                      <path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Z" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                    Encrypted
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>

              {children}

              <div className="mt-6 border-t border-border pt-5 text-center">
                <p className="text-sm text-muted-foreground">
                  {footerLabel}{' '}
                  <Link
                    href={footerHref}
                    className="font-medium text-primary transition hover:underline"
                  >
                    {footerAction}
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-5 text-[9px] uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="text-primary">✓</span>
                Secure session
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <span className="text-primary">✓</span>
                Protected access
              </span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
