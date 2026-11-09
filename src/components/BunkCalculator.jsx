import React, { useState, useMemo } from 'react';
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateClassesToAttend,
  getStatusCategory,
  STATUS_CONFIG
} from '../utils/attendanceCalculations';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  Sliders,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BunkCalculator({
  subject,
  customThreshold,
  onThresholdChange,
  compact = false
}) {
  const [threshold, setThreshold] = useState(customThreshold || subject?.threshold || 75);
  // Simulation offsets
  const [simAttendedOffset, setSimAttendedOffset] = useState(0);
  const [simMissedOffset, setSimMissedOffset] = useState(0);

  // Sync threshold if prop changes
  React.useEffect(() => {
    if (customThreshold) {
      setThreshold(customThreshold);
    }
  }, [customThreshold]);

  const baseAttended = Number(subject?.attended || 0);
  const baseTotal = Number(subject?.total || 0);

  // Actual base calculations
  const basePercentage = calculatePercentage(baseAttended, baseTotal);
  const baseSafeBunks = calculateSafeBunks(baseAttended, baseTotal, threshold);
  const baseNeedToAttend = calculateClassesToAttend(baseAttended, baseTotal, threshold);
  const baseStatus = getStatusCategory(basePercentage, threshold);

  // Simulated calculations
  const simAttended = baseAttended + simAttendedOffset;
  const simTotal = baseTotal + simAttendedOffset + simMissedOffset;
  const simPercentage = calculatePercentage(simAttended, simTotal);
  const simSafeBunks = calculateSafeBunks(simAttended, simTotal, threshold);
  const simNeedToAttend = calculateClassesToAttend(simAttended, simTotal, threshold);
  const simStatus = getStatusCategory(simPercentage, threshold);

  const isSimulated = simAttendedOffset > 0 || simMissedOffset > 0;
  const diffPercentage = Number((simPercentage - basePercentage).toFixed(1));

  // Will skipping the NEXT single lecture drop attendance below threshold?
  const willNextSkipDrop = useMemo(() => {
    if (simPercentage < threshold) return true;
    const nextPct = calculatePercentage(simAttended, simTotal + 1);
    return nextPct < threshold;
  }, [simAttended, simTotal, simPercentage, threshold]);

  const nextSkipPct = calculatePercentage(simAttended, simTotal + 1);
  const nextAttendPct = calculatePercentage(simAttended + 1, simTotal + 1);

  const handleSimulateAttend = () => {
    setSimAttendedOffset((prev) => prev + 1);
  };

  const handleSimulateMiss = () => {
    setSimMissedOffset((prev) => prev + 1);
  };

  const handleResetSimulation = () => {
    setSimAttendedOffset(0);
    setSimMissedOffset(0);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#635BDB', '#8B5CF6', '#10B981', '#38BDF8']
    });
  };

  // SVG Gauge calculations
  // Arc from 180 deg to 0 deg (semi-circle)
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference - (Math.min(100, simPercentage) / 100) * circumference;
  const thresholdAngle = (threshold / 100) * 180; // 0 to 180 degrees

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden transition-all ${
      compact ? 'p-5' : 'p-6 lg:p-8'
    }`}>
      {/* Header with Title & Threshold Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-light text-primary">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {subject ? `${subject.name} (${subject.code})` : 'Smart Bunk Budget Engine'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exact integer mathematical calculations for safe bunking & recovery targets.
          </p>
        </div>

        {/* Threshold Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-600">Threshold:</span>
          <select
            value={threshold}
            onChange={(e) => {
              const val = Number(e.target.value);
              setThreshold(val);
              if (onThresholdChange) onThresholdChange(val);
            }}
            className="bg-transparent text-xs font-bold text-primary focus:outline-none cursor-pointer"
          >
            <option value={75}>75% (Standard College)</option>
            <option value={80}>80% (Strict)</option>
            <option value={85}>85% (High Requirement)</option>
            <option value={70}>70% (Relaxed)</option>
            <option value={65}>65% (Minimum Passing)</option>
          </select>
        </div>
      </div>

      {/* Main Visual Display: Bunk Budget Hero & Circular Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
        {/* Left Column: Visual Semicircular Attendance Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
          <div className="relative w-52 h-28 flex items-end justify-center overflow-hidden">
            <svg className="w-52 h-52 transform -rotate-180" viewBox="0 0 200 200">
              {/* Background Arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="16"
                strokeDasharray={circumference}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Progress Arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={simPercentage >= threshold ? '#635BDB' : '#EF4444'}
                strokeWidth="16"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Center percentage value */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {simPercentage}%
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${
                simPercentage >= threshold
                  ? 'bg-emerald-100/70 text-emerald-800'
                  : 'bg-rose-100/70 text-rose-800'
              }`}>
                {simPercentage >= threshold ? 'Safe Zone' : 'Below Threshold'}
              </span>
            </div>
          </div>

          {/* Gauge Legend & Threshold Marker */}
          <div className="w-full flex justify-between items-center text-xs text-slate-500 font-medium px-4 mt-2">
            <span>0%</span>
            <div className="flex items-center gap-1 text-primary font-semibold text-[11px] bg-primary-light px-2 py-0.5 rounded-md">
              <span>Goal: {threshold}%</span>
            </div>
            <span>100%</span>
          </div>

          <div className="text-xs text-slate-500 mt-3 flex items-center gap-3">
            <span>Attended: <strong className="text-slate-800">{simAttended}</strong></span>
            <span>•</span>
            <span>Conducted: <strong className="text-slate-800">{simTotal}</strong></span>
          </div>
        </div>

        {/* Right Column: Prominent Bunk Budget Metric Card */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className={`p-6 rounded-2xl border transition-all ${
            simSafeBunks > 0
              ? 'bg-gradient-to-br from-primary-subtle/80 via-white to-indigo-50/40 border-primary/20 shadow-sm'
              : 'bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40 border-rose-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                {simSafeBunks > 0 ? (
                  <>
                    <Flame className="w-4 h-4 text-primary fill-primary/20" />
                    Your Safe Bunk Budget
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Attendance Recovery Mode
                  </>
                )}
              </span>

              {isSimulated && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  Simulation Active
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className={`text-5xl lg:text-6xl font-black tracking-tight ${
                simSafeBunks > 0 ? 'text-primary' : 'text-rose-600'
              }`}>
                {simSafeBunks > 0 ? simSafeBunks : simNeedToAttend}
              </span>
              <div>
                <p className="text-base font-bold text-slate-900 leading-none">
                  {simSafeBunks > 0 ? 'Lectures can be safely skipped' : 'Consecutive classes required'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {simSafeBunks > 0
                    ? `Without falling below the ${threshold}% requirement`
                    : `To recover back to ${threshold}% minimum attendance`}
                </p>
              </div>
            </div>

            {/* Status Summary Pill */}
            <div className="mt-5 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Current Margin:</span>
                <span className={`font-bold ${
                  simPercentage >= threshold ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {simPercentage >= threshold
                    ? `+${(simPercentage - threshold).toFixed(1)}% above cutoff`
                    : `-${(threshold - simPercentage).toFixed(1)}% below cutoff`}
                </span>
              </div>

              {simSafeBunks > 3 && (
                <button
                  onClick={handleCelebrate}
                  className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Great cushion! 🎉
                </button>
              )}
            </div>
          </div>

          {/* Warning Banner if skipping next lecture drops below threshold */}
          {willNextSkipDrop && (
            <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Caution: High Risk Zone!</span>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Missing even <strong>1 more lecture</strong> drops your attendance to{' '}
                  <strong className="underline">{nextSkipPct}%</strong>, which breaches the required {threshold}% cutoff!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Simulator Section */}
      <div className="mt-2 pt-6 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">Interactive What-If Simulator</span>
            <span className="text-[11px] text-slate-400 font-medium">Test scenarios before skipping</span>
          </div>

          {isSimulated && (
            <button
              onClick={handleResetSimulation}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Simulation
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option A: Attend Next Lecture */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  If You Attend Next Class
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  +{Number((nextAttendPct - simPercentage).toFixed(1))}%
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-900">{nextAttendPct}%</span>
                <span className="text-xs text-emerald-700 font-medium">
                  ({simAttended + 1}/{simTotal + 1} classes)
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                Yields {calculateSafeBunks(simAttended + 1, simTotal + 1, threshold)} safe bunks.
              </p>
            </div>

            <button
              onClick={handleSimulateAttend}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              + Simulate Attending Next
            </button>
          </div>

          {/* Option B: Skip Next Lecture */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            nextSkipPct < threshold
              ? 'border-rose-200 bg-rose-50/50'
              : 'border-slate-200 bg-slate-50/60'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  nextSkipPct < threshold ? 'text-rose-800' : 'text-slate-700'
                }`}>
                  <TrendingDown className={`w-4 h-4 ${nextSkipPct < threshold ? 'text-rose-600' : 'text-slate-500'}`} />
                  If You Skip Next Class
                </span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  nextSkipPct < threshold ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {Number((nextSkipPct - simPercentage).toFixed(1))}%
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-2xl font-black ${
                  nextSkipPct < threshold ? 'text-rose-900' : 'text-slate-800'
                }`}>
                  {nextSkipPct}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ({simAttended}/{simTotal + 1} classes)
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${
                nextSkipPct < threshold ? 'text-rose-700 font-medium' : 'text-slate-500'
              }`}>
                {nextSkipPct < threshold
                  ? `⚠️ Drops below mandatory ${threshold}%!`
                  : `Remaining safe bunks: ${calculateSafeBunks(simAttended, simTotal + 1, threshold)}`}
              </p>
            </div>

            <button
              onClick={handleSimulateMiss}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              - Simulate Skipping Next
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Policy Note:</strong> Calculations assume standard continuous attendance models. Colleges may have special medical leave policies, attendance condonation fees, or laboratory practical minimums that vary by department.
        </p>
      </div>
    </div>
  );
}

