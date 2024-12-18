"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/constants'
import { useRouter } from 'next/navigation'
import { User } from '@prisma/client'

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
    (async() => {
      try {
        const id = Cookies.get(TOKEN_KEY)
              
        if (id) {
          const res = await fetch('/api/users?id='+id, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          const user: User | null = res.ok ? await res.json() : null

          if (user) {
            if (user.admin) {
              push('/dashboard')
            } else {
              push('/shortcuts')
            }
            setUser(user)
          }
        } else {
          push('/login')
        }
      } catch (error) {
        console.error('Erro ao buscar usuário logado: ', error)
      }
    })()
  }, [push])

  const login = (userData: User) => {
    const ret = Cookies.set(TOKEN_KEY, userData.id, { expires: 1 })
    if (ret !== '') {
      if (userData.admin) {
        push('/dashboard')
      } else {
        push('/shortcuts')
      }
    }
    setUser(userData)
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
