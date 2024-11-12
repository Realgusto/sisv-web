"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/constants'
import { useRouter } from 'next/navigation'

export interface User {
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
  const { push } = useRouter()

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const cookie = Cookies.get(TOKEN_KEY)
      
      if (cookie) {
        setUser({ id: 1, name: 'Augusto', token: cookie })
      } else {
        push('/login')
      }
    } catch (error) {
      console.error('Erro ao obter cookie: ', error)
    }
  }, [push])

  const login = (userData: User) => {
    setUser(userData)
    const ret = Cookies.set(TOKEN_KEY, userData.token, { expires: 1 })
    if (ret !== '') {
      push('/dashboard')
    }
  };

  const logout = () => {
    setUser(null)
    Cookies.remove(TOKEN_KEY)
    push('/login')
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
