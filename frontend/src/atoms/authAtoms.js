import { atom, useAtom, useSetAtom } from 'jotai';

// Base atoms
const tokenAtom = atom(
  typeof window !== 'undefined' ? localStorage.getItem('token') || null : null
);

const currentUserAtom = atom(null);

// Derived auth state
const isAuthenticatedAtom = atom((get) => !!get(tokenAtom));

// Main auth hook
export const useAuth = () => {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(currentUserAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  // Login action
  // Accepts { accessToken, user } from backend
  const login = (loginResponse) => {
    const { accessToken, user } = loginResponse;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(accessToken);
    setUser(user);
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Update user
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // Helper to decode base64url (JWT) safely
  function safeBase64Decode(str) {
    // Replace '-' with '+', '_' with '/', pad with '='
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    try {
      return atob(str);
    } catch (e) {
      console.error('Base64 decode error:', e);
      return '';
    }
  }

  // Token expiration check
  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(safeBase64Decode(base64Payload));
      if (payload.exp) {
        return Date.now() >= payload.exp * 1000;
      }
    } catch (e) {
      console.error('Token parsing error:', e);
    }
    return false;
  };

  // Helper to get token from atom or localStorage
  const getToken = () => token || localStorage.getItem('token');
  // Helper to get user from atom or localStorage
  const getUser = () => user || JSON.parse(localStorage.getItem('user'));

  return {
    token: getToken(),
    user: getUser(),
    isAuthenticated,
    isTokenExpired: isTokenExpired(),
    login,
    logout,
    updateUser,
    getUser,
    getToken
  };
};