// lib/fetcher.ts
// Client-side fetch wrapper with error handling

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
  };
}

export async function fetcher<T = any>(url: string, options?: FetchOptions): Promise<T> {
  const config: RequestInit = {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: options?.cache,
  };

  if (options?.body) {
    config.body = typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

// Specific fetchers for the API endpoints
export async function fetchTokens(): Promise<any> {
  return fetcher('/api/tokens');
}

export async function fetchTokenChart(tokenId: string): Promise<any> {
  return fetcher(`/api/tokens/${tokenId}/chart?days=7`);
}