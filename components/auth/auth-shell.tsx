import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeToggle } from '@/components/common/theme-toggle';
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
    <main className="flex min-h-[100dvh] w-full bg-background text-foreground">
      {/* ── Left Column: Form ────────────────────────────────────────────── */}
      <div className="flex w-full flex-col lg:w-1/2 xl:w-[45%]">
        {/* Mobile / Tablet Header */}
        <header className="flex h-20 items-center justify-between px-6 sm:px-10 lg:px-12">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Logo className="h-7 w-7" />
            <span className="text-lg font-medium tracking-tight">DocuMind</span>
          </Link>
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Form Container */}
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[420px] mx-auto lg:mx-0"
          >
            <div className="mb-8">
              <span className="mb-4 inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {eyebrow}
              </span>
              <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-8">
              {children}
            </div>

            <p className="mt-10 text-center lg:text-left text-sm text-muted-foreground">
              {footerLabel}{' '}
              <Link
                href={footerHref}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {footerAction}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Right Column: Visual / Marketing ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-1 relative bg-zinc-950 flex-col items-center justify-center overflow-hidden">
        {/* Abstract Topography / Grid Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
        </div>

        {/* Desktop Controls */}
        <div className="absolute top-8 right-10 z-50 flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white backdrop-blur-md"
            )}
          >
            Back to home
          </Link>
        </div>

        {/* Marketing Content */}
        <div className="relative z-10 w-full max-w-lg px-8 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              DocuMind Enterprise
            </div>
            <h2 className="text-4xl font-medium leading-[1.15] tracking-tight text-zinc-50">
              Transform static documents into dynamic intelligence.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Stop searching for answers. Simply ask your documents. Our advanced RAG engine guarantees accurate, context-grounded responses every single time.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8">
              {[
                { label: "Semantic Search", desc: "Find exact meaning, not just keywords." },
                { label: "Instant Citations", desc: "Verify answers with direct source links." },
                { label: "Secure Storage", desc: "End-to-end encryption for your data." },
                { label: "Smart Chunking", desc: "Optimized retrieval for high accuracy." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-200">{feature.label}</span>
                  <span className="mt-1.5 text-xs text-zinc-500">{feature.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

