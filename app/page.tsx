"use client";

import { ThemeToggle } from '@/components/common/theme-toggle';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Folder, BookOpen, Wand2, Lightbulb, Rocket, Sparkles } from 'lucide-react';

const pipelineStages = [
  { number: '01', short: '↑', title: 'Upload',   description: 'Add PDF documents' },
  { number: '02', short: 'T', title: 'Extract',  description: 'Read document text' },
  { number: '03', short: '≡', title: 'Chunk',    description: 'Split into sections' },
  { number: '04', short: '✦', title: 'Embed',    description: 'Create vectors' },
  { number: '05', short: '⌕', title: 'Retrieve', description: 'Find relevant context' },
  { number: '06', short: 'AI', title: 'Answer',  description: 'Generate a response' },
];

const features = [
  {
    icon: '01',
    title: 'Organized collections',
    description: 'Group related PDFs into separate knowledge bases for different projects, teams, or topics.',
  },
  {
    icon: '02',
    title: 'Source-controlled search',
    description: 'Select exactly which documents the assistant is allowed to use before asking a question.',
  },
  {
    icon: '03',
    title: 'Grounded AI answers',
    description: 'Receive focused answers generated from retrieved document context instead of generic data.',
  },
  {
    icon: '04',
    title: 'Streaming responses',
    description: 'See answers appear immediately while the model continues processing the remaining content.',
  },
  {
    icon: '05',
    title: 'Conversation history',
    description: 'Continue previous research sessions without losing your questions, responses, or context.',
  },
  {
    icon: '06',
    title: 'Fast document retrieval',
    description: 'Vector search finds the most relevant passages without reading every document manually.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 12, mass: 0.8 } 
  },
};

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <AnimatedBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-16 items-center justify-between border-b border-border"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Logo className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DocuMind</span>
            <span className="hidden rounded-full border border-border bg-muted px-2 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground sm:inline">
              Document AI
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-xs sm:text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </motion.header>

        {/* ── Hero ── */}
        <section className="grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              AI-powered document intelligence
            </motion.span>

            <motion.h1 variants={itemVariants} className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your documents.<br />
              <span className="text-primary">Intelligent answers.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
              Transform static PDFs into a searchable knowledge workspace. Upload documents, select
              trusted sources, and receive answers grounded in your own content.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-90"
              >
                Let's get started! <Rocket className="h-5 w-5" />
              </Link>
              <Link
                href="/chat"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white/50 dark:bg-black/50 px-6 py-3.5 text-base font-bold text-foreground backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-accent hover:shadow-lg active:scale-90"
              >
                Open workspace{' '}
                <Sparkles className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 grid max-w-sm grid-cols-3 divide-x divide-border border-y border-border py-4">
              {[
                { label: 'Documents', value: 'PDF' },
                { label: 'Retrieval',  value: 'Vector' },
                { label: 'Responses', value: 'Live' },
              ].map((stat) => (
                <div key={stat.label} className="pl-4 first:pl-0">
                  <p className="text-base font-semibold text-foreground">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Playful Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 1, type: "spring", bounce: 0.5 }}
            className="hidden lg:flex relative items-center justify-center min-h-[500px]"
          >
            {/* Center Robot / Brain */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-20"
            >
              <div className="w-64 h-64 bg-white dark:bg-card rounded-[3rem] shadow-2xl flex items-center justify-center border-4 border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary drop-shadow-md">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
                  <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" className="text-pink-400" />
                </svg>
                {/* Cheeks */}
                <div className="absolute top-[65%] left-[25%] w-4 h-2 bg-pink-400/50 rounded-full blur-[2px]" />
                <div className="absolute top-[65%] right-[25%] w-4 h-2 bg-pink-400/50 rounded-full blur-[2px]" />
              </div>
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[450px] h-[450px] border-2 border-dashed border-primary/20 rounded-full relative">
                {/* Folder */}
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-card p-4 rounded-2xl shadow-xl border-2 border-yellow-400/30 text-yellow-500">
                  <Folder className="w-8 h-8" />
                </motion.div>
                {/* Book */}
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-card p-4 rounded-2xl shadow-xl border-2 border-pink-400/30 text-pink-500">
                  <BookOpen className="w-8 h-8" />
                </motion.div>
                {/* Magic Wand */}
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute top-1/2 -left-6 -translate-y-1/2 bg-white dark:bg-card p-4 rounded-2xl shadow-xl border-2 border-cyan-400/30 text-cyan-500">
                  <Wand2 className="w-8 h-8" />
                </motion.div>
                {/* Lightbulb */}
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute top-1/2 -right-6 -translate-y-1/2 bg-white dark:bg-card p-4 rounded-2xl shadow-xl border-2 border-emerald-400/30 text-emerald-500">
                  <Lightbulb className="w-8 h-8" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Pipeline steps ── */}
        <section className="border-t border-border py-16 sm:py-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <motion.p variants={itemVariants} className="text-[10px] font-medium uppercase tracking-widest text-primary">
              How DocuMind works
            </motion.p>
            <motion.h2 variants={itemVariants} className="mt-4 text-3xl font-semibold tracking-tight">
              From PDF to reliable answer
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every question moves through a complete retrieval pipeline, ensuring the final
              response uses relevant information from your selected documents.
            </motion.p>
          </motion.div>

          <div className="relative mx-auto max-w-4xl pt-10">
            {/* The central animated pipe */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-border/40 sm:left-1/2 sm:-translate-x-1/2 overflow-hidden rounded-full">
              <motion.div 
                animate={{ y: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent"
              />
            </div>

            <div className="flex flex-col gap-12 sm:gap-24 relative z-10">
              {pipelineStages.map((stage, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={stage.title}
                    initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1, duration: 0.7, type: "spring", bounce: 0.4 }}
                    className={`relative flex items-center ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                  >
                    {/* Node on the pipe */}
                    <div className="absolute left-6 sm:left-1/2 w-10 h-10 -translate-x-1/2 rounded-full border-4 border-background bg-primary z-20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                       <span className="text-[12px] font-bold text-primary-foreground">{stage.number}</span>
                    </div>

                    {/* Content Card */}
                    <div className={`w-full pl-16 sm:w-1/2 sm:px-12 ${isEven ? 'sm:text-right' : 'sm:text-left'}`}>
                      <div className="group relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:bg-card">
                        
                        <div className={`flex items-center gap-4 mb-4 ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
                            {stage.short}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold transition-colors">
                              Step {stage.number}
                            </p>
                            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stage.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
                        
                        {/* Decorative background number */}
                        <div className={`absolute -bottom-4 text-8xl font-black text-muted/10 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/5 pointer-events-none ${isEven ? '-left-4' : '-right-4'}`}>
                          {stage.number}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-t border-border py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.p variants={itemVariants} className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Built for focused research
              </motion.p>
              <motion.h2 variants={itemVariants} className="mt-4 max-w-sm text-3xl font-semibold tracking-tight sm:text-4xl leading-tight">
                Everything you need to understand your documents.
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-4 max-w-sm text-sm sm:text-base leading-relaxed text-muted-foreground">
                One clean workspace for managing documents, retrieving context, asking questions,
                and continuing conversations.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  href="/signup"
                  className="group mt-8 inline-flex items-center text-sm font-medium text-primary transition hover:opacity-80"
                >
                  Start exploring{' '}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border/50 sm:grid-cols-2 shadow-sm"
            >
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group bg-card p-6 sm:p-8 transition duration-300 hover:bg-muted/30"
                >
                  <span className="font-mono text-[10px] font-medium text-primary/60">{feature.icon}</span>
                  <h3 className="mt-4 text-base font-semibold transition group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-16 sm:pb-24 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-10 shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <p className="relative z-10 text-[10px] uppercase tracking-widest text-primary font-medium">
              Your documents already contain the answer
            </p>
            <h2 className="relative z-10 mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              Start asking better questions.
            </h2>
            <p className="relative z-10 mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
              Create your first collection, upload a PDF, and turn your document library into an
              intelligent research workspace.
            </p>
            <Link
              href="/signup"
              className="relative z-10 mt-8 inline-flex rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/30 active:scale-95"
            >
              Create your workspace
            </Link>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer className="flex flex-col items-center gap-4 border-t border-border py-8 text-xs text-muted-foreground sm:flex-row sm:justify-between text-center sm:text-left">
          <p>© {new Date().getFullYear()} DocuMind. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            Document-grounded intelligence.
          </p>
        </footer>
      </div>
    </main>
  );
}
