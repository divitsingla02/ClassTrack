import React from 'react';
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateClassesToAttend,
  getStatusCategory,
  STATUS_CONFIG
} from '../utils/attendanceCalculations';
import {
  Check,
  X,
  Edit2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ChevronRight,
  User,
  MapPin,
  TrendingUp
} from 'lucide-react';

export default function AttendanceCard({
  subject,
  onMarkPresent,
  onMarkAbsent,
  onEdit,
  threshold = 75
}) {
  const attended = Number(subject.attended || 0);
  const total = Number(subject.total || 0);
  const missed = Math.max(0, total - attended);
  const percentage = calculatePercentage(attended, total);
  const subThreshold = Number(subject.threshold || threshold);

  const status = getStatusCategory(percentage, subThreshold);
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.safe;

  const safeBunks = calculateSafeBunks(attended, total, subThreshold);
  const needToAttend = calculateClassesToAttend(attended, total, subThreshold);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-hover transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      {/* Top Bar with Accent color */}
      <div className="h-1.5 w-full" style={{ backgroundColor: subject.color || '#635BDB' }} />

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Header: Code, Status Badge, Edit Button */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide border font-mono"
              style={{
                backgroundColor: subject.bgLight || '#EEEDFE',
                color: subject.color || '#635BDB',
                borderColor: subject.borderCol || '#C7D2FE'
              }}
            >
              {subject.code}
            </span>

            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                {statusInfo.label}
              </span>

              <button
                onClick={() => onEdit(subject)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                title="Edit numbers directly"
                aria-label="Edit attendance"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subject Title */}
          <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
            {subject.name}
          </h4>

          {/* Faculty & Room details */}
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{subject.faculty || 'Unassigned'}</span>
            </div>
            {subject.room && (
              <div className="flex items-center gap-1.5 truncate text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{subject.room}</span>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Stats Section */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {percentage}%
              </span>
              <span className="text-xs text-slate-400 font-medium ml-1.5">
                ({attended}/{total} attended)
              </span>
            </div>

            {/* Bunk advice snippet */}
            <div className="text-right">
              {safeBunks > 0 ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-600" />
                  {safeBunks} safe {safeBunks === 1 ? 'bunk' : 'bunks'}
                </span>
              ) : needToAttend > 0 ? (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Attend next {needToAttend}
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500">On the line (0)</span>
              )}
            </div>
          </div>

          {/* Progress Bar with 75% Cutoff Marker */}
          <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentage >= subThreshold ? 'bg-primary' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>

          {/* Small metrics strip */}
          <div className="grid grid-cols-3 gap-1 bg-slate-50 rounded-xl p-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Attended</span>
              <span className="font-bold text-slate-800">{attended}</span>
            </div>
            <div className="border-x border-slate-200/60">
              <span className="text-[10px] text-slate-400 block font-medium">Missed</span>
              <span className="font-bold text-slate-800">{missed}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Conducted</span>
              <span className="font-bold text-slate-800">{total}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons: Present / Absent */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onMarkPresent(subject.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition active:scale-98"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Present</span>
          </button>

          <button
            onClick={() => onMarkAbsent(subject.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition active:scale-98"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Absent</span>
          </button>
        </div>
      </div>
    </div>
  );
}

