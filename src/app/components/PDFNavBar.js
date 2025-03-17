"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, FileAudio, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PDFNavBar = ({ pageNumber, numPages, onPageChange, isAudioExpanded, onAudioToggle, isAudioLoading }) => {
  const [inputValue, setInputValue] = useState(pageNumber)
  const [isFocused, setIsFocused] = useState(false)

  // Update input value when pageNumber changes externally
  useEffect(() => {
    if (!isFocused) {
      setInputValue(pageNumber)
    }
  }, [pageNumber, isFocused])

  const goToPrevPage = () => onPageChange(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)
  const goToNextPage = () => onPageChange(pageNumber + 1 >= numPages ? numPages : pageNumber + 1)
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
  }

  const goToPage = (page) => {
    const validPage = Math.min(Math.max(1, page), numPages || 1)
    if (validPage !== pageNumber) {
      onPageChange(validPage)
    }
    setInputValue(validPage)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    setInputValue("")
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    const newPage = Number.parseInt(inputValue)
    if (!isNaN(newPage) && newPage > 0) {
      goToPage(newPage)
    } else {
      setInputValue(pageNumber)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur()
    }
  }

  return (
    <div className={`pt-6 pb-6 px-6 flex items-center justify-between`}>
      {/* Left side: Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={goToPrevPage}
          variant="outline"
          size="sm"
          className="h-9 px-4 text-xs"
          disabled={pageNumber === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>

        <Button
          onClick={goToNextPage}
          variant="outline"
          size="sm"
          className="h-9 px-4 text-xs"
          disabled={pageNumber === numPages || !numPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Right side: Page number and Audio controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground text-nowrap">Page</span>
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            min="1"
            max={numPages || 1}
            className="text-center !text-xs h-7 px-1"
          />
          <span className="text-xs text-muted-foreground text-nowrap">of {numPages || "-"}</span>
        </div>

        {/* Audio Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onAudioToggle}
          disabled={isAudioLoading}
          className={`h-9 px-4 text-xs ${isAudioLoading ? 'opacity-50 cursor-not-allowed' : ''} ${isAudioExpanded ? 'text-muted-foreground' : 'text-muted-foreground'} hover:text-foreground`}
        >
          {isAudioLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isAudioExpanded ? (
            <X className="h-4 w-4" />
          ) : (
            <FileAudio className="h-4 w-4" />
          )}
          {isAudioExpanded ? 'Close Audio' : 'Speech'}
        </Button>
      </div>
    </div>
  )
}

export default PDFNavBar 