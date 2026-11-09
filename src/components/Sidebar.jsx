import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  CheckCircle,
  Calculator,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Flame,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ isOpen, onClose }) {
  const { overallStats, profile } = useApp();

  const navItems = [
    { name: 'Overview', to: '/', icon: LayoutDashboard },
    { name: 'My Timetable', to: '/timetable', icon: CalendarDays },
    { name: 'Attendance', to: '/attendance', icon: CheckCircle },
    {
      name: 'Bunk Calculator',
      to: '/calculator',
      icon: Calculator,
      badge: 'Smart USP',
      highlight: true
    },
    { name: 'Subjects', to: '/subjects', icon: BookOpen },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-border-default/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-border-default/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center text-white shadow-md shadow-primary/25 font-bold tracking-wider text-base">
              CT
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">ClassTrack</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary-light text-primary border border-primary/20">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Stay on track. Know when to skip.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-5 px-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/30 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4.5 h-4.5 transition-colors ${
                        isActive ? 'text-white' : item.highlight ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold tracking-tight px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-light text-primary'
                        }`}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Bunk Status Mini-Card */}
        <div className="p-3.5 mx-3.5 mb-3 rounded-2xl bg-gradient-to-br from-primary-subtle to-slate-50 border border-primary/15 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-primary fill-primary/30" />
              Bunk Budget
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white text-slate-800 border border-primary/20 shadow-xs">
              {overallStats.overallPercentage}%
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-extrabold text-slate-900">
              {overallStats.safeBunks}{' '}
              <span className="text-xs font-medium text-slate-500">safe bunks</span>
            </div>
          </div>

          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-2.5">
            <div
              className={`h-full transition-all duration-500 ${
                overallStats.overallPercentage >= 75 ? 'bg-primary' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, overallStats.overallPercentage)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 font-medium">
            <span>Threshold: {profile.attendanceThreshold || 75}%</span>
            <span className={overallStats.overallPercentage >= 75 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              {overallStats.overallPercentage >= 75 ? 'Safe Zone' : 'Below 75%'}
            </span>
          </div>
        </div>

        {/* Student Profile Footer */}
        <div className="p-3.5 border-t border-border-default/60 flex items-center gap-3 bg-slate-50/50">
          <div className="w-9 h-9 rounded-full bg-slate-200 border border-white ring-2 ring-primary/20 flex items-center justify-center font-semibold text-slate-700 text-sm overflow-hidden shrink-0">
            {profile.name ? profile.name.charAt(0) : 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{profile.name}</p>
            <p className="text-xs text-slate-500 truncate">{profile.studentId} • Sem 5</p>
          </div>
          <NavLink
            to="/settings"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
            title="Account Settings"
          >
            <ChevronRight className="w-4 h-4" />
          </NavLink>
        </div>
      </aside>
    </>
  );
}

