"use client";
import { useState } from 'react';
import FileUpload from './components/FileUpload';

export default function Home() {
  const [file, setFile] = useState(null);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-800">
      {/* Landing */}
      <FileUpload onFileChange={handleFileChange} />
    </div>
  );
}
