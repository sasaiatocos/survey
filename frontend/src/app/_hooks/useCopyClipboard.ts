'use client'

import { useCallback, useEffect, useState } from 'react';

export const useCopyClipboard = () => {
  const [hasCopied, setHasCpied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const onCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCpied(true);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err);
        return;
      }

      console.error(err);
      setError(new Error('Failed to copy'));
    }
  }, []);

  useEffect(() => {
    let timeoutId: number | null = null;
    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCpied(false);
      }, 1500);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hasCopied]);

  return {
    onCopy,
    hasCopied,
    isError: !!error,
    error,
  };
};