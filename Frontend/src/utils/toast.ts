import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading' | 'custom';

interface ToastOptions {
  duration?: number;
  icon?: string | JSX.Element;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

/**
 * Toast utility functions to display consistent toast notifications throughout the application
 */
const Toast = {
  /**
   * Display a success toast notification
   * @param message The message to display
   * @param options Optional toast configuration
   */
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      icon: options?.icon || '✅',
      position: options?.position || 'top-right',
    });
  },

  /**
   * Display an error toast notification
   * @param message The error message to display
   * @param options Optional toast configuration
   */
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 4000,
      icon: options?.icon || '❌',
      position: options?.position || 'top-right',
    });
  },

  /**
   * Display a loading toast notification that can be updated later
   * @param message The loading message to display
   * @returns A toast ID that can be used to dismiss or update the toast
   */
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      duration: options?.duration || Infinity,
      position: options?.position || 'top-right',
    });
  },

  /**
   * Update an existing toast notification
   * @param id The ID of the toast to update
   * @param message The new message
   * @param type The new toast type
   */
  update: (id: string, message: string, type: ToastType) => {
    switch (type) {
      case 'success':
        toast.success(message, { id });
        break;
      case 'error':
        toast.error(message, { id });
        break;
      case 'loading':
        toast.loading(message, { id });
        break;
      case 'custom':
        toast(message, { id });
        break;
    }
  },

  /**
   * Dismiss a toast notification
   * @param id The ID of the toast to dismiss
   */
  dismiss: (id?: string) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  },

  /**
   * Create a promise toast that shows loading, success, and error states
   * @param promise The promise to track
   * @param messages Object containing loading, success, and error messages
   * @param options Optional toast configuration
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        duration: options?.duration || 3000,
        position: options?.position || 'top-right',
      }
    );
  },
};

export default Toast;
