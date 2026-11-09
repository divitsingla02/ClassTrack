import React from 'react';
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateClassesToAttend,
  getStatusCategory,
  STATUS_CONFIG
} from '../utils/attendanceCalculations';
import {
  BookOpen,
  User,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  Flame,
  AlertTriangle,
  Percent,
  CheckCircle2
} from 'lucide-react';

export default function SubjectCard({
  subject,
  onEdit,
  onDelete,
  onViewAnalytics,
  threshold = 75
}) {
  const attended = Number(subject.attended || 0);
  const total = Number(subject.total || 0);
  const subThreshold = Number(subject.threshold || threshold);
  const percentage = calculatePercentage(attended, total);
  const status = getStatusCategory(percentage, subThreshold);
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.safe;

  const safeBunks = calculateSafeBunks(attended, total, subThreshold);
  const needToAttend = calculateClassesToAttend(attended, total, subThreshold);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-hover transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      {/* Top accent strip */}
      <div className="h-1.5 w-full" style={{ backgroundColor: subject.color || '#635BDB' }} />

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header: Code & Action icons */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider"
              style={{
                backgroundColor: subject.bgLight || '#EEEDFE',
                color: subject.color || '#635BDB',
                borderColor: subject.borderCol || '#C7D2FE'
              }}
            >
              {subject.code}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(subject)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                title="Edit Subject"
                aria-label="Edit subject details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(subject.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                title="Delete Subject"
                aria-label="Delete subject"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subject Name */}
          <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-primary transition-colors">
            {subject.name}
          </h4>

          {/* Faculty Info */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">{subject.faculty || 'Unassigned'}</span>
            </div>
            {subject.email && (
              <div className="flex items-center gap-2 text-slate-400 truncate text-[11px]">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{subject.email}</span>
              </div>
            )}
            {subject.room && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{subject.room}</span>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Snapshot & Safe Bunk Meter */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Attendance:</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${statusConfig.badgeClass}`}>
              {percentage}% ({statusConfig.label})
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentage >= subThreshold ? 'bg-primary' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>

          {/* Safe Bunks vs Required */}
          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Record</span>
              <span className="font-bold text-slate-800">{attended} / {total} classes</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Safe Bunks</span>
              <span className={`font-bold flex items-center gap-1 justify-end ${
                safeBunks > 0 ? 'text-primary' : 'text-rose-600'
              }`}>
                {safeBunks > 0 ? (
                  <>
                    <Flame className="w-3 h-3 text-primary fill-primary/20" />
                    {safeBunks} left
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    Must attend {needToAttend}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Action to view calculator/analytics for this subject */}
          <button
            onClick={() => onViewAnalytics && onViewAnalytics(subject)}
            className="mt-3 w-full py-2 text-center text-xs font-semibold text-primary hover:text-primary-hover bg-primary-subtle/80 hover:bg-primary-subtle rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>Simulate & Calculate Bunks</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

