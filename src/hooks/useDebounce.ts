import { useCallback, useEffect, useRef } from 'react';

interface DebounceOptions {
  delay?: number;
  onError?: (error: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    { delay = 500, onError }: DebounceOptions = {}
  ) {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const callbackRef = useRef(callback);
    const lastArgsRef = useRef<Parameters<T>>();
    const optimisticResultRef = useRef<ReturnType<T>>();
  
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);
  
    const execute = useCallback(
      (...args: Parameters<T>): Promise<ReturnType<T>> => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
  
        lastArgsRef.current = args;
  
        return new Promise((resolve, reject) => {
          timeoutRef.current = setTimeout(async () => {
            try {
              const result = callbackRef.current(...args);
              if (result instanceof Promise) {
                result.then(resolve).catch((error) => {
                  if (onError) onError(error);
                  reject(error);
                });
              } else {
                resolve(result);
              }
              optimisticResultRef.current = result;
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
      optimisticResult: optimisticResultRef.current,
    };
  }
  