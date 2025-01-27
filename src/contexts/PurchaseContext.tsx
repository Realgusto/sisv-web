"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Purchase, PurchaseItems, StatusPurchase } from '@prisma/client'
import FetchAPI from '@/utils/fetch-api'

interface PurchaseContextType {
  /**
   * Indicates if the purchase is loading.
   */
  isLoading: boolean
  /**
   * Indicates whether the purchase is a budget or an order.
   */
  currentPage: 'order' | 'budget' | ''
  /**
   * Set the current page.
   */
  setPage: (page: 'order' | 'budget' | '') => void
  /**
   * Indicates the current mode.
   */
  currentMode: 'new' | 'edit' | 'visualize'
  /**
   * Set the current mode.
   */
  setMode: (mode: 'new' | 'edit' | 'visualize') => void
  /**
   * The current purchase.
   */
  currentPurchase: Purchase & { items: PurchaseItems[] }
  /**
   * Set the current purchase.
   */
  setPurchase: (data: Purchase & { items: PurchaseItems[] }) => void
  /**
   * Clear the current purchase.
   */
  clearPurchase: () => void
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [currentMode, setCurrentMode] = useState<'new' | 'edit' | 'visualize'>('new')
  const [currentPage, setCurrentPage] = useState<'order' | 'budget' | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPurchase, setCurrentPurchase] = useState<Purchase & { items: PurchaseItems[] }>({
    id: '',
    sequence: 0,
    companyId: '',
    user_id: '',
    approval_user_id: null,
    date: new Date(),
    delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    supplier: '',
    status: StatusPurchase.Aberta,
    department: '',
    items: [],
    total_value: 0,
    observations: '',
    updated_at: new Date(),
  })

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        if (currentPurchase.id !== '') {
          const response = await FetchAPI({
          method: 'GET',
          URL: `/api/purchases/${currentPurchase.id}`,
        })
        const data = await response.json()
        const { items } = data

          setCurrentPurchase(purchase => ({ ...purchase, items }))
        }
      } catch (error) {
        console.error('Error fetching purchase data:', error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [currentPurchase.id])

  const clearPurchase = () => {
    setCurrentPurchase({
      id: '',
      sequence: 0,
      companyId: '',
      user_id: '',
      approval_user_id: null,
      date: new Date(),
      delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
      supplier: '',
      status: StatusPurchase.Aberta,
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
