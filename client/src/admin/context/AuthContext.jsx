import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/adminApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const setupExpiryWarning = (expiresAt) => {
    if (!expiresAt) return;
    const expiresInMs = expiresAt - Date.now();
    const warnAt = expiresInMs - 5 * 60 * 1000; // 5 minutes before expiry
    if (warnAt > 0) {
      const timer = setTimeout(() => {
        toast('Your session will expire in 5 minutes.', { icon: '⏳' });
      }, warnAt);
      // Clean up timer if needed on re-renders, but since this runs once per login/load it's okay
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    authApi.me()
      .then(data => {
        // Backwards compatibility if data is just the user object
        if (data && data.user) {
          setUser(data.user);
          setupExpiryWarning(data.expiresAt);
        } else {
          setUser(data);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
    setupExpiryWarning(data.expiresAt);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
