import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getIcon = (type?: ToastMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
      default:
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-10 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between p-3 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-neutral-900 dark:text-neutral-100 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0 mr-2">
            {getIcon(toast.type)}
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] text-neutral-500 truncate">{toast.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
            className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
