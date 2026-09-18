import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
          border: 'border-emerald-500/50 bg-[#12221b]',
          glow: 'shadow-emerald-950/50',
          title: 'text-emerald-300',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-[#E50914] shrink-0" />,
          border: 'border-[#E50914]/60 bg-[#241215]',
          glow: 'shadow-[#E50914]/20',
          title: 'text-[#E50914]',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          border: 'border-amber-500/50 bg-[#241d12]',
          glow: 'shadow-amber-950/50',
          title: 'text-amber-300',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-[#00E5FF] shrink-0" />,
          border: 'border-[#00E5FF]/40 bg-[#121c24]',
          glow: 'shadow-[#00E5FF]/15',
          title: 'text-[#00E5FF]',
        };
    }
  };

  const style = getStyle();

  return (
    <div
      id={`toast-${toast.id}`}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${style.border} shadow-xl ${style.glow} backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold ${style.title}`}>{toast.title}</p>
        <p className="text-xs text-slate-200 mt-0.5 break-words">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
