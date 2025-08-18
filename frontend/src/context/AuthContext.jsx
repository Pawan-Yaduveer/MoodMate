import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('moodmate_token');
    if (stored) {
      setToken(stored);
      setAuthToken(stored);
    }
  }, []);

  function login(nextToken, nextUser) {
    localStorage.setItem('moodmate_token', nextToken);
    setToken(nextToken);
    setUser(nextUser || null);
    setAuthToken(nextToken);
  }

  function logout() {
    localStorage.removeItem('moodmate_token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }

  const value = useMemo(() => ({ token, user, login, logout, api }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

