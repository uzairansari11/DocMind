"use client";

import { ThemeToggle } from '@/components/common/theme-toggle';
import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, FileText, Headphones, Play, FastForward, Rewind, Layers, Search, History, Mic2 } from 'lucide-react';

const features = [
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Organized collections',
    description: 'Group related PDFs into separate knowledge bases for different projects, teams, or topics.',
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Source-controlled search',
    description: 'Select exactly which documents the assistant is allowed to use before asking a question.',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Grounded AI answers',
    description: 'Receive focused answers generated from retrieved document context instead of generic data.',
  },
  {
    icon: <History className="w-5 h-5" />,
    title: 'Conversation history',
    description: 'Continue previous research sessions without losing your questions, responses, or context.',
  },
  {
    icon: <Mic2 className="w-5 h-5" />,
    title: 'AI Audio Podcasts',
    description: 'Turn any document into a conversational, two-speaker podcast for on-the-go learning.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground selection:bg-foreground selection:text-background">
      
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-start justify-center overflow-hidden">
        <div className="w-[800px] h-[500px] bg-foreground/5 rounded-full blur-[120px] -translate-y-1/2 opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-16 items-center justify-between border-b border-border/50"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-6 w-6 text-foreground" />
            <span className="text-sm font-semibold tracking-tight">DocuMind</span>
          </Link>

          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Get started
            </Link>
          </nav>
        </motion.header>

        {/* ── Hero ── */}
        <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 flex flex-col items-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.span variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              Document Intelligence Platform
            </motion.span>

            <motion.h1 variants={itemVariants} className="mt-8 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Turn your documents into <br className="hidden sm:block" />
              <span className="text-muted-foreground">answers & podcasts.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              A deeply focused workspace. Upload PDFs, extract context-aware insights through chat, and generate two-speaker conversational podcasts for on-the-go learning.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-3.5 text-base font-semibold text-background shadow-sm transition-all hover:shadow-md hover:bg-foreground/90 active:scale-95"
              >
                Create Workspace
              </Link>
              <Link
                href="/login"
                className="group flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-base font-medium text-foreground transition-all hover:bg-muted active:scale-95"
              >
                Log in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Demonstrative UI Mockup ── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="mt-20 w-full max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden flex flex-col h-[600px]">
              
              {/* Fake Window Controls */}
              <div className="h-12 border-b border-border/50 bg-muted/20 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="mx-auto text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                  DocuMind Workspace
                </div>
              </div>

              {/* Fake App Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-[260px] border-r border-border/50 bg-card p-6 hidden md:flex flex-col gap-6 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Logo className="h-6 w-6" />
                    <span className="font-semibold text-sm">DocuMind</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2 mt-4">Knowledge Base</div>
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted text-sm font-medium">
                      <Layers className="w-4 h-4" /> Collections
                    </div>
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 text-sm font-medium text-muted-foreground">
                      <FileText className="w-4 h-4" /> Documents
                    </div>
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 text-sm font-medium text-muted-foreground">
                      <Mic2 className="w-4 h-4" /> Podcasts
                    </div>
                  </div>

                  <div className="mt-auto p-4 rounded-xl border border-border bg-muted/20">
                    <p className="text-xs font-semibold mb-2">Storage</p>
                    <div className="h-1.5 w-full bg-border rounded-full mb-2 overflow-hidden">
                      <div className="h-full w-2/3 bg-foreground rounded-full" />
                    </div>
                    <p className="text-[10px] text-muted-foreground">4.2 GB of 10 GB used</p>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-muted/10 p-8 sm:p-12 flex flex-col relative">
                  {/* Chat Mockup */}
                  <div className="flex-1 space-y-8 max-w-2xl mx-auto w-full">
                    {/* User Msg */}
                    <div className="flex gap-4 flex-row-reverse">
                       <div className="w-8 h-8 rounded-full bg-card border border-border shrink-0 flex items-center justify-center">
                         <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />
                       </div>
                       <div className="p-4 rounded-2xl rounded-tr-none bg-foreground text-background text-sm shadow-sm">
                         Can you summarize the key financial metrics?
                       </div>
                    </div>
                    {/* System Msg */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center shrink-0">
                        <Logo className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="space-y-3 flex-1 pt-1">
                        <div className="p-5 rounded-2xl rounded-tl-none bg-card border border-border shadow-sm">
                          <p className="text-sm font-medium mb-4">Based on the Q3 Financial Report, here are the key metrics:</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                               <span className="text-sm text-muted-foreground">Total Revenue</span>
                               <span className="text-sm font-semibold">$4.2M <span className="text-emerald-500 text-xs ml-1">(+14%)</span></span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                               <span className="text-sm text-muted-foreground">Operating Margin</span>
                               <span className="text-sm font-semibold">22.5%</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                               <span className="text-sm text-muted-foreground">Customer Acquisition Cost</span>
                               <span className="text-sm font-semibold">$124 <span className="text-emerald-500 text-xs ml-1">(-8%)</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audio Player Mockup Overlay */}
                  <div className="absolute bottom-8 right-8 left-8 md:left-auto md:w-[420px] p-6 rounded-2xl bg-card border border-border shadow-2xl backdrop-blur-xl bg-card/90">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center shadow-inner">
                           <Mic2 className="w-6 h-6" />
                         </div>
                         <div>
                           <h4 className="font-bold text-base leading-tight">Q3 Analysis Podcast</h4>
                           <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">AI GENERATED • 12:45</p>
                         </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                         <Headphones className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                    
                    {/* Simulated Waveform */}
                    <div className="flex items-center gap-1 h-8 mb-6 px-2 opacity-70">
                       {Array.from({ length: 40 }).map((_, i) => (
                         <div key={i} className="flex-1 bg-foreground rounded-full" style={{ height: `${20 + Math.abs(Math.sin(i * 0.5)) * 80}%`, opacity: i < 15 ? 1 : 0.2 }} />
                       ))}
                    </div>

                    <div className="flex justify-between items-center px-4">
                        <Rewind className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                        <div className="w-14 h-14 bg-foreground rounded-full flex items-center justify-center text-background hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-foreground/20">
                          <Play className="w-6 h-6 ml-1" />
                        </div>
                        <FastForward className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Process Grid (How it works) ── */}
        <section className="py-24 border-t border-border/50">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">How it works</p>
            <h2 className="text-3xl font-semibold tracking-tight">From static PDF to interactive knowledge.</h2>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              { num: '01', title: 'Upload & Process', desc: 'Securely upload PDFs. We instantly extract, chunk, and create vector embeddings of the text.' },
              { num: '02', title: 'Chat & Retrieve', desc: 'Ask questions naturally. Every answer is retrieved directly from and grounded in your specific documents.' },
              { num: '03', title: 'Listen & Learn', desc: 'Convert complex research into engaging, conversational two-speaker AI podcasts.' }
            ].map((step) => (
              <div key={step.num} className="bg-card border border-border/50 p-8 rounded-2xl">
                <div className="text-sm font-bold text-foreground mb-4 font-mono">{step.num}</div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className="py-24 border-t border-border/50">
          <div className="grid gap-16 lg:grid-cols-[1fr_2fr] max-w-6xl mx-auto">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Features</p>
              <h2 className="text-3xl font-semibold tracking-tight leading-tight mb-4">
                Everything you need for focused research.
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                A highly refined, distraction-free environment built to help you understand your documents faster.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 rounded-2xl bg-card border border-border/50 transition-colors hover:bg-muted/30">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-foreground mb-5 border border-border">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 border-t border-border/50 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
              Ready to understand your documents?
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-foreground px-8 py-4 text-base font-semibold text-background transition-all hover:bg-foreground/90 active:scale-95"
            >
              Start using DocuMind
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="flex flex-col items-center gap-4 border-t border-border/50 py-10 text-xs text-muted-foreground sm:flex-row sm:justify-between text-center sm:text-left">
          <p>© {new Date().getFullYear()} DocuMind. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-foreground opacity-50" />
            <span>Document Intelligence</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
