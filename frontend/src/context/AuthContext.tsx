import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { login as apiLogin, register as apiRegister } from '@/api/auth';
import type { User } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function loadStored(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const { token: t, user: u } = loadStored();
    if (t && u) {
      setToken(t);
      setUser(u);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const res = await apiLogin(email, password);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
      throw e;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const res = await apiRegister(name, email, password);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);

    const USER_QUERY_KEYS = ['cart', 'wishlist', 'orders'];

    queryClient.removeQueries({
      predicate: (query) =>
        USER_QUERY_KEYS.includes(query.queryKey[0] as string),
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
