import { cn } from '@/lib/utils';
import * as React from 'react';

type SectionShellProps = {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionShell({ eyebrow, title, action, children, className }: SectionShellProps) {
  return (
    <section className={cn('flex flex-col h-full', className)}>
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-in fade-in duration-500">
        <div className="space-y-1">
          <p className="text-[10px] font-normal text-muted-foreground uppercase tracking-wider">{eyebrow}</p>
          <h1 className="text-2xl font-normal tracking-tight text-foreground">{title}</h1>
        </div>
        {action && <div className="shrink-0 mt-4 sm:mt-0">{action}</div>}
      </header>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </section>
  );
}
