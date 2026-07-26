import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, timeout);
      } catch (error) {
        console.error('Failed to copy to clipboard', error);
      }
    },
    [timeout]
  );

  return { isCopied, copyToClipboard };
}
