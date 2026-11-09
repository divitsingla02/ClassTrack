import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TimetableGrid from '../components/TimetableGrid';
import Modal from '../components/Modal';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../data/mockData';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Sparkles,
  Info,
  CalendarCheck
} from 'lucide-react';

export default function Timetable() {
  const {
    timetable,
    subjects,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    markAttendance
  } = useApp();

  // Modals state
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);

  const [formDay, setFormDay] = useState('Monday');
  const [formTimeSlot, setFormTimeSlot] = useState(TIME_SLOTS[0]);
  const [formSubjectId, setFormSubjectId] = useState(subjects[0]?.id || '');
  const [formRoom, setFormRoom] = useState('');
  const [formType, setFormType] = useState('Lecture');

  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const handleOpenAdd = (prefill) => {
    setEditingSlotId(null);
    setFormDay(prefill?.day || 'Monday');
    setFormTimeSlot(prefill?.timeSlot || TIME_SLOTS[0]);
    setFormSubjectId(subjects[0]?.id || '');
    setFormRoom(subjects[0]?.room || 'Room 101');
    setFormType('Lecture');
    setIsSlotModalOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingSlotId(slot.id);
    setFormDay(slot.day);
    setFormTimeSlot(slot.timeSlot);
    setFormSubjectId(slot.subjectId);
    setFormRoom(slot.room || '');
    setFormType(slot.type || 'Lecture');
    setIsSlotModalOpen(true);
  };

  const handleSlotFormSubmit = (e) => {
    e.preventDefault();
    if (!formSubjectId) return;

    if (editingSlotId) {
      updateTimetableSlot(editingSlotId, {
        day: formDay,
        timeSlot: formTimeSlot,
        subjectId: formSubjectId,
        room: formRoom,
        type: formType,
      });
    } else {
      addTimetableSlot({
        day: formDay,
        timeSlot: formTimeSlot,
        subjectId: formSubjectId,
        room: formRoom,
        type: formType,
      });
    }

    setIsSlotModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationId) {
      deleteTimetableSlot(deleteConfirmationId);
      setDeleteConfirmationId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Weekly Schedule & Timetable
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual calendar grid with slot management, free periods, and integrated attendance logging.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lecture to Schedule</span>
        </button>
      </div>

      {/* Main Timetable Component */}
      <TimetableGrid
        timetable={timetable}
        subjects={subjects}
        onAddSlot={handleOpenAdd}
        onEditSlot={handleOpenEdit}
        onDeleteSlot={(id) => setDeleteConfirmationId(id)}
        onMarkAttendance={markAttendance}
      />

      {/* Quick Legend & Help Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Click any "Free Period" dashed block to quickly schedule a class into that vacant slot.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Checkmark = Mark Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Cross = Mark Absent
          </span>
        </div>
      </div>

      {/* Add / Edit Lecture Slot Modal */}
      <Modal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        title={editingSlotId ? 'Edit Timetable Slot' : 'Add Class to Schedule'}
        subtitle="Specify the day, time slot, course and venue"
      >
        <form onSubmit={handleSlotFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject *
            </label>
            <select
              value={formSubjectId}
              onChange={(e) => {
                const subId = e.target.value;
                setFormSubjectId(subId);
                const match = subjects.find((s) => s.id === subId);
                if (match && match.room) setFormRoom(match.room);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              required
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} – {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Day of Week *
              </label>
              <select
                value={formDay}
                onChange={(e) => setFormDay(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Time Slot *
              </label>
              <select
                value={formTimeSlot}
                onChange={(e) => setFormTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Session Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Practical Lab</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSlotModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs"
            >
              {editingSlotId ? 'Save Changes' : 'Add to Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Slot Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmationId}
        onClose={() => setDeleteConfirmationId(null)}
        title="Remove Lecture from Timetable?"
        subtitle="This will free up the time slot on this day"
      >
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Are you sure you want to remove this lecture from your weekly schedule? (Your existing attendance figures will not be affected).
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteConfirmationId(null)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
          >
            Remove Slot
          </button>
        </div>
      </Modal>
    </div>
  );
}

