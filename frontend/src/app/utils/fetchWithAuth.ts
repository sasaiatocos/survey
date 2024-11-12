import { getAuthCookie, removeAuthCookie } from './auth';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthCookie();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, options);
  if (response.status === 401) {
    removeAuthCookie();
  }
  return response.json();
};
