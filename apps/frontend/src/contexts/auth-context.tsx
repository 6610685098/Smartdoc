'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, LoginDto, RegisterDto } from '@smartdoc/types';
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '@/lib/auth-api';

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDto, redirectTo?: string) => Promise<void>;
  register: (data: RegisterDto, redirectTo?: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Hydrate user from session cookie on mount
  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const response = await getCurrentUser();
        if (active) {
          setUser(response.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback(
    async (data: LoginDto, redirectTo: string = '/') => {
      const response = await apiLogin(data);
      setUser(response.user);
      router.push(redirectTo);
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterDto, redirectTo: string = '/') => {
      const response = await apiRegister(data);
      setUser(response.user);
      router.push(redirectTo);
    },
    [router]
  );

  const logout = useCallback(
    async (redirectTo: string = '/login') => {
      try {
        await apiLogout();
      } catch (err) {
        // Even if logout request fails, clear local state
        console.warn('Logout API error:', err);
      } finally {
        setUser(null);
        router.push(redirectTo);
      }
    },
    [router]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
