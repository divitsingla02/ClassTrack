import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import AttendanceCard from '../components/AttendanceCard';
import Modal from '../components/Modal';
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateClassesToAttend,
  getStatusCategory,
  STATUS_CONFIG
} from '../utils/attendanceCalculations';
import {
  CheckCircle,
  Plus,
  Filter,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Check,
  X,
  Edit2,
  Flame,
  AlertTriangle,
  History,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function Attendance() {
  const {
    subjects,
    markAttendance,
    editAttendance,
    addSubject,
    threshold,
    activity,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'excellent' | 'safe' | 'warning' | 'critical'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modals state
  const [editingSubject, setEditingSubject] = useState(null);
  const [editAttended, setEditAttended] = useState('');
  const [editTotal, setEditTotal] = useState('');
  const [editReason, setEditReason] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubFaculty, setNewSubFaculty] = useState('');
  const [newSubAttended, setNewSubAttended] = useState('0');
  const [newSubTotal, setNewSubTotal] = useState('0');
  const [newSubRoom, setNewSubRoom] = useState('');

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Filter subjects by search and status category
  const filteredSubjects = useMemo(() => {
    return subjects.filter((sub) => {
      const pct = calculatePercentage(sub.attended, sub.total);
      const cat = getStatusCategory(pct, sub.threshold || threshold);

      const matchesStatus = statusFilter === 'all' || cat === statusFilter;
      const matchesSearch =
        !searchQuery ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.faculty?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [subjects, statusFilter, searchQuery, threshold]);

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setEditAttended(subject.attended.toString());
    setEditTotal(subject.total.toString());
    setEditReason('Manual correction');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingSubject) return;
    editAttendance(
      editingSubject.id,
      parseInt(editAttended, 10) || 0,
      parseInt(editTotal, 10) || 0,
      editReason
    );
    setEditingSubject(null);
  };

  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!newSubCode.trim() || !newSubName.trim()) return;

    addSubject({
      code: newSubCode,
      name: newSubName,
      faculty: newSubFaculty,
      attended: parseInt(newSubAttended, 10) || 0,
      total: parseInt(newSubTotal, 10) || 0,
      room: newSubRoom,
      threshold: threshold,
    });

    setIsAddModalOpen(false);
    setNewSubCode('');
    setNewSubName('');
    setNewSubFaculty('');
    setNewSubAttended('0');
    setNewSubTotal('0');
    setNewSubRoom('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendance Ledger & Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking with one-click present/absent markings and automatic recalculations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-2xs"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Audit History</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Filter & View Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Filter:</span>
          {[
            { id: 'all', label: 'All Subjects' },
            { id: 'excellent', label: 'Excellent (≥90%)' },
            { id: 'safe', label: 'Safe (75–89%)' },
            { id: 'warning', label: 'Warning (65–74%)' },
            { id: 'critical', label: 'Critical (<65%)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === item.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* View mode toggle (Cards vs Table) & Search indicator */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Detailed Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Cards View or Table View */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-soft">
          <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No subjects match your filter</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your status filter or clearing your search term to see all enrolled subjects.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <AttendanceCard
              key={subject.id}
              subject={subject}
              threshold={threshold}
              onMarkPresent={(id) => markAttendance(id, 'present')}
              onMarkAbsent={(id) => markAttendance(id, 'absent')}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Faculty</th>
                  <th className="py-3.5 px-4 text-center">Attended / Total</th>
                  <th className="py-3.5 px-4 text-center">Missed</th>
                  <th className="py-3.5 px-4">Attendance %</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Safe Bunks</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredSubjects.map((sub) => {
                  const attended = Number(sub.attended || 0);
                  const total = Number(sub.total || 0);
                  const missed = Math.max(0, total - attended);
                  const pct = calculatePercentage(attended, total);
                  const subThreshold = Number(sub.threshold || threshold);
                  const status = getStatusCategory(pct, subThreshold);
                  const statusConfig = STATUS_CONFIG[status];
                  const bunks = calculateSafeBunks(attended, total, subThreshold);
                  const recover = calculateClassesToAttend(attended, total, subThreshold);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: sub.color || '#635BDB' }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{sub.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">{sub.code}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">{sub.faculty || '—'}</td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {attended} / {total}
                      </td>

                      <td className="py-3.5 px-4 text-center text-slate-500">{missed}</td>

                      <td className="py-3.5 px-4">
                        <div className="w-32">
                          <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                            <span className={pct >= subThreshold ? 'text-primary' : 'text-rose-600'}>
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${pct >= subThreshold ? 'bg-primary' : 'bg-rose-500'} rounded-full`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badgeClass}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${statusConfig.dotColor}`} />
                          {statusConfig.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {bunks > 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                            <Flame className="w-3 h-3 text-emerald-600" />
                            {bunks} safe
                          </span>
                        ) : recover > 0 ? (
                          <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Need {recover}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => markAttendance(sub.id, 'present')}
                            title="Mark Present"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => markAttendance(sub.id, 'absent')}
                            title="Mark Absent"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            title="Edit Numbers"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Attendance Entry Modal */}
      <Modal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        title={`Edit Attendance: ${editingSubject?.name}`}
        subtitle={`Adjust recorded attendance figures for ${editingSubject?.code}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lectures Attended
              </label>
              <input
                type="number"
                min="0"
                value={editAttended}
                onChange={(e) => setEditAttended(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Lectures Conducted
              </label>
              <input
                type="number"
                min={editAttended || 0}
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Adjustment (Optional)
            </label>
            <input
              type="text"
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              placeholder="e.g. Duty leave approved, teacher corrected register"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex justify-between items-center font-medium">
            <span className="text-slate-500">New Calculated Attendance:</span>
            <span className="font-bold text-slate-900 text-sm">
              {calculatePercentage(parseInt(editAttended, 10) || 0, parseInt(editTotal, 10) || 0)}%
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingSubject(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Add New Subject Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Subject"
        subtitle="Register a new course and initialize its attendance ledger"
      >
        <form onSubmit={handleAddSubjectSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Subject Code *
              </label>
              <input
                type="text"
                value={newSubCode}
                onChange={(e) => setNewSubCode(e.target.value)}
                placeholder="e.g. CS-401"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Classroom / Lab
              </label>
              <input
                type="text"
                value={newSubRoom}
                onChange={(e) => setNewSubRoom(e.target.value)}
                placeholder="e.g. Room 304"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject Name *
            </label>
            <input
              type="text"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Faculty / Professor Name
            </label>
            <input
              type="text"
              value={newSubFaculty}
              onChange={(e) => setNewSubFaculty(e.target.value)}
              placeholder="e.g. Prof. Alan Turing"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lectures Attended
              </label>
              <input
                type="number"
                min="0"
                value={newSubAttended}
                onChange={(e) => setNewSubAttended(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Conducted
              </label>
              <input
                type="number"
                min="0"
                value={newSubTotal}
                onChange={(e) => setNewSubTotal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs"
            >
              Create Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Attendance History Audit Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Attendance Activity Audit Trail"
        subtitle="Chronological log of present, absent, and adjustment actions"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {activity.length > 0 ? (
            activity.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{act.subjectName}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        act.type === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.type === 'absent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {act.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.note}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {act.timestamp}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-xs text-slate-400">No activity logs yet.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

