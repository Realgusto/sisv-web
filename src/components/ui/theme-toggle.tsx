'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Hoverable from '../Hoverable'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Hoverable className="right-0 top-9 min-w-18 bg-secondary text-secondary-foreground"
      renderHoverContent={() => (
        <h2 className="text-sm font-medium select-none sm:text-base">
          {theme === 'light' ? 'Tema Claro' : 'Tema Escuro'}
        </h2>
      )}
    >
      <Button
        variant="ghost"
        size={"default"}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onMouseEnter={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
      >
        <Sun size={32} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon size={32} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    </Hoverable>
  )
} 