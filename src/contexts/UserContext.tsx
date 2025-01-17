"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import { TOKEN_KEY, URL_ENTRY } from '@/constants'
import { useRouter } from 'next/navigation'
import { Company, User } from '@prisma/client'
import FetchAPI from '@/utils/fetch-api'

interface UserContextType {
  user: User | null
  companySelected: Company | null
  selectCompany: (company: Company) => void
  clearCompany: () => void
  companies: Company[] | null
  login: (userData: User, companiesData: Company[]) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter()

  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [companySelected, setCompanySelected] = useState<Company | null>(null);

  useEffect(() => {
    (async() => {
      try {
        const id = Cookies.get(TOKEN_KEY)
              
        if (id) {
          const res = await FetchAPI({
              URL: '/api/users?id='+id,
              method: 'GET',
          })
          const user: User | null = res.ok ? await res.json() : null

          if (user) {
            const response = await FetchAPI({ 
              URL: '/api/companies?userId='+id,
              method: 'GET'
            })
      
            const companies: Company[] | null = response.ok ? await response.json() : null
            
            if (companies) {
              setUser(user)
              setCompanies(companies)
              push(URL_ENTRY)
            } else {
              push('/login')
            }
          }
        } else {
          push('/login')
        }
      } catch (error) {
        console.error('Erro ao buscar usuário logado: ', error)
      }
    })()
  }, [push])

  const selectCompany = (company: Company) => {
    setCompanySelected(company)
  }

  const clearCompany = () => {
    setCompanySelected(null)
  }

  const login = (userData: User, companiesData: Company[]) => {
    const ret = Cookies.set(TOKEN_KEY, userData.id, { expires: 1 })
    if (ret !== '') {
      push(URL_ENTRY)
    }
    setUser(userData)
    setCompanies(companiesData)
  };

  const logout = () => {
    setUser(null)
    Cookies.remove(TOKEN_KEY)
    push('/login')
  };

  return (
    <UserContext.Provider value={{
      user,
      companySelected,
      selectCompany,
      clearCompany,
      companies,
      login,
      logout
    }}>
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
