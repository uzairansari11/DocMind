'use client';

import { use } from 'react';
import { PodcastPlayer } from '@/components/podcast/podcast-player';

export default function PodcastIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PodcastPlayer id={id} />;
}
