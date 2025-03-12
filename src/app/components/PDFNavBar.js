"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PDFNavBar = ({ pageNumber, numPages, onPageChange }) => {
  const goToPage = (page) => {
    if (page >= 1 && page <= numPages) {
      onPageChange(page)
    }
  }

  const goToPrevPage = () => onPageChange(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)
  const goToNextPage = () => onPageChange(pageNumber + 1 >= numPages ? numPages : pageNumber + 1)

  const handleInputChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      goToPage(value)
    }
  }

  return (
    <div className="pt-6 px-6 flex items-center justify-between">
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

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground text-nowrap">Page</span>
        <Input
          type="number"
          value={pageNumber}
          onChange={handleInputChange}
          min="1"
          max={numPages || 1}
          className="text-center !text-xs h-7 px-1"
        />
        <span className="text-xs text-muted-foreground text-nowrap">of {numPages || "-"}</span>
      </div>
    </div>
  )
}

export default PDFNavBar 