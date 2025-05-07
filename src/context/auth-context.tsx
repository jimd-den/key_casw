
"use client";

import type { User } from '@/core/enterprise/entities/user.entity'; // Updated import
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  currentUser: User | null;
  login: (publicKey: string, privateKeyProof?: string) => Promise<void>; // privateKeyProof is for simulation
  signup: (publicKey: string, username?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateDefaultUsername = (publicKey: string): string => {
  // Extracts a small, somewhat unique part from the public key for a default username
  const keyPart = publicKey.split('_').pop()?.substring(0, 8) || Math.random().toString(36).substring(2, 8);
  return `User-${keyPart}`;
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session (e.g., from localStorage)
    setIsLoading(true);
    try {
      const storedUserJson = localStorage.getItem('currentUser');
      if (storedUserJson) {
        const storedUser = JSON.parse(storedUserJson) as User;
        // Ensure username exists, or generate a default one if somehow missing from old storage
        if (!storedUser.username) {
          storedUser.username = generateDefaultUsername(storedUser.publicKey);
        }
        setCurrentUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('currentUser'); // Clear corrupted data
    }
    setIsLoading(false);
  }, []);

  const login = async (publicKey: string, _privateKeyProof?: string) => {
    setIsLoading(true);
    // Simulate API call for login
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For this mock, we assume if a public key is provided, it's a valid user.
    // In a real app, you'd verify the privateKeyProof against the publicKey on the server
    // and fetch the user details.

    // Attempt to load from localStorage first to see if this user "exists" with a username
    let username: string | undefined;
    try {
        const storedUserJson = localStorage.getItem('currentUser'); // This is a bit of a hack for demo
        if (storedUserJson) {
            const potentialUser = JSON.parse(storedUserJson) as User;
            if (potentialUser.publicKey === publicKey) {
                username = potentialUser.username;
            }
        }
    } catch (e) { /* ignore */ }

    const mockUser: User = { 
        id: publicKey, // In this system, public key is the ID
        publicKey, 
        username: username || generateDefaultUsername(publicKey) 
    };

    setCurrentUser(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser)); // Save/update user info on login
    setIsLoading(false);
  };

  const signup = async (publicKey: string, usernameInput?: string) => {
    setIsLoading(true);
    // Simulate API call for signup
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = { 
        id: publicKey, 
        publicKey, 
        username: usernameInput || generateDefaultUsername(publicKey) 
    };
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Optionally, redirect or show a toast
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
