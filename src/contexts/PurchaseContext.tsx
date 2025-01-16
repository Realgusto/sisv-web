"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Purchase, PurchaseItems, Status } from '@prisma/client'
import FetchAPI from '@/utils/fetch-api'

interface PurchaseContextType {
  isLoading: boolean
  currentPage: 'order' | 'budget' | ''
  setPage: (page: 'order' | 'budget' | '') => void
  currentMode: 'new' | 'edit' | 'visualize'
  setMode: (mode: 'new' | 'edit' | 'visualize') => void
  currentPurchase: Purchase & { items: PurchaseItems[] }
  setPurchase: (data: Purchase & { items: PurchaseItems[] }) => void
  clearPurchase: () => void
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [currentMode, setCurrentMode] = useState<'new' | 'edit' | 'visualize'>('new')
  const [currentPage, setCurrentPage] = useState<'order' | 'budget' | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPurchase, setCurrentPurchase] = useState<Purchase & { items: PurchaseItems[] }>({
    id: '',
    companyId: '',
    user_id: '',
    date: new Date(),
    delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    supplier: '',
    status: Status.Aberta,
    department: '',
    items: [],
    total_value: 0,
    observations: '',
    updated_at: new Date(),
  })

  useEffect(() => {
    (async () => {
      setIsLoading(true)

      if (currentPurchase.id !== '') {
        const response = await FetchAPI({
          method: 'GET',
          URL: `/api/purchases/${currentPurchase.id}`,
        })
        const data = await response.json()
        const { items } = data

        setCurrentPurchase({ ...currentPurchase, items })
      }

      setIsLoading(false)
    })()
  }, [currentPurchase.id])

  const clearPurchase = () => {
    setCurrentPurchase({
      id: '',
      companyId: '',
      user_id: '',
      date: new Date(),
      delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
      supplier: '',
      status: Status.Aberta,
      department: '',
      items: [],
      total_value: 0,
      observations: '',
      updated_at: new Date(),
    })
  }

  const setPage = (page: 'order' | 'budget' | '') => {
    setCurrentPage(page)
  }

  const setMode = (mode: 'new' | 'edit' | 'visualize') => {
    setCurrentMode(mode)
  }

  const setPurchase = (data: Purchase & { items: PurchaseItems[] }) => {
    setCurrentPurchase(data)
  }

  return (
    <PurchaseContext.Provider value={{
      isLoading,
      currentPage,
      setPage,
      currentMode,
      setMode,
      currentPurchase,
      setPurchase,
      clearPurchase,
    }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext)
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider')
  }
  return context
};
