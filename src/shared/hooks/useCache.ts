import { useState, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheItem<any>>();

export function useCache<T>(
  key: string,
  fetchData: () => Promise<T>,
  options = { expiry: CACHE_EXPIRY }
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAndCacheData = async () => {
      try {
        // Check cache first
        const cachedItem = cache.get(key);
        if (cachedItem && Date.now() - cachedItem.timestamp < options.expiry) {
          setData(cachedItem.data);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const freshData = await fetchData();
        
        // Update cache
        cache.set(key, {
          data: freshData,
          timestamp: Date.now()
        });
        
        setData(freshData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    };

    fetchAndCacheData();
  }, [key, fetchData, options.expiry]);

  return { data, loading, error };
}

// Helper function to manually clear cache
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Helper function to manually update cache
export function updateCache<T>(key: string, data: T) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
} 