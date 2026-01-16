export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, backoff = 1000): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (response.ok) {
      return response;
    }

    if (retries > 0 && (response.status === 429 || response.status >= 500)) {
      const jitter = Math.random() * 500;
      await delay(backoff + jitter);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      const jitter = Math.random() * 500;
      await delay(backoff + jitter);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}
