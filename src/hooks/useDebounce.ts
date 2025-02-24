import { useCallback, useEffect, useRef } from 'react';

interface DebounceOptions {
  delay?: number;
  onError?: (error: Error) => void;
}

export function useDebounce<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  { delay = 500, onError }: DebounceOptions = {}
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  const lastArgsRef = useRef<Parameters<T>>();
  const optimisticResultRef = useRef<any>();

  // Update the callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Store the latest arguments
      lastArgsRef.current = args;

      // Return a promise that resolves when the debounced function executes
      return new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await callbackRef.current(...args);
            optimisticResultRef.current = result;
            resolve(result);
          } catch (error) {
            if (onError && error instanceof Error) {
              onError(error);
            }
            reject(error);
          }
        }, delay);
      });
    },
    [delay, onError]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    execute,
    cancel: useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }, []),
    pending: !!timeoutRef.current,
    lastArgs: lastArgsRef.current,
    optimisticResult: optimisticResultRef.current
  };
}