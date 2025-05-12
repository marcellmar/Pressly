import React from 'react';
import { Dialog as HeadlessDialog } from '@headlessui/react';

const Dialog = ({ children, open, onOpenChange, ...props }) => {
  return (
    <HeadlessDialog
      open={open}
      onClose={() => onOpenChange(false)}
      {...props}
    >
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
        <HeadlessDialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          {children}
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
};

const DialogTrigger = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const DialogContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = '', ...props }) => {
  return (
    <HeadlessDialog.Title
      className={`text-lg font-medium text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </HeadlessDialog.Title>
  );
};

const DialogDescription = ({ children, className = '', ...props }) => {
  return (
    <HeadlessDialog.Description
      className={`mt-2 text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </HeadlessDialog.Description>
  );
};

const DialogFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`flex justify-end space-x-2 mt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
