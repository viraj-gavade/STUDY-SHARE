import React, { useState } from 'react';

interface PDFPreviewProps {
  fileUrl: string;
  fileName?: string;
  fileType: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ fileUrl, fileName, fileType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load the document preview');
  };

  // Check if file is a PDF
  const isPDF = fileType.includes('pdf');
  
  // Check if file is an image
  const isImage = fileType.includes('image') || 
    fileType.includes('jpeg') || 
    fileType.includes('jpg') || 
    fileType.includes('png');

  // Generate a display filename if not provided
  const displayName = fileName || fileUrl.split('/').pop() || 'document';

  // Function to handle direct download
  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden border">
      {/* Header with filename and download button */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center">
          {/* Icon based on file type */}
          {isPDF ? (
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          ) : isImage ? (
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          )}
          <span className="text-sm font-medium truncate max-w-[200px] md:max-w-lg">
            {displayName}
          </span>
        </div>
        
        <button
          onClick={handleDownload}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
      
      {/* Preview content */}
      <div className="h-[400px] md:h-[500px] lg:h-[600px] w-full relative">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={handleDownload}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Download File Instead
            </button>
          </div>
        )}
        
        {/* PDF Preview */}
        {isPDF ? (
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-full"
            title="PDF Preview"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : isImage ? (
          // Image Preview
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img
              src={fileUrl}
              alt="Document Preview"
              className="max-h-full max-w-full object-contain"
              onLoad={() => setIsLoading(false)}
              onError={handleIframeError}
            />
          </div>
        ) : (
          // For non-previewable files
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 mb-2">Preview not available for this file type</p>
            <button
              onClick={handleDownload}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPreview;
