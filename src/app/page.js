"use client";
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';

import FileUpload from './components/FileUpload';
const PDFViewer = dynamic(() => import('./components/PDFViewer'), { ssr: false }); // Disable SSR PDFViewer by dynamically importing

export default function Home() {
  const [file, setFile] = useState(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const pdfViewerRef = useRef(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    // Validate PDF
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      gsap.to(pdfViewerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
      });
      setShowPDFViewer(true);
    } 
    else {
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <>
      {/* Landing */}
      <div className="w-full transition-all flex justify-center items-center py-6">
        <FileUpload onFileChange={handleFileChange} />
      </div>

      {/* PDF Viewer with smooth transition */}
      {showPDFViewer && (
        <div ref={pdfViewerRef} className="transition-all flex justify-center items-center py-6">
          <PDFViewer file={file} />
        </div>
      )}
    </>
  );
}
