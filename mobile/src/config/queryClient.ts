import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { buildUrlFromQueryKey } from '@/lib/api';

async function throwIfNotOk(response: Response) {
  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${text}`);
  }
}

type UnauthorizedBehavior = 'returnNull' | 'throw';

export const getQueryFn =
  ({ on401 }: { on401: UnauthorizedBehavior }): QueryFunction =>
  async ({ queryKey }) => {
    const url = buildUrlFromQueryKey(queryKey);
    const response = await fetch(url);

    if (on401 === 'returnNull' && response.status === 401) {
      return null;
    }

    await throwIfNotOk(response);
    if (response.status === 204) {
      return null;
    }
    return response.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      staleTime: Infinity,
      gcTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
