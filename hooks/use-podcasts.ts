import { useQuery } from '@tanstack/react-query';
import { fetchPodcasts } from '@/lib/podcasts';

export function usePodcasts() {
  return useQuery({
    queryKey: ['podcasts'],
    queryFn: fetchPodcasts,
  });
}
