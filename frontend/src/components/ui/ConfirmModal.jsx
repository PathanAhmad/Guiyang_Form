import React, { useEffect } from 'react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
}) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (!loading) {
      onClose();
    }
  };

  const getConfirmButtonClasses = () => {
    const baseClasses = 'flex-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium';
    
    if (loading) {
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }

    switch (variant) {
      case 'danger':
        return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg`;
      case 'info':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg`;
      default:
        return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg`;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {title}
        </h3>
        <div className="text-gray-600 mb-6 whitespace-pre-line">
          {message}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors duration-200 font-medium ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={getConfirmButtonClasses()}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

