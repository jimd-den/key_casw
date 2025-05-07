"use client";

import type { User } from '@/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  currentUser: User | null;
  login: (publicKey: string, privateKeyProof?: string) => Promise<void>; // privateKeyProof is for simulation
  signup: (publicKey: string, username?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session (e.g., from localStorage)
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
    setIsLoading(false);
  }, []);

  const login = async (publicKey: string, _privateKeyProof?: string) => {
    setIsLoading(true);
    // Simulate API call for login
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, you'd verify the privateKeyProof against the publicKey
    // For this mock, we assume if a public key is provided, it's a valid user (if it exists)
    // Or, if this public key was previously "signed up"
    const mockUser: User = { id: publicKey, publicKey, username: `User-${publicKey.substring(0, 6)}` };
    setCurrentUser(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const signup = async (publicKey: string, username?: string) => {
    setIsLoading(true);
    // Simulate API call for signup
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = { id: publicKey, publicKey, username: username || `User-${publicKey.substring(0, 6)}` };
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
