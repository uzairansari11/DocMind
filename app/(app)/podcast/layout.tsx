'use client';

import { SectionShell } from '@/components/workspace/section-shell';
import { PodcastSidebar } from '@/components/podcast/podcast-sidebar';

export default function PodcastLayout({ children }: { children: React.ReactNode }) {
  return (
    <SectionShell eyebrow="Studio" title="Podcast Generation" className="h-full min-h-[calc(100vh-8rem)]">
      <div className="flex h-full min-h-[600px] w-full flex-col md:flex-row gap-4">
        <PodcastSidebar />
        <div className="flex-1 flex flex-col relative bg-card rounded-2xl border-transparent shadow-none overflow-hidden">
          {children}
        </div>
      </div>
    </SectionShell>
  );
}
