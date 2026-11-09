import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;
        let borderColor = 'border-blue-200';
        let bgColor = 'bg-white';
        let barColor = 'bg-blue-600';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
          borderColor = 'border-emerald-200';
          barColor = 'bg-emerald-600';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
          borderColor = 'border-amber-200';
          barColor = 'bg-amber-600';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          borderColor = 'border-rose-200';
          barColor = 'bg-rose-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-xl bg-white border ${borderColor} shadow-lg shadow-slate-900/5 transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div className={`absolute top-0 left-0 bottom-0 w-1 ${barColor}`} />
            {icon}
            <div className="flex-1 text-sm font-medium text-slate-800 leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

