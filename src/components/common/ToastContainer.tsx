import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBakery();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1F1A16] text-[#FAF7F2] border border-[#C49258]/30 shadow-2xl rounded-lg p-3.5 flex items-start justify-between gap-3 text-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
            )}
            {(!toast.type || toast.type === 'success') && (
              <CheckCircle2 className="w-4 h-4 text-[#C49258] mt-0.5 shrink-0" />
            )}
            <span className="font-medium text-[#FAF7F2] leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] transition-colors p-0.5"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
