import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const { profile, searchQuery, setSearchQuery, overallStats, activity, subjects } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile.name ? profile.name.split(' ')[0] : 'Student';

  // Format current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const criticalSubjects = overallStats.subjectsBelowThreshold;

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-border-default/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger + Greeting & Date */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-primary">{firstName}</span>!
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              On Track
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium hidden xs:block">{formattedDate}</p>
        </div>
      </div>

      {/* Middle/Right: Search, Quick Actions, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, faculty, code..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Bunk Calculator Trigger Button */}
        <button
          onClick={() => navigate('/calculator')}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm hover:bg-primary-hover transition shadow-primary/25 active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bunk Calculator</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {criticalSubjects.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">Notifications</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {criticalSubjects.length} Alerts
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {criticalSubjects.length > 0 ? (
                    criticalSubjects.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/calculator');
                        }}
                        className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 hover:bg-rose-100/60 transition cursor-pointer flex gap-3"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-rose-900">
                            Low Attendance: {sub.name} ({sub.percentage}%)
                          </p>
                          <p className="text-[11px] text-rose-700 mt-0.5">
                            Must attend next <strong className="underline">{sub.requiredToRecover} classes</strong> to reach 75%.
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-80" />
                      <p className="text-xs font-semibold text-slate-700">All subjects are safe!</p>
                      <p className="text-[11px] text-slate-400">You are above minimum requirements across all classes.</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Recent Activity
                    </p>
                    {activity.slice(0, 3).map((act) => (
                      <div key={act.id} className="text-xs py-1 flex items-center justify-between text-slate-600">
                        <span className="truncate pr-2">{act.subjectName}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          act.type === 'present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {act.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/attendance"
                  onClick={() => setShowNotifications(false)}
                  className="mt-2 block text-center py-2 text-xs font-semibold text-primary hover:text-primary-hover bg-primary-subtle rounded-xl"
                >
                  View Full Attendance Ledger →
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          to="/settings"
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-violet-500 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
            {profile.name ? profile.name.charAt(0) : 'A'}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}

