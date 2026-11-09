import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  RotateCcw,
  Trash2,
  Check,
  Sparkles,
  School,
  Mail,
  Sliders,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function Settings() {
  const {
    profile,
    updateProfile,
    resetDemoData,
    clearAttendanceRecords,
    threshold
  } = useApp();

  const [name, setName] = useState(profile.name || '');
  const [studentId, setStudentId] = useState(profile.studentId || '');
  const [institution, setInstitution] = useState(profile.institution || '');
  const [department, setDepartment] = useState(profile.department || '');
  const [semester, setSemester] = useState(profile.semester || '');
  const [email, setEmail] = useState(profile.email || '');
  const [customThreshold, setCustomThreshold] = useState(profile.attendanceThreshold || 75);

  // Modals state
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      studentId,
      institution,
      department,
      semester,
      email,
      attendanceThreshold: Number(customThreshold)
    });
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetModal(false);
  };

  const handleConfirmClear = () => {
    clearAttendanceRecords();
    setShowClearModal(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your academic profile, attendance thresholds, and manage local data persistence.
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-soft">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Profile</h3>
            <p className="text-xs text-slate-500">Your details displayed on reports and dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Student ID / Roll Number
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                College / Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Student Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Attendance Threshold Slider & Number */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-slate-900">
                  Global Minimum Attendance Cutoff
                </label>
                <p className="text-[11px] text-slate-400">
                  Default threshold across all subjects for bunk calculations
                </p>
              </div>
              <span className="text-base font-black text-primary px-3 py-1 rounded-xl bg-primary-light">
                {customThreshold}%
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={customThreshold}
                onChange={(e) => setCustomThreshold(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>50% (Liberal)</span>
              <span>75% (Standard University)</span>
              <span>85% (Strict)</span>
              <span>95% (Honors)</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition active:scale-98 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Profile & Threshold</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone / Data Management Card */}
      <div className="bg-white rounded-2xl border border-rose-200/80 p-6 sm:p-8 shadow-soft">
        <div className="flex items-center gap-3 pb-5 border-b border-rose-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Data Management & Reset</h3>
            <p className="text-xs text-slate-500">Manage persistent LocalStorage cache and records</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Restore Realistic Demo Data</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Restores the standard 6 sample courses, realistic weekly timetable, and demo attendance figures.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition shrink-0 self-start sm:self-auto"
            >
              Reset to Demo Data
            </button>
          </div>

          {/* Clear Attendance Figures */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-rose-900">Clear Attendance Counts (Zero Out)</h4>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Keeps your registered subjects and timetable intact, but resets attended and conducted counters to 0.
              </p>
            </div>
            <button
              onClick={() => setShowClearModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition shrink-0 self-start sm:self-auto"
            >
              Clear Attendance Records
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Reset Demo Data */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Application to Demo Data?"
        subtitle="This will replace current subjects, timetable, and activity"
      >
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          Are you sure you want to restore the initial demo state? Any custom subjects or timetable modifications you added will be overwritten with the original course data.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowResetModal(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmReset}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs"
          >
            Confirm & Reset
          </button>
        </div>
      </Modal>

      {/* Confirmation Modal: Clear Attendance */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Attendance Numbers?"
        subtitle="Zero out attended and conducted lectures"
      >
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          This will set attended and total conducted counts to 0 for all your enrolled courses. Your subjects, professors, and weekly timetable slots will remain untouched.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowClearModal(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmClear}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
          >
            Zero Out Attendance
          </button>
        </div>
      </Modal>
    </div>
  );
}

