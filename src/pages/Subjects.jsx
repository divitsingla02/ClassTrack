import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SubjectCard from '../components/SubjectCard';
import Modal from '../components/Modal';
import BunkCalculator from '../components/BunkCalculator';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  AlertTriangle,
  User,
  Mail,
  MapPin,
  Palette
} from 'lucide-react';

const PRESET_COLORS = [
  { color: '#635BDB', bgLight: '#EEEDFE', borderCol: '#C7D2FE', label: 'Indigo' },
  { color: '#0EA5E9', bgLight: '#E0F2FE', borderCol: '#BAE6FD', label: 'Sky' },
  { color: '#8B5CF6', bgLight: '#F3EEFF', borderCol: '#DDD6FE', label: 'Violet' },
  { color: '#10B981', bgLight: '#ECFDF5', borderCol: '#A7F3D0', label: 'Emerald' },
  { color: '#F59E0B', bgLight: '#FFFBEB', borderCol: '#FDE68A', label: 'Amber' },
  { color: '#EF4444', bgLight: '#FEF2F2', borderCol: '#FECACA', label: 'Rose' },
  { color: '#EC4899', bgLight: '#FDF2F8', borderCol: '#FBCFE8', label: 'Pink' },
  { color: '#14B8A6', bgLight: '#CCFBF1', borderCol: '#99F6E4', label: 'Teal' },
];

export default function Subjects() {
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    threshold: globalThreshold,
    searchQuery
  } = useApp();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formFaculty, setFormFaculty] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formThreshold, setFormThreshold] = useState(75);
  const [formAttended, setFormAttended] = useState('0');
  const [formTotal, setFormTotal] = useState('0');
  const [formSelectedColor, setFormSelectedColor] = useState(PRESET_COLORS[0]);

  // Analytics preview modal
  const [selectedSubjectForAnalytics, setSelectedSubjectForAnalytics] = useState(null);

  // Deletion confirmation
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormCode('');
    setFormName('');
    setFormFaculty('');
    setFormEmail('');
    setFormRoom('');
    setFormThreshold(globalThreshold || 75);
    setFormAttended('0');
    setFormTotal('0');
    setFormSelectedColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setFormCode(subject.code);
    setFormName(subject.name);
    setFormFaculty(subject.faculty || '');
    setFormEmail(subject.email || '');
    setFormRoom(subject.room || '');
    setFormThreshold(subject.threshold || globalThreshold || 75);
    setFormAttended(subject.attended.toString());
    setFormTotal(subject.total.toString());
    const matchedColor = PRESET_COLORS.find((c) => c.color === subject.color) || PRESET_COLORS[0];
    setFormSelectedColor(matchedColor);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        faculty: formFaculty.trim(),
        email: formEmail.trim(),
        room: formRoom.trim(),
        threshold: Number(formThreshold),
        attended: Math.max(0, parseInt(formAttended, 10) || 0),
        total: Math.max(0, parseInt(formTotal, 10) || 0),
        color: formSelectedColor.color,
        bgLight: formSelectedColor.bgLight,
        borderCol: formSelectedColor.borderCol,
      });
    } else {
      addSubject({
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        faculty: formFaculty.trim(),
        email: formEmail.trim(),
        room: formRoom.trim(),
        threshold: Number(formThreshold),
        attended: Math.max(0, parseInt(formAttended, 10) || 0),
        total: Math.max(0, parseInt(formTotal, 10) || 0),
        color: formSelectedColor.color,
        bgLight: formSelectedColor.bgLight,
        borderCol: formSelectedColor.borderCol,
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete.id);
      setSubjectToDelete(null);
    }
  };

  const displayedSubjects = subjects.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.faculty?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Subject & Course Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your registered courses, faculty instructors, individual threshold cutoffs, and color identities.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSubjects.map((sub) => (
          <SubjectCard
            key={sub.id}
            subject={sub}
            threshold={globalThreshold}
            onEdit={handleOpenEdit}
            onDelete={(id) => setSubjectToDelete(sub)}
            onViewAnalytics={(s) => setSelectedSubjectForAnalytics(s)}
          />
        ))}
      </div>

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? `Edit Subject: ${editingSubject.code}` : 'Add New Subject'}
        subtitle="Configure course parameters, attendance criteria and faculty"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Subject Code *
              </label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="e.g. CS-301"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Room / Venue
              </label>
              <input
                type="text"
                value={formRoom}
                onChange={(e) => setFormRoom(e.target.value)}
                placeholder="e.g. Lab 402"
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
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Data Structures and Algorithms"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Faculty Instructor
              </label>
              <input
                type="text"
                value={formFaculty}
                onChange={(e) => setFormFaculty(e.target.value)}
                placeholder="e.g. Dr. Robert Vance"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Faculty Email (Optional)
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="r.vance@tech.edu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Color Identity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Color Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => {
                const isSelected = formSelectedColor.color === c.color;
                return (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setFormSelectedColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attended
              </label>
              <input
                type="number"
                min="0"
                value={formAttended}
                onChange={(e) => setFormAttended(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Conducted
              </label>
              <input
                type="number"
                min="0"
                value={formTotal}
                onChange={(e) => setFormTotal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cutoff %
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={formThreshold}
                onChange={(e) => setFormThreshold(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs"
            >
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Subject Confirmation Modal */}
      <Modal
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        title={`Delete Subject: ${subjectToDelete?.name}?`}
        subtitle="This action will delete the subject and its timetable slots"
      >
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs mb-4">
          <p className="font-bold">⚠️ Warning:</p>
          <p className="mt-0.5">
            Deleting <strong>{subjectToDelete?.name} ({subjectToDelete?.code})</strong> will also remove all corresponding scheduled lecture periods from your timetable.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setSubjectToDelete(null)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
          >
            Confirm Delete
          </button>
        </div>
      </Modal>

      {/* Analytics / Bunk Simulator Modal */}
      {selectedSubjectForAnalytics && (
        <Modal
          isOpen={!!selectedSubjectForAnalytics}
          onClose={() => setSelectedSubjectForAnalytics(null)}
          title={`Subject Analytics: ${selectedSubjectForAnalytics.name}`}
          subtitle={`Subject Code: ${selectedSubjectForAnalytics.code} • Faculty: ${selectedSubjectForAnalytics.faculty}`}
          maxWidth="max-w-2xl"
        >
          <BunkCalculator
            subject={selectedSubjectForAnalytics}
            customThreshold={selectedSubjectForAnalytics.threshold || globalThreshold}
            compact={true}
          />
        </Modal>
      )}
    </div>
  );
}

