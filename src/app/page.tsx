"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'

export default function Page() {
  const { push } = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      push('/dashboard')
    } else {
      push('/login')
    }
  }, [push, user])

  return (
    <div className="p-4 sm:p-6 bg-background min-h-screen flex justify-center items-center">
      <h1 className="text-2xl font-bold">Redirecionando...</h1>
    </div>
  )
}