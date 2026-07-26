'use client';

import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function ChatEmptyState() {
  return (
    <Card className="h-full w-full flex flex-col items-center justify-center border-border/40 shadow-sm bg-card">
      <div className="flex flex-col items-center max-w-md text-center space-y-4 p-6">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-normal tracking-tight">Your AI Knowledge Assistant</h2>
        <p className="text-muted-foreground leading-relaxed">
          Select a recent chat from the sidebar or start a new conversation to begin querying your documents and collections.
        </p>
      </div>
    </Card>
  );
}
