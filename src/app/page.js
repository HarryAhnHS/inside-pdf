"use client";
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from "@/components/ui/button";

import FileUpload from './components/FileUpload';
const PDFViewer = dynamic(() => import('./components/PDFViewer'), { ssr: false }); // Disable SSR PDFViewer by dynamically importing

export default function Home() {
  const [file, setFile] = useState(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const fileUploadRef = useRef(null);

  // Initial animation for FileUpload
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(fileUploadRef.current,
      { 
        opacity: 0,
        y: -50
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.5, // Faster initial animation
        ease: "power2.out"
      }
    );
  }, []);

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      // Animate out FileUpload
      await gsap.to(fileUploadRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3, // Faster exit animation
        ease: "power2.in"
      });
      
      setFile(uploadedFile);
      setShowPDFViewer(true);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleChangeFile = async () => {
    // Animate out PDFViewer
    setShowPDFViewer(false);
    setFile(null);
    
    // Reset and show FileUpload with animation
    gsap.fromTo(fileUploadRef.current,
      { 
        opacity: 0,
        y: -20
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      }
    );
  };

  return (
    <main>
      {/* File Upload */}
      <div 
        ref={fileUploadRef} 
        className={`w-full transition-all flex justify-center items-center ${showPDFViewer ? 'hidden' : ''}`}
      >
        <FileUpload onFileChange={handleFileChange} />
      </div>

      {/* PDF Viewer */}
      {showPDFViewer && (
        <div className="w-full flex justify-center items-start">
          <PDFViewer file={file} handleChangeFile={handleChangeFile} />
        </div>
      )}
    </main>
  );
}
