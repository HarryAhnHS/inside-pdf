"use client"

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const FileUpload = ({ onFileChange }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      onFileChange({ target: { files: [file] } })
    }
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      onFileChange(e)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    // Reset the file input by triggering onFileChange with null
    onFileChange({ target: { files: [] } })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="px-6">
        <div
          className={`relative flex flex-col items-center justify-center w-full min-h-[200px] rounded-lg border-2 border-dashed transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium">
                {selectedFile ? selectedFile.name : "Drop your PDF here"}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedFile ? (
                  <span className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-destructive hover:text-destructive/90"
                      onClick={handleRemove}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove file
                    </Button>
                  </span>
                ) : (
                  "or click to browse"
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FileUpload