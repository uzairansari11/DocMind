import { ThemeToggle } from '@/components/common/theme-toggle';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Logo } from '@/components/common/logo';
import Link from 'next/link';

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

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <AnimatedBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Header ── */}
        <header className="flex h-16 items-center justify-between border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
              <Logo className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DocuMind</span>
            <span className="hidden rounded-full border border-border bg-muted px-2 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground sm:inline">
              Document AI
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </header>

        {/* ── Hero ── */}
        <section className="grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              AI-powered document intelligence
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your documents.{' '}
              <span className="text-primary">Intelligent answers.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              Transform static PDFs into a searchable knowledge workspace. Upload documents, select
              trusted sources, and receive answers grounded in your own content.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 hover:-translate-y-0.5"
              >
                Create free account
              </Link>
              <Link
                href="/chat"
                className="group rounded-xl border border-border bg-muted/40 px-5 py-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:bg-accent"
              >
                Open workspace{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="mt-10 grid max-w-sm grid-cols-3 divide-x divide-border border-y border-border py-4">
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
            </div>
          </div>

          {/* Preview card */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  RAG Processing Pipeline
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="text-[10px] text-primary">Live</span>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {/* Upload row */}
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-[10px] font-bold text-destructive">
                    PDF
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-xs font-medium">company-research-report.pdf</p>
                      <span className="text-[10px] text-primary">Processing</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full w-4/5 animate-pulse rounded-full bg-primary" />
                    </div>
                  </div>
                </div>

                {/* Pipeline */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20 px-3 py-5">
                  <div className="absolute left-[8%] right-[8%] top-[2.1rem] h-px bg-border" />
                  <div className="relative z-10 grid grid-cols-6 gap-1">
                    {pipelineStages.map((stage, i) => (
                      <div key={stage.title} className="flex flex-col items-center text-center">
                        <div 
                          className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[9px] font-semibold text-primary"
                          style={{ animationDelay: `${i * 300}ms` }}
                        >
                          {stage.short}
                        </div>
                        <p className="mt-2 text-[9px] text-muted-foreground">{stage.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Query */}
                <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                  <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">User question</p>
                  <p className="mt-2 text-xs leading-5 text-foreground">
                    What are the main risks mentioned in the report?
                    <span className="ml-1 inline-block h-3 w-px animate-pulse bg-primary" />
                  </p>
                </div>

                {/* Answer */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[8px] font-bold text-primary-foreground">
                      AI
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-primary/70">Grounded answer</span>
                    <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[8px] text-muted-foreground">
                      4 sources
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-1.5 w-full animate-pulse rounded-full bg-primary/20" />
                    <div className="h-1.5 w-11/12 animate-pulse rounded-full bg-primary/20" style={{ animationDelay: '200ms' }} />
                    <div className="h-1.5 w-3/4 animate-pulse rounded-full bg-primary/20" style={{ animationDelay: '400ms' }} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {['Page 12', 'Page 18', 'Page 31'].map((src) => (
                      <span key={src} className="rounded-md border border-border bg-muted px-2 py-0.5 text-[8px] text-muted-foreground">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pipeline steps ── */}
        <section className="border-t border-border py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-widest text-primary">
              How DocuMind works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              From PDF to reliable answer
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Every question moves through a complete retrieval pipeline, ensuring the final
              response uses relevant information from your selected documents.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pipelineStages.map((stage) => (
              <article
                key={stage.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="absolute right-4 top-2 text-6xl font-bold tracking-tighter text-muted/40 transition group-hover:text-primary/10">
                  {stage.number}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-xs font-semibold text-muted-foreground transition group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                  {stage.short}
                </div>
                <p className="mt-5 text-[9px] uppercase tracking-widest text-muted-foreground">
                  Step {stage.number}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.description}</p>
                <div className="mt-5 h-px w-full overflow-hidden bg-border">
                  <div className="h-full w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-t border-border py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Built for focused research
              </p>
              <h2 className="mt-4 max-w-xs text-3xl font-semibold tracking-tight">
                Everything you need to understand your documents.
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
                One clean workspace for managing documents, retrieving context, asking questions,
                and continuing conversations.
              </p>
              <Link
                href="/signup"
                className="group mt-7 inline-flex items-center text-sm font-medium text-primary transition hover:underline"
              >
                Start exploring{' '}
                <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group bg-card p-6 transition duration-300 hover:bg-muted/50"
                >
                  <span className="font-mono text-[10px] text-primary/60">{feature.icon}</span>
                  <h3 className="mt-4 text-sm font-semibold transition group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-20">
          <div className="overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center sm:px-10">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Your documents already contain the answer
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Start asking better questions.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              Create your first collection, upload a PDF, and turn your document library into an
              intelligent research workspace.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 hover:-translate-y-0.5"
            >
              Create your workspace
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="flex flex-col gap-2 border-t border-border py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DocuMind</p>
          <p>Document-grounded intelligence.</p>
        </footer>
      </div>
    </main>
  );
}
