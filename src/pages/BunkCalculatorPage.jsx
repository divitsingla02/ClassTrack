import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BunkCalculator from '../components/BunkCalculator';
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateClassesToAttend,
  getStatusCategory,
  STATUS_CONFIG
} from '../utils/attendanceCalculations';
import {
  Flame,
  Sparkles,
  Calculator,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Info,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function BunkCalculatorPage() {
  const { subjects, profile, updateProfile, threshold: globalThreshold } = useApp();
  const [activeThreshold, setActiveThreshold] = useState(globalThreshold || 75);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || null);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Aggregate calculations for all subjects
  let totalSafeBunksAll = 0;
  let totalRecoverClassesAll = 0;
  subjects.forEach((s) => {
    totalSafeBunksAll += calculateSafeBunks(s.attended, s.total, activeThreshold);
    totalRecoverClassesAll += calculateClassesToAttend(s.attended, s.total, activeThreshold);
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Bunk Budget Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Know exactly when to attend, and when you can skip.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Mathematically verified safe bunk allowances and consecutive attendance recovery plans. Never guess your eligibility again.
          </p>
        </div>

        {/* Global Threshold Selector & Presets */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/90 p-2 rounded-2xl shadow-2xs self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-600">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>Cutoff:</span>
          </div>
          <div className="flex gap-1">
            {[75, 80, 85, 70].map((t) => (
              <button
                key={t}
                onClick={() => setActiveThreshold(t)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  activeThreshold === t
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate Semester Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/10 mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Aggregate Bunk Reserve
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Semester Bunk Budget: <span className="text-amber-400">{totalSafeBunksAll} Safe Lectures</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Across your enrolled subjects with a minimum {activeThreshold}% cutoff, you can afford a total of <strong>{totalSafeBunksAll} additional lecture absences</strong> without risking examination debarment.
            </p>

            <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Threshold: <strong>{activeThreshold}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-light" />
                <span>Enrolled Courses: <strong>{subjects.length}</strong></span>
              </div>
              {totalRecoverClassesAll > 0 && (
                <div className="flex items-center gap-2 text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span>Deficit to recover: <strong>{totalRecoverClassesAll} classes</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-center min-w-[200px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Total Skip Cushion
              </span>
              <span className="text-5xl font-black text-white tracking-tight mt-1 block">
                {totalSafeBunksAll}
              </span>
              <span className="text-[11px] text-amber-300 font-semibold mt-1 block">
                Safe Absences Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs for Focus Simulation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900">Select Subject to Simulate</h3>
          <span className="text-xs text-slate-400">Click a subject below for detailed what-if analysis</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubject?.id;
            const pct = calculatePercentage(sub.attended, sub.total);
            const bunks = calculateSafeBunks(sub.attended, sub.total, activeThreshold);
            const recover = calculateClassesToAttend(sub.attended, sub.total, activeThreshold);

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-4 py-2.5 rounded-2xl border transition-all text-left shrink-0 flex items-center gap-3 ${
                  isSelected
                    ? 'bg-white border-primary shadow-soft ring-2 ring-primary/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: sub.color || '#635BDB' }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{sub.code}</span>
                    <span className={`text-[10px] font-bold px-1.5 rounded ${
                      pct >= activeThreshold ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {pct}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block max-w-[140px]">
                    {sub.name}
                  </span>
                </div>

                <div className="ml-2 pl-2 border-l border-slate-100 text-right">
                  {bunks > 0 ? (
                    <span className="text-[11px] font-black text-primary">
                      {bunks} safe
                    </span>
                  ) : recover > 0 ? (
                    <span className="text-[11px] font-black text-rose-600">
                      Need {recover}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">0</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Bunk Calculator Component for Selected Subject */}
      {selectedSubject && (
        <BunkCalculator
          subject={selectedSubject}
          customThreshold={activeThreshold}
          onThresholdChange={(newT) => setActiveThreshold(newT)}
        />
      )}

      {/* Mathematical Logic & Formulation Transparency Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h4 className="text-base font-bold text-slate-900">
            How ClassTrack Computes Your Safe Bunks
          </h4>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          Unlike approximate tools, ClassTrack utilizes <strong>discrete integer inequalities</strong> matching university regulatory statutes. No floating approximations that round up prematurely.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Formula 1: Maximum Safe Absences */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wide block mb-1">
              1. Maximum Additional Absences Allowed
            </span>
            <p className="text-slate-500 mb-2">
              For attendance attended <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">A</code>, total conducted <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">T</code>, and cutoff <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">P%</code>:
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-primary font-bold text-center text-xs">
              x = Math.floor((A * 100) / P - T)
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              For standard 75% cutoff: <span className="font-mono text-slate-700">floor(4A / 3 - T)</span>. If negative, safe skips = 0.
            </p>
          </div>

          {/* Formula 2: Consecutive Classes to Recover */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wide block mb-1">
              2. Consecutive Classes to Recover
            </span>
            <p className="text-slate-500 mb-2">
              When attendance is below <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">P%</code>, required future attendances <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">y</code>:
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-rose-600 font-bold text-center text-xs">
              y = Math.ceil((P * T - 100 * A) / (100 - P))
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              For standard 75% cutoff: <span className="font-mono text-slate-700">3T - 4A</span> consecutive lectures without any absence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

