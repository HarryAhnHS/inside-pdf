"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

import { Document, Page } from "react-pdf"
import AudioControls from "./AudioControls"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PDFViewer = ({ file }) => {
  const [loading, setLoading] = useState(false)

  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)
  // for dynamic width
  const [width, setWidth] = useState(null)
  const pdfWrapperRef = useRef(null)
  const [pageText, setPageText] = useState("")

  useEffect(() => {
    // Calculate the current width of the container
    const setDivSize = () => {
      if (pdfWrapperRef.current) {
        setWidth(pdfWrapperRef.current.getBoundingClientRect().width)
      }
    }
    setDivSize()
    const handleResize = () => {
      setDivSize()
    }
    window.addEventListener("resize", handleResize)

    // Cleanup the listener
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  // On each re-render of page, extract text content for the current page
  const onRenderSuccess = async ({ pageNumber }) => {
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer() // extract data from blob using array buffer
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      const page = await pdf.getPage(pageNumber)
      const tokenizedText = await page.getTextContent()
      const extractedText = tokenizedText.items.map((token) => token.str).join(" ") // Combine all elements into a string
      console.log(extractedText)
      setPageText(extractedText)
    } catch (error) {
      console.error("Failed to render pdf text")
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page)
    }
  }

  const goToPrevPage = () => setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)

  const goToNextPage = () => setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1)

  const handleInputChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      goToPage(value)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow overflow-hidden pt-0">
      <CardContent className="p-0">
        {/* PDF navigation bar */}
        <div className="py-6 px-4 flex items-center justify-between">
            <Button
              onClick={goToPrevPage}
              variant="outline"
              size="sm"
              className="h-9 px-4"
              disabled={pageNumber === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center justify-center space-x-2 text-sm">
              <Input
                type="number"
                value={pageNumber}
                onChange={handleInputChange}
                min="1"
                max={numPages || 1}
                className="px-1 h-9 text-center w-16"
              />
              <span className="text-xs text-muted-foreground text-nowrap">of {numPages || "-"}</span>
            </div>

            <Button
              onClick={goToNextPage}
              variant="outline"
              size="sm"
              className="h-9 px-4"
              disabled={pageNumber === numPages || !numPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
        {/* Audio Controls */}
        <AudioControls pageText={pageText} />

        {/* PDF View container */}
        <div className="w-full bg-muted/20" ref={pdfWrapperRef}>
          <div className="flex justify-center">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="border shadow-sm"
            >
              <Page
                pageNumber={pageNumber}
                width={width ? width - 64 : undefined}
                onRenderSuccess={onRenderSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-background"
              />
            </Document>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PDFViewer