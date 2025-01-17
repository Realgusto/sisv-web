'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

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
    <>
      { isHovering && (
        <div className={`right-0 absolute min-w-18 mt-10 bg-secondary text-secondary-foreground p-3 rounded-md shadow-md transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-center text-sm font-medium select-none sm:text-base">
                {theme === 'light' ? 'Dark' : 'Light'}
            </h2>
        </div>
      )}
      
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
    </>
  )
} 