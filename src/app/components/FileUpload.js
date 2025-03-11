import React from 'react';

const FileUpload = ({ onFileChange }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <input
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="mb-4 p-3 bg-blue-500 text-white rounded-lg cursor-pointer"
      />
    </div>
  );
};

export default FileUpload;