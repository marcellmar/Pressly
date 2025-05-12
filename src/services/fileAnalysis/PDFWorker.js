/**
 * PDFWorker.js - PDF.js Worker Configuration
 * 
 * This module configures the PDF.js worker, which is required for PDF.js to function.
 * Import this module at your application's entry point (e.g., index.js)
 * to ensure the worker is properly set up before any PDF operations.
 */

import { GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjs from 'pdfjs-dist';

// Configure the worker location using the CDN
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Export the PDF.js version and worker for reference
export const PDFJSVersion = pdfjs.version;
export const PDFJSWorker = GlobalWorkerOptions.workerSrc;

// This module doesn't export a default, it just configures the worker
