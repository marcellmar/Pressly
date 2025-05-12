import hotToast from 'react-hot-toast';

/**
 * Custom hook for using toast notifications
 * This allows using the toast functionality in a way that's compatible
 * with the import { toast } from "../components/ui/use-toast" pattern
 */
export const toast = {
  success: (options) => {
    return hotToast.success(options.description || options.title || 'Success');
  },
  error: (options) => {
    return hotToast.error(options.description || options.title || 'Error');
  },
  warning: (options) => {
    return hotToast.custom(
      <div className="bg-amber-50 text-amber-800 p-4 rounded-md border-l-4 border-amber-400">
        {options.title && <div className="font-bold">{options.title}</div>}
        {options.description && <div>{options.description}</div>}
      </div>
    );
  },
  info: (options) => {
    return hotToast.custom(
      <div className="bg-blue-50 text-blue-800 p-4 rounded-md border-l-4 border-blue-400">
        {options.title && <div className="font-bold">{options.title}</div>}
        {options.description && <div>{options.description}</div>}
      </div>
    );
  },
  default: (options) => {
    return hotToast(options.description || options.title || '');
  },
};

export default toast;