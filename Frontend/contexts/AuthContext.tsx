// contexts/AuthContext.tsx — Estado global de autenticação NaHora
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { authService, type User } from '../services/auth.service';

const TOKEN_KEY = '@nahora:token';
const USER_KEY = '@nahora:user';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'client' | 'entrepreneur'
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega sessão salva no AsyncStorage ao iniciar
  useEffect(() => {
    async function loadSession() {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch {
        // sessão corrompida — ignorar
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const saveSession = useCallback(async (u: User, t: string) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, t),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(u)),
    ]);
    setToken(t);
    setUser(u);
  }, []);

  const navigate = useCallback((u: User) => {
    if (u.role === 'entrepreneur') {
      router.replace('/(entrepreneur)/dashboard');
    } else {
      router.replace('/(client)/home');
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, token: t } = await authService.login(email, password);
    await saveSession(u, t);
    navigate(u);
  }, [saveSession, navigate]);

  const register = useCallback(async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'client' | 'entrepreneur'
  ) => {
    const { user: u, token: t } = await authService.register(name, email, phone, password, role);
    await saveSession(u, t);
    navigate(u);
  }, [saveSession, navigate]);

  const logout = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setToken(null);
    setUser(null);
    router.replace('/(auth)/login');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(freshUser));
    } catch {
      // token inválido — faz logout
      await logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
