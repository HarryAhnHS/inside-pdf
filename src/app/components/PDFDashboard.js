"use client"

import { useState, useEffect, useRef } from "react"
import { pdfjs } from "react-pdf"
import { gsap } from "gsap"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wand2, X } from "lucide-react"

import PDFAudioControls from "./PDFAudioControls"
import PDFNavBar from "./PDFNavBar"
import PDFViewContainer from "./PDFViewContainer"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDFDashboard = ({ 
  file, 
  handleChangeFile, 
  onPageTextChange,
  isChatExpanded,
  onChatToggle,
  onFullPdfTextChange,
  onPageChange
}) => {
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [currentPageText, setCurrentPageText] = useState("")
  const containerRef = useRef(null)

  useEffect(() => {
    // Initial animation when component mounts
    gsap.fromTo(containerRef.current,
      { 
        opacity: 0,
        y: 50
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }
    )
  }, [])

  // Handle page number changes
  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber)
    if (onPageChange) {
      onPageChange(newPageNumber)
    }
  }

  // Extract full PDF text when new document loads
  const onDocumentLoadSuccess = async ({ numPages }) => {
    setNumPages(numPages)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      let fullText = ""
      
      // Extract text from each page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const tokenizedText = await page.getTextContent()
        const pageText = tokenizedText.items.map((token) => token.str).join(" ")
        
        // Add page number and clear boundary
        fullText += `\n\n--- Page ${i} ---\n\n${pageText}\n\n`
      }
      
      onFullPdfTextChange(fullText)
    } 
    catch (error) {
      console.error("Failed to extract full PDF text:", error)
    }
  }

  // Extract text from current page when it renders
  const onRenderSuccess = async ({ pageNumber }) => {
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      const page = await pdf.getPage(pageNumber)
      const tokenizedText = await page.getTextContent()
      const extractedText = tokenizedText.items.map((token) => token.str).join(" ")
      setCurrentPageText(extractedText)
      onPageTextChange(extractedText)
    } catch (error) {
      console.error("Failed to render pdf text")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl" ref={containerRef}>
      {/* Meta toolbar */}
      <div className="flex justify-between items-center pb-4">
        {/* Change File Button */}
        <Button 
          variant="ghost" 
          onClick={handleChangeFile}
          size="sm"
          className="h-8 px-4 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Change File
        </Button>
        {/* Chat Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onChatToggle}
          className="h-8 px-4 text-xs text-muted-foreground hover:text-foreground"
        >
          {isChatExpanded ? (
            <X className="h-4 w-4" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {isChatExpanded ? (
            'Hide AI'
          ) : (
            'Ask AI'
          )}
        </Button>
      </div>
      
      <Card 
        className="w-full max-w-2xl mx-auto shadow overflow-hidden pt-0 pb-12 bg-muted/20"
      >
        <CardContent className="p-0">
          {/* Navbar */}
          <PDFNavBar 
            pageNumber={pageNumber}
            numPages={numPages}
            onPageChange={handlePageChange}
          />
          {/* Audio Controls */}
          <PDFAudioControls pageText={currentPageText}/>
          {/* PDF View Container */}
          <PDFViewContainer 
            file={file}
            pageNumber={pageNumber}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            onRenderSuccess={onRenderSuccess}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default PDFDashboard