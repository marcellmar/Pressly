import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * A component that provides a drop zone for PDF files
 */
const PDFDropzone = ({ onPDFSelected }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Find the first PDF file
    const pdfFile = acceptedFiles.find(file => 
      file.type === 'application/pdf'
    );
    
    if (pdfFile) {
      onPDFSelected(pdfFile);
    }
  }, [onPDFSelected]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragAccept, 
    isDragReject 
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`pdf-dropzone ${
        isDragActive ? 'active' : ''
      } ${
        isDragAccept ? 'accept' : ''
      } ${
        isDragReject ? 'reject' : ''
      }`}
    >
      <input {...getInputProps()} />
      <div className="dropzone-content">
        {isDragActive ? (
          isDragAccept ? (
            <div className="dropzone-message">
              <i className="fas fa-file-pdf"></i>
              <p>Drop to analyze this PDF</p>
            </div>
          ) : (
            <div className="dropzone-message">
              <i className="fas fa-times-circle"></i>
              <p>Only PDF files are accepted</p>
            </div>
          )
        ) : (
          <div className="dropzone-message">
            <i className="fas fa-file-upload"></i>
            <p>Drag & drop a PDF file here, or click to select</p>
            <span className="dropzone-info">File will be analyzed directly on your browser</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDropzone;
