"use client"

import { FileAudio, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from './ThemeProvider'

const Header = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="w-full border-b">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <FileAudio className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">PlayAI PDF Reader</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Header