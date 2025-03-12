"use client"

import { useEffect, useRef, useState } from "react"
import { Document, Page } from "react-pdf"

const PDFViewContainer = ({ file, pageNumber, onDocumentLoadSuccess, onRenderSuccess }) => {
  const [width, setWidth] = useState(null)
  const pdfWrapperRef = useRef(null)

  useEffect(() => {
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

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="w-full" ref={pdfWrapperRef}>
      <div className="flex justify-center items-center">
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
  )
}

export default PDFViewContainer 