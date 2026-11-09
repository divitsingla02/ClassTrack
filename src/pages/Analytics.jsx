import React from 'react';
import { useApp } from '../context/AppContext';
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateClassesToAttend,
  getStatusCategory,
  STATUS_CONFIG
} from '../utils/attendanceCalculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  AlertTriangle,
  Award,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function Analytics() {
  const { subjects, threshold, overallStats } = useApp();

  // Prepare Subject Comparison Data
  const subjectComparisonData = subjects.map((sub) => {
    const attended = Number(sub.attended || 0);
    const total = Number(sub.total || 0);
    const pct = calculatePercentage(attended, total);
    const bunks = calculateSafeBunks(attended, total, threshold);
    const missed = Math.max(0, total - attended);

    return {
      name: sub.code,
      fullName: sub.name,
      attendance: pct,
      attended,
      missed,
      total,
      safeBunks: bunks,
      color: sub.color || '#635BDB'
    };
  });

  // Prepare Attended vs Absent Pie Data
  const pieData = [
    { name: 'Attended', value: overallStats.totalAttended, color: '#10B981' },
    { name: 'Missed', value: overallStats.totalMissed, color: '#EF4444' }
  ];

  // Attendance Category Distribution Data
  const categoryData = [
    { name: 'Excellent (≥90%)', count: overallStats.excellentCount, color: '#10B981' },
    { name: 'Safe (75–89%)', count: overallStats.safeCount, color: '#3B82F6' },
    { name: 'Warning (65–74%)', count: overallStats.warningCount, color: '#F59E0B' },
    { name: 'Critical (<65%)', count: overallStats.criticalCount, color: '#EF4444' }
  ].filter(c => c.count > 0);

  // Subject Trend / Projected trajectory data
  const simulatedTrendData = [
    { stage: 'Month 1', overall: Math.min(100, overallStats.overallPercentage - 3) },
    { stage: 'Month 2', overall: Math.min(100, overallStats.overallPercentage - 1) },
    { stage: 'Current', overall: overallStats.overallPercentage },
    { stage: 'If +3 Attended', overall: calculatePercentage(overallStats.totalAttended + 3, overallStats.totalConducted + 3) },
    { stage: 'If +5 Attended', overall: calculatePercentage(overallStats.totalAttended + 5, overallStats.totalConducted + 5) }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Attendance Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data visualizations and performance metrics driven by your actual recorded attendance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Institutional Threshold: <strong>{threshold}%</strong></span>
        </div>
      </div>

      {/* Top 4 Performance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">Aggregate Standing</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900">{overallStats.overallPercentage}%</span>
            <span className={`text-xs font-bold ${overallStats.overallPercentage >= threshold ? 'text-emerald-600' : 'text-rose-600'}`}>
              {overallStats.overallPercentage >= threshold ? 'Eligible' : 'At Risk'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {overallStats.overallPercentage >= threshold
              ? `+${(overallStats.overallPercentage - threshold).toFixed(1)}% above cutoff`
              : `-${(threshold - overallStats.overallPercentage).toFixed(1)}% below required`}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Bunk Cushion</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-primary">{overallStats.safeBunks}</span>
            <span className="text-xs font-semibold text-slate-500">safe skips</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across {subjects.length} enrolled subjects
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">Attendance Ratio</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-emerald-600">
              {overallStats.totalAttended}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ {overallStats.totalConducted} classes</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {overallStats.totalMissed} total absences recorded
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">Subject Health</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900">
              {subjects.length - overallStats.subjectsBelowThreshold.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">of {subjects.length} safe</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {overallStats.subjectsBelowThreshold.length > 0 ? (
              <span className="text-rose-600 font-semibold">{overallStats.subjectsBelowThreshold.length} below {threshold}%</span>
            ) : (
              <span className="text-emerald-600 font-semibold">100% courses above cutoff</span>
            )}
          </div>
        </div>
      </div>

      {/* Primary Chart: Subject-wise Attendance vs Cutoff */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Subject-wise Attendance Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current attendance percentages relative to the mandatory {threshold}% cutoff line
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-3 h-3 rounded bg-primary" />
              Above Threshold
            </span>
            <span className="flex items-center gap-1.5 font-medium text-rose-600">
              <span className="w-3 h-3 rounded bg-rose-500" />
              Below Cutoff
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs">
                        <p className="font-bold">{data.fullName}</p>
                        <p className="text-slate-400 font-mono">{data.name}</p>
                        <div className="mt-2 space-y-1">
                          <p>Attendance: <strong className="text-primary-light">{data.attendance}%</strong></p>
                          <p>Record: <strong>{data.attended} / {data.total}</strong></p>
                          <p>Safe Bunks: <strong className="text-amber-400">{data.safeBunks}</strong></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={threshold}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{
                  value: `Min ${threshold}%`,
                  fill: '#EF4444',
                  fontSize: 11,
                  position: 'insideTopRight'
                }}
              />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                {subjectComparisonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.attendance >= threshold ? '#635BDB' : '#EF4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Row: Distribution Pie Chart & Lecture Counts Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Present vs Absent Ratio */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Lecture Participation Ratio</h3>
            <p className="text-xs text-slate-500 mt-0.5">Overall distribution of attended vs missed lectures</p>
          </div>

          <div className="h-64 w-full my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Lectures (${((val / overallStats.totalConducted) * 100).toFixed(1)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">Attended</span>
              <span className="text-lg font-black text-emerald-900">
                {overallStats.totalAttended} <span className="text-xs font-semibold">({overallStats.overallPercentage}%)</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
              <span className="text-[10px] font-bold uppercase text-rose-800 block">Missed / Bunked</span>
              <span className="text-lg font-black text-rose-900">
                {overallStats.totalMissed} <span className="text-xs font-semibold">({(100 - overallStats.overallPercentage).toFixed(1)}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Course Breakdown: Attended vs Missed by Subject */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Lectures Breakdown by Course</h3>
            <p className="text-xs text-slate-500 mt-0.5">Absolute count of attended versus absent sessions</p>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="attended" name="Attended" fill="#10B981" stackId="a" radius={[0, 0, 4, 4]} />
                <Bar dataKey="missed" name="Missed" fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Aggregated across all registered periods</span>
            <span className="font-semibold text-slate-700">Total sessions: {overallStats.totalConducted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

