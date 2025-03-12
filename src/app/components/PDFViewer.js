"use client"

import { useState, useEffect, useRef } from "react"
import { pdfjs } from "react-pdf"
import { gsap } from "gsap"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { Card, CardContent } from "@/components/ui/card"
import AudioControls from "./AudioControls"
import PDFNavBar from "./PDFNavBar"
import PDFViewContainer from "./PDFViewContainer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDFViewer = ({ file, handleChangeFile }) => {
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [pageText, setPageText] = useState("")
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const onRenderSuccess = async ({ pageNumber }) => {
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      const page = await pdf.getPage(pageNumber)
      const tokenizedText = await page.getTextContent()
      const extractedText = tokenizedText.items.map((token) => token.str).join(" ")
      setPageText(extractedText)
    } catch (error) {
      console.error("Failed to render pdf text")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl" ref={containerRef}>
      <div className="flex justify-start pb-4">
        <Button 
          variant="outline" 
          onClick={handleChangeFile}
          size="sm"
          className="h-9 px-4 text-xs"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Change File
        </Button>
      </div>
      <Card 
      className="w-full max-w-2xl mx-auto shadow overflow-hidden pt-0 bg-muted/20"
      >
        <CardContent className="p-0">
          {/* Navbar */}
          <PDFNavBar 
            pageNumber={pageNumber}
            numPages={numPages}
            onPageChange={setPageNumber}
          />
          {/* Audio Controls */}
          <AudioControls pageText={pageText}/>
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

export default PDFViewer