import { API_BASE_URL } from '@/config/api';

const normalizePath = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/${path}`;
};

export async function apiRequest<TResponse>(
  method: string,
  path: string,
  data?: unknown,
): Promise<TResponse> {
  const url = normalizePath(path);

  const response = await fetch(url, {
    method,
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText || response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function fetchJson<T>(path: string): Promise<T> {
  return apiRequest<T>('GET', path);
}

export function buildUrlFromQueryKey(queryKey: readonly unknown[]): string {
  const serialized = queryKey
    .map((segment) => {
      if (segment == null) {
        return '';
      }
      if (typeof segment === 'string') {
        return segment.replace(/^\//, '');
      }
      return String(segment);
    })
    .filter(Boolean)
    .join('/');

  if (!serialized) {
    return API_BASE_URL;
  }

  return normalizePath(`/${serialized}`);
}
