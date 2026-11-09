import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateClassesToAttend,
  getStatusCategory,
  STATUS_CONFIG
} from '../utils/attendanceCalculations';
import { DAYS_OF_WEEK } from '../data/mockData';
import {
  Percent,
  CheckCircle,
  CalendarCheck,
  Flame,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  Check,
  X,
  History,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BunkCalculator from '../components/BunkCalculator';
import Modal from '../components/Modal';

export default function Dashboard() {
  const {
    subjects,
    timetable,
    overallStats,
    profile,
    threshold,
    activity,
    markAttendance,
    searchQuery
  } = useApp();

  const navigate = useNavigate();
  const [selectedSubjectForCalc, setSelectedSubjectForCalc] = useState(null);

  // Compute Today's classes
  const todayDayName = useMemo(() => {
    const day = new Date().getDay();
    if (day >= 1 && day <= 6) return DAYS_OF_WEEK[day - 1];
    return 'Monday'; // Default to Monday on Sunday
  }, []);

  const todayClasses = useMemo(() => {
    return timetable
      .filter((slot) => slot.day === todayDayName)
      .map((slot) => {
        const sub = subjects.find((s) => s.id === slot.subjectId);
        return {
          ...slot,
          subject: sub || { name: 'Unknown Subject', code: 'N/A', color: '#635BDB' }
        };
      })
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  }, [timetable, todayDayName, subjects]);

  // Filtered subjects based on navbar search query
  const displayedSubjects = useMemo(() => {
    if (!searchQuery) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.faculty?.toLowerCase().includes(q)
    );
  }, [subjects, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Heading & Tagline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ClassTrack Productivity Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your academic life, under control.
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl font-normal">
            Track attendance, manage your schedule and stay ahead of your classes with mathematically verified bunk safety margins.
          </p>
        </div>

        {/* Quick CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/calculator"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-md shadow-primary/25 transition active:scale-98"
          >
            <Flame className="w-4 h-4 fill-white/20" />
            <span>Open Bunk Budget Engine</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Attendance"
          value={`${overallStats.overallPercentage}%`}
          subvalue={`Goal: ${threshold}%`}
          icon={Percent}
          colorClass={overallStats.overallPercentage >= threshold ? 'text-primary' : 'text-rose-600'}
          bgClass={overallStats.overallPercentage >= threshold ? 'bg-primary-light' : 'bg-rose-50'}
          progress={overallStats.overallPercentage}
          progressColor={overallStats.overallPercentage >= threshold ? 'bg-primary' : 'bg-rose-500'}
          badge={
            overallStats.overallPercentage >= threshold
              ? `Safe (+${(overallStats.overallPercentage - threshold).toFixed(1)}%)`
              : `At Risk (-${(threshold - overallStats.overallPercentage).toFixed(1)}%)`
          }
          badgeType={overallStats.overallPercentage >= threshold ? 'success' : 'danger'}
        />

        <StatCard
          title="Lectures Attended"
          value={overallStats.totalAttended}
          subvalue={`of ${overallStats.totalConducted} classes`}
          icon={CheckCircle}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          progress={
            overallStats.totalConducted > 0
              ? (overallStats.totalAttended / overallStats.totalConducted) * 100
              : 100
          }
          progressColor="bg-emerald-500"
          badge={`${overallStats.totalMissed} absences logged`}
          badgeType="info"
        />

        <StatCard
          title="Lectures Conducted"
          value={overallStats.totalConducted}
          subvalue="across all courses"
          icon={CalendarCheck}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          badge={`${subjects.length} Enrolled Courses`}
          badgeType="purple"
        />

        <StatCard
          title="Safe Bunks Remaining"
          value={overallStats.safeBunks}
          subvalue="total skip allowance"
          icon={Flame}
          colorClass={overallStats.safeBunks > 0 ? 'text-amber-500' : 'text-rose-600'}
          bgClass={overallStats.safeBunks > 0 ? 'bg-amber-50' : 'bg-rose-50'}
          badge={
            overallStats.safeBunks > 0
              ? `${overallStats.safeBunks} skips allowed`
              : 'Zero safe skips'
          }
          badgeType={overallStats.safeBunks > 0 ? 'warning' : 'danger'}
        />
      </div>

      {/* Critical Alert if any subject is below 75% */}
      {overallStats.subjectsBelowThreshold.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 text-sm">
                Attention Required: {overallStats.subjectsBelowThreshold.length}{' '}
                {overallStats.subjectsBelowThreshold.length === 1 ? 'subject is' : 'subjects are'} below {threshold}% attendance!
              </h4>
              <p className="text-xs text-rose-700 mt-1">
                You must attend consecutive upcoming classes without absences to restore your eligibility before examinations.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {overallStats.subjectsBelowThreshold.map((sub) => (
                  <span
                    key={sub.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs font-semibold text-rose-800 shadow-2xs"
                  >
                    <span>{sub.code}: {sub.percentage}%</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 font-bold">
                      Attend next {sub.requiredToRecover}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/calculator"
            className="self-start sm:self-center shrink-0 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition shadow-xs active:scale-98 flex items-center gap-1.5"
          >
            <span>View Recovery Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Middle Grid: Today's Timetable + Smart Bunk Budget Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Today's Classes & Quick Attendance */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Today's Schedule</h3>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-light text-primary uppercase tracking-wider">
                    {todayDayName}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {todayClasses.length} lectures scheduled for today
                </p>
              </div>

              <Link
                to="/timetable"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                Full Timetable <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List of today's classes */}
            <div className="space-y-3">
              {todayClasses.length > 0 ? (
                todayClasses.map((item) => {
                  const sub = item.subject;
                  const pct = calculatePercentage(sub.attended, sub.total);
                  const safeBunks = calculateSafeBunks(sub.attended, sub.total, threshold);

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-primary/40 hover:bg-slate-50/50"
                      style={{
                        borderColor: sub.borderCol || '#E2E8F0',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-1.5 self-stretch rounded-full shrink-0"
                          style={{ backgroundColor: sub.color || '#635BDB' }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded border uppercase"
                              style={{
                                color: sub.color || '#635BDB',
                                backgroundColor: sub.bgLight || '#EEEDFE',
                                borderColor: sub.borderCol || '#C7D2FE',
                              }}
                            >
                              {sub.code}
                            </span>
                            <span className="text-xs font-semibold text-slate-900">
                              {sub.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.timeSlot}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.room || sub.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Attendance Mark buttons */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right pr-2">
                          <span className="text-xs font-bold text-slate-800 block">
                            {pct}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {safeBunks} safe skips
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              markAttendance(sub.id, 'present', `Attended today's class (${item.timeSlot})`)
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition active:scale-98 flex items-center gap-1"
                            title="Mark Present"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span className="hidden xs:inline">Present</span>
                          </button>
                          <button
                            onClick={() =>
                              markAttendance(sub.id, 'absent', `Missed today's class (${item.timeSlot})`)
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition active:scale-98 flex items-center gap-1"
                            title="Mark Absent"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span className="hidden xs:inline">Absent</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <CalendarCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No classes scheduled today!</p>
                  <p className="text-xs text-slate-400 mt-0.5">Enjoy your free day or review upcoming topics.</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject-wise attendance overview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Course Attendance Overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time status across your registered courses</p>
              </div>

              <Link
                to="/attendance"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                View Ledger <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {displayedSubjects.map((sub) => {
                const attended = Number(sub.attended || 0);
                const total = Number(sub.total || 0);
                const pct = calculatePercentage(attended, total);
                const bunks = calculateSafeBunks(attended, total, threshold);
                const recover = calculateClassesToAttend(attended, total, threshold);
                const status = getStatusCategory(pct, threshold);
                const statusInfo = STATUS_CONFIG[status];

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubjectForCalc(sub)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sub.color || '#635BDB' }}
                        />
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {sub.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({sub.code})
                        </span>
                      </div>

                      <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pct >= threshold ? 'bg-primary' : 'bg-rose-500'} rounded-full`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                      <div className="text-right">
                        <span className="font-black text-slate-900">{pct}%</span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({attended}/{total})
                        </span>
                      </div>

                      <div className="min-w-[100px] text-right">
                        {bunks > 0 ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1">
                            <Flame className="w-3 h-3 text-emerald-600" />
                            {bunks} safe {bunks === 1 ? 'bunk' : 'bunks'}
                          </span>
                        ) : recover > 0 ? (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Need {recover}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            0 safe bunks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Smart Bunk Calculator Preview & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Prominent Bunk Budget Widget */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/10">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                Smart Bunk Budget
              </span>
              <span className="text-xs font-mono text-slate-300">
                Cutoff: {threshold}%
              </span>
            </div>

            <div className="my-5">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Total Safe Lectures to Skip
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-6xl font-black text-white tracking-tight">
                  {overallStats.safeBunks}
                </span>
                <span className="text-sm font-medium text-slate-300">
                  classes across semester
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your current {overallStats.overallPercentage}% aggregate attendance, you have a cushion of {overallStats.safeBunks} safe absences before dipping below the mandatory {threshold}% threshold.
            </p>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/calculator"
                className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-md active:scale-98"
              >
                <span>Launch Interactive What-If Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Attendance Activity Stream */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-slate-900 text-base">Recent Attendance Activity</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Last 5 logs</span>
            </div>

            <div className="space-y-3">
              {activity.length > 0 ? (
                activity.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        act.type === 'present'
                          ? 'bg-emerald-50 text-emerald-600'
                          : act.type === 'absent'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {act.type === 'present' ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : act.type === 'absent' ? (
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {act.subjectName}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {act.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {act.note || (act.type === 'present' ? 'Marked Present' : 'Marked Absent')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No recent attendance activity logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Calculator Modal for Selected Subject from Table */}
      {selectedSubjectForCalc && (
        <Modal
          isOpen={!!selectedSubjectForCalc}
          onClose={() => setSelectedSubjectForCalc(null)}
          title={`Bunk Budget: ${selectedSubjectForCalc.name}`}
          subtitle={`Subject Code: ${selectedSubjectForCalc.code} • Faculty: ${selectedSubjectForCalc.faculty}`}
          maxWidth="max-w-2xl"
        >
          <BunkCalculator
            subject={selectedSubjectForCalc}
            customThreshold={threshold}
            compact={true}
          />
        </Modal>
      )}
    </div>
  );
}

