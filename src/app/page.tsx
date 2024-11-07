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
  }, [])

  return (
    <div />
  )
}