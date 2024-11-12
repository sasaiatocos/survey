import Cookies from 'js-cookie';

export const setAuthCookie = (token: string) => {
  Cookies.set('token', token, { expires: 1 });
};

export const getAuthCookie = (): string | undefined => {
  return Cookies.get('token');
};

export const removeAuthCookie = () => {
  Cookies.remove('token');
};

export const getUserRole = (): string | undefined => {
  const token = getAuthCookie();
  if (!token) return undefined;

  const decoded = JSON.parse(atob(token.split('.')[1]));
  return decoded?.role;
};