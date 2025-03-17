"use client";
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

import FileUpload from './components/FileUpload';
import ChatBox from './components/ChatBox';
const PDFDashboard = dynamic(() => import('./components/PDFDashboard'), { ssr: false }); // Disable SSR PDFViewer by dynamically importing

export default function Home() {
  const [file, setFile] = useState(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [pageText, setPageText] = useState("");
  const [fullPdfText, setFullPdfText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const fileUploadRef = useRef(null);
  const fileInputRef = useRef(null);

  const animateFileUpload = (element) => {
    return gsap.fromTo(element,
      { 
        opacity: 0,
        y: 50
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      }
    );
  };

  // Initial animation for FileUpload
  useEffect(() => {
    animateFileUpload(fileUploadRef.current);
  }, []);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      // Animate out FileUpload and show PDFViewer
      await gsap.to(fileUploadRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in"
      });
      
      setFile(uploadedFile);
      setShowPDFViewer(true);
      setPageText("");
      setFullPdfText("");
      setPageNumber(1);
      setIsChatExpanded(false); // Close chat when new file is loaded
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleChangeFile = async () => {
    // Animate out PDFViewer
    setShowPDFViewer(false);
    setFile(null);
    setPageText("");
    setFullPdfText("");
    setPageNumber(1);
    setIsChatExpanded(false); // Close chat when changing files
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Reset and show FileUpload with animation
    animateFileUpload(fileUploadRef.current);
  };

  return (
    <div className='h-full'>
      {/* File Upload */}
      <div 
        ref={fileUploadRef} 
        className={`h-full w-full transition-all flex justify-center items-center ${showPDFViewer ? 'hidden' : ''}`}
      >
        <FileUpload onFileChange={handleFileUpload} fileInputRef={fileInputRef} file={file}/>
      </div>

      {/* PDF Viewer */}
      {showPDFViewer && (
        <div className="w-full flex justify-center items-start">
          <PDFDashboard 
            file={file} 
            handleChangeFile={handleChangeFile}
            onPageTextChange={setPageText}
            onFullPdfTextChange={setFullPdfText}
            isChatExpanded={isChatExpanded}
            onChatToggle={() => setIsChatExpanded(!isChatExpanded)}
            onPageChange={setPageNumber}
          />
        </div>
      )}

      {/* Chat Box */}
      <ChatBox 
        key={file?.name}
        isExpanded={isChatExpanded} 
        pageText={pageText}
        fullPdfText={fullPdfText}
        pageNumber={pageNumber}
        onClose={() => setIsChatExpanded(false)} 
      />
    </div>
  );
}
