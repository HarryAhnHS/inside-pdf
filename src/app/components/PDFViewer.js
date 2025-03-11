"use client";

import { useState, useEffect, useRef } from 'react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { Document, Page } from 'react-pdf';


const PDFViewer = ({ file }) => {
    const [loading, setLoading] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    // for dynamic width
    const [width, setWidth] = useState(null);
    const pdfWrapperRef = useRef(null);
    const [pageText, setPageText] = useState("");

    useEffect(() => {
        // Calculate the current width of the container
        const setDivSize = () => {
            if (pdfWrapperRef.current) {
                setWidth(pdfWrapperRef.current.getBoundingClientRect().width);
            }
        };
        setDivSize();
        const handleResize = () => {
            setDivSize();
        };
        window.addEventListener("resize", handleResize);

        // Cleanup the listener
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

    // On each re-render of page, extract text content for the current page
    const onRenderSuccess = async ({ pageNumber }) => {
        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer(); // extract data from blob using array buffer
            const pdf = await pdfjs.getDocument({data: arrayBuffer}).promise;
            const page = await pdf.getPage(pageNumber);
            const tokenizedText = await page.getTextContent();
            const extractedText = tokenizedText.items.map((token) => token.str).join(""); // Combine all elements into a string
            setPageText(extractedText);
        }
        catch(error) {
            console.error("Failed to render pdf text");
        }
        finally {
            setLoading(false);
        }
    };

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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer disabled:opacity-50"
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer disabled:opacity-50"
            disabled={pageNumber === numPages}
            >
                Next
            </button>
        </div>

        {/* PDF container */}
        <div className="w-full" ref={pdfWrapperRef}>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} width={width} onRenderSuccess={onRenderSuccess} renderTextLayer={false}/>
            </Document>
        </div>
    </div>
  );
};

export default PDFViewer;
