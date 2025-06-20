import toast from 'react-hot-toast';

/**
 * Utility functions for showing toast notifications
 * Example usage: toast.success('Producer successfully contacted!')
 */
export const showToast = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  loading: (message) => {
    return toast.loading(message);
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  custom: (message, options) => {
    return toast(message, options);
  },
};

export default showToast;
