import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

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
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-16 items-center justify-between border-b border-border/50"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Logo className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DocuMind</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 hidden sm:inline-flex rounded-lg")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>
        </motion.header>

        {/* Body */}
        <div className="grid flex-1 items-center gap-8 py-8 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-16">
          {/* Left — product pitch */}
          <motion.section 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Intelligent document workspace
              </span>

              <h1 className="mt-8 max-w-md text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                Search less.<br />
                <span className="text-primary">Understand more.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Sign in to turn your documents into a searchable knowledge base. Retrieve trusted
                context and generate answers grounded in your selected sources.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Document collections', 'Grounded responses', 'Conversation history'].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm"
                >
                  <span className="text-primary font-bold">✓</span>
                  {item}
                </span>
              ))}
            </div>

            {/* Process preview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-12 overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-md p-5 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                  Document processing
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="text-[10px] text-primary font-medium">Live</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3 mb-2">
                    <p className="truncate text-xs font-medium text-foreground">product-research.pdf</p>
                    <span className="text-[10px] text-primary">Processing</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                    <div className="h-full w-3/4 animate-pulse rounded-full bg-primary" />
                  </div>
                </div>
              </div>

              <div className="relative mt-6 px-2 pb-2">
                <div className="absolute left-[10%] right-[10%] top-4 h-px bg-border/50" />
                <div className="relative z-10 grid grid-cols-4 gap-2">
                  {authWorkflow.map((step, i) => (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-card text-[10px] font-bold text-muted-foreground shadow-sm">
                        {step.icon}
                      </div>
                      <p className="mt-3 text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Right — auth form */}
          <motion.section 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3, delay: 0.1 }}
            className="mx-auto w-full max-w-[440px] px-2 sm:px-0"
          >
            <div className="relative rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-6 shadow-2xl sm:p-10">
              <div className="absolute -inset-0.5 rounded-[1.4rem] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-[9px] font-medium uppercase tracking-widest text-muted-foreground shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      {eyebrow}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-primary">
                        <path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Encrypted
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
                  <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-muted-foreground">{description}</p>
                </div>

                {children}

                <div className="mt-8 border-t border-border/50 pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {footerLabel}{' '}
                    <Link
                      href={footerHref}
                      className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                    >
                      {footerAction}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-bold">✓</span>
                Secure session
              </span>
              <span className="h-1 w-1 rounded-full bg-border/80" />
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-bold">✓</span>
                Protected access
              </span>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
