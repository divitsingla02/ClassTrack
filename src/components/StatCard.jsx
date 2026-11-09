import React from 'react';

export default function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  badge,
  badgeType = 'default',
  colorClass = 'text-primary',
  bgClass = 'bg-primary-light',
  borderClass = 'border-border-default',
  progress,
  progressColor = 'bg-primary'
}) {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-primary-light text-primary border-primary/20',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-hover transition-all duration-300 relative overflow-hidden group">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center transition-transform group-hover:scale-105`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
      </div>

      {/* Main Stat Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        {subvalue && (
          <span className="text-xs font-medium text-slate-500">
            {subvalue}
          </span>
        )}
      </div>

      {/* Progress Bar (if provided) */}
      {typeof progress === 'number' && (
        <div className="mt-3.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {/* Badge or Footnote */}
      {badge && (
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
              badgeStyles[badgeType] || badgeStyles.default
            }`}
          >
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

