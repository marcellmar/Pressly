import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Toast provider component that sets up react-hot-toast
 * Use this in your app root component
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '12px 20px',
          fontSize: '14px',
        },
        success: {
          style: {
            borderLeft: '4px solid #10b981',
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #ef4444',
          },
          duration: 5000,
        },
        loading: {
          style: {
            borderLeft: '4px solid #3b82f6',
          },
          duration: 10000,
        },
      }}
    />
  );
}
