'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'loading' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem = ({ toast, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (toast.type !== 'loading' && toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 size={20} className="text-green-600" />,
    error: <XCircle size={20} className="text-red-600" />,
    loading: <Loader2 size={20} className="text-blue-600 animate-spin" />,
    info: <CheckCircle2 size={20} className="text-blue-600" />,
  };

  const bgColors = {
    success: 'bg-green-50/90 border-green-200/50',
    error: 'bg-red-50/90 border-red-200/50',
    loading: 'bg-blue-50/90 border-blue-200/50',
    info: 'bg-blue-50/90 border-blue-200/50',
  };

  return (
    <div
      className={`transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <GlassCard
        className={`p-4 flex items-center gap-3 min-w-[300px] max-w-md ${bgColors[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="flex-1 text-sm text-gray-900 font-medium">{toast.message}</p>
        {toast.type !== 'loading' && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(toast.id), 300);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </GlassCard>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) => showToast(message, 'success', duration);
  const error = (message: string, duration?: number) => showToast(message, 'error', duration);
  const loading = (message: string) => showToast(message, 'loading', 0);
  const info = (message: string, duration?: number) => showToast(message, 'info', duration);

  return {
    toasts,
    success,
    error,
    loading,
    info,
    removeToast,
  };
};
