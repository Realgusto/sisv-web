"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Service, StatusService } from '@prisma/client'

interface ServiceContextType {
  /**
   * Indicates if the service is loading.
   */
  isLoading: boolean
  /**
   * Set the service loading.
   */
  setLoading: (loading: boolean) => void
  /**
   * Indicates the current mode.
   */
  currentMode: 'new' | 'edit' | 'visualize'
  /**
   * Set the current mode.
   */
  setMode: (mode: 'new' | 'edit' | 'visualize') => void
  /**
   * The current service.
   */
  currentService: Service
  /**
   * Set the current service.
   */
  setService: (data: Service) => void
  /**
   * Clear the current service.
   */
  clearService: () => void
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [currentMode, setCurrentMode] = useState<'new' | 'edit' | 'visualize'>('new')
  const [isLoading, setIsLoading] = useState(false)
  const [currentService, setCurrentService] = useState<Service>({
    id: '',
    sequence: 0,
    companyId: '',
    user_id: '',
    service_user_id: null,
    approval_user_id: null,
    date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: StatusService.Aberta,
    department: null,
    equipment: null,
    criticality: null,
    service_description: null,
    service_type: null,
    equipment_status: null,
    observations: null,
    updated_at: new Date(),
  })

  const clearService = () => {
    setCurrentService({
      id: '',
      sequence: 0,
      companyId: '',
      user_id: '',
      service_user_id: null,
      approval_user_id: null,
      date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
      status: StatusService.Aberta,
      department: null,
      equipment: null,
      criticality: null,
      service_description: null,
      service_type: null,
      equipment_status: null,
      observations: null,
      updated_at: new Date(),
    })
  }

  const setMode = (mode: 'new' | 'edit' | 'visualize') => {
    setCurrentMode(mode)
  }

  const setService = (data: Service) => {
    setCurrentService(data)
  }

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
    <ServiceContext.Provider value={{
      isLoading,
      setLoading,
      currentMode,
      setMode,
      currentService,
      setService,
      clearService,
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider')
  }
  return context
};
