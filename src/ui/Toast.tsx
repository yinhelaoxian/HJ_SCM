import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };
  
  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    warning: 'bg-amber-500/10 border-amber-500/30',
    info: 'bg-blue-500/10 border-blue-500/30'
  };
  
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[type]} shadow-lg animate-slide-in`}>
      {icons[type]}
      <span className="text-sm text-slate-200">{message}</span>
      <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
