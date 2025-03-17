"use client"

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const FileUpload = ({ onFileChange, fileInputRef, file }) => {
  const [dragActive, setDragActive] = useState(false)

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
      onFileChange({ target: { files: [file] } })
    }
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileChange(e)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent>
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
            ref={fileInputRef}
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
                {file ? file.name : "Drop your PDF here"}
              </p>
              <p className="text-sm text-muted-foreground">
                  or click to browse
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FileUpload