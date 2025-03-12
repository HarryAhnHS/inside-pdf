"use client"

import { useState } from "react"
import { pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { Card, CardContent } from "@/components/ui/card"
import AudioControls from "./AudioControls"
import PDFNavBar from "./PDFNavBar"
import PDFViewContainer from "./PDFViewContainer"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDFViewer = ({ file }) => {
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [pageText, setPageText] = useState("")

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
    <Card className="w-full max-w-2xl mx-auto shadow overflow-hidden pt-0 bg-muted/20">
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
  )
}

export default PDFViewer