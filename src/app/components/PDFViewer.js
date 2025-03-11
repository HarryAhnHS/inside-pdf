"use client";

import { useState, useEffect } from 'react';

import pdfToText from 'react-pdftotext';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


import { Document, Page } from 'react-pdf';



const PDFViewer = ({ file }) => {
    const [loading, setLoading] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    const [pageText, setPageText] = useState("");

    const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

//     useEffect(() => {
//         const extractTextFromPage = async () => {
//             setLoading(true);
//             try {
//                 text = await pdfToText(file);
//                 setPageText(text);
//             }
//             catch(error) {
//                 console.error("Failed to extract text from pdf")
//             }
//             finally {
//                 setLoading(false);
//             }
//         }
//     if (file) {
//         extractTextFromPage();
//     }
//   }, [file, pageNumber]);

    const goToPage = (page) => {
        setPageNumber(page);
    };

    const goToPrevPage = () =>
        setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

    const goToNextPage = () =>
        setPageNumber(
            pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
        );

  return (
    <div className="w-full max-w-4xl p-6 rounded-lg shadow-lg mt-6">
        <div className="flex justify-between mb-4">
            <button
            onClick={goToPrevPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            disabled={pageNumber === 1}
            >
                Prev
            </button>
            <div className="text-lg">
                <input
                    type="number"
                    value={pageNumber}
                    onChange={(e) => goToPage(Number(e.target.value))}
                    min="1"
                    max={numPages}
                    className="text-center w-12"
                />
                / {numPages}
            </div>
            <button
            onClick={() => goToPage(goToNextPage)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            disabled={pageNumber === numPages}
            >
                Next
            </button>
        </div>
        <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
        >
            <Page pageNumber={pageNumber} />
        </Document>
    </div>
  );
};

export default PDFViewer;
