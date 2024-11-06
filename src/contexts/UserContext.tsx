"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/constants'
import { redirect } from 'next/navigation'

interface User {
  id: number
  name: string
  token: string
}

interface UserContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData)
    Cookies.set(TOKEN_KEY, userData.token, { expires: 1 })
    redirect('/dashboard')
  };

  const logout = () => {
    setUser(null)
    Cookies.remove(TOKEN_KEY)
    redirect('/login')
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
