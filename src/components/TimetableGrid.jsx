import React, { useState, useMemo } from 'react';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../data/mockData';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  User,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Layers
} from 'lucide-react';

export default function TimetableGrid({
  timetable,
  subjects,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  onMarkAttendance
}) {
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'day'
  const [selectedDay, setSelectedDay] = useState(() => {
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    if (todayIndex >= 1 && todayIndex <= 6) {
      return DAYS_OF_WEEK[todayIndex - 1];
    }
    return 'Monday';
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterSubjectId, setFilterSubjectId] = useState('all');

  // Compute current day of week
  const currentDayName = useMemo(() => {
    const day = new Date().getDay();
    if (day >= 1 && day <= 6) return DAYS_OF_WEEK[day - 1];
    return null;
  }, []);

  // Map subjects by ID for easy O(1) lookup
  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [subjects]);

  // Filter timetable
  const filteredTimetable = useMemo(() => {
    let list = timetable;
    if (filterSubjectId !== 'all') {
      list = list.filter((slot) => slot.subjectId === filterSubjectId);
    }
    return list;
  }, [timetable, filterSubjectId]);

  // Build grid data: map[day][timeSlot] = slotObject
  const gridMatrix = useMemo(() => {
    const matrix = {};
    DAYS_OF_WEEK.forEach((d) => {
      matrix[d] = {};
      TIME_SLOTS.forEach((t) => {
        matrix[d][t] = null;
      });
    });

    filteredTimetable.forEach((slot) => {
      if (matrix[slot.day] && matrix[slot.day][slot.timeSlot] !== undefined) {
        matrix[slot.day][slot.timeSlot] = slot;
      }
    });

    return matrix;
  }, [filteredTimetable]);

  const displayedDays = viewMode === 'week' ? DAYS_OF_WEEK : [selectedDay];

  // Week date range display
  const getWeekRangeString = () => {
    const curr = new Date();
    curr.setDate(curr.getDate() + weekOffset * 7);
    const first = curr.getDate() - curr.getDay() + 1; // First day is Monday
    const firstDay = new Date(curr.setDate(first));
    const lastDay = new Date(curr.setDate(first + 5)); // Sat

    return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Week / Day switcher */}
          <div className="flex p-1 bg-slate-200/60 rounded-xl">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily View
            </button>
          </div>

          {/* Week navigation */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl px-2 py-1 shadow-2xs">
            <button
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2 min-w-[140px] text-center">
              {getWeekRangeString()}
            </span>
            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="text-[11px] font-bold text-primary hover:underline ml-1 px-1.5 py-0.5 rounded bg-primary-light"
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Right side: Subject Filter & Add Lecture Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onAddSlot()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lecture</span>
          </button>
        </div>
      </div>

      {/* Day Selector (for Day View) */}
      {viewMode === 'day' && (
        <div className="px-4 sm:px-6 py-2 border-b border-slate-100 flex gap-2 overflow-x-auto bg-white">
          {DAYS_OF_WEEK.map((day) => {
            const isToday = currentDayName === day;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-primary'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[850px] divide-y divide-slate-100">
          {/* Header Row: Days */}
          <div className="grid grid-cols-12 bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-700">
            {/* Time Slot column header */}
            <div className="col-span-2 p-3 text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Slot</span>
            </div>

            {/* Days columns */}
            {displayedDays.map((day) => {
              const isToday = currentDayName === day && weekOffset === 0;
              const colSpan = viewMode === 'week' ? 'col-span-10 sm:col-span-10 lg:col-span-auto' : 'col-span-10';

              return (
                <div
                  key={day}
                  className={`p-3 text-center border-l border-slate-200/60 ${
                    viewMode === 'week' ? 'flex-1' : 'col-span-10'
                  } ${isToday ? 'bg-primary-subtle/50' : ''}`}
                  style={viewMode === 'week' ? { width: `${100 / displayedDays.length}%` } : {}}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={isToday ? 'text-primary font-black' : 'text-slate-800'}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary text-white uppercase tracking-wider">
                        Today
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slot Rows */}
          {TIME_SLOTS.map((slotTime) => (
            <div key={slotTime} className="grid grid-cols-12 min-h-[96px] group hover:bg-slate-50/30 transition-colors">
              {/* Time Label */}
              <div className="col-span-2 p-3 text-xs font-semibold text-slate-500 bg-slate-50/30 flex flex-col justify-center border-r border-slate-100">
                <span className="text-slate-800 font-bold">{slotTime.split(' - ')[0]}</span>
                <span className="text-[11px] text-slate-400">to {slotTime.split(' - ')[1]}</span>
              </div>

              {/* Day cells */}
              <div
                className={`col-span-10 flex divide-x divide-slate-100`}
              >
                {displayedDays.map((day) => {
                  const lecture = gridMatrix[day]?.[slotTime];
                  const subject = lecture ? subjectMap[lecture.subjectId] : null;
                  const isToday = currentDayName === day && weekOffset === 0;

                  return (
                    <div
                      key={day}
                      className={`flex-1 p-2 relative flex flex-col justify-between transition-colors ${
                        isToday ? 'bg-primary-subtle/20' : ''
                      }`}
                    >
                      {lecture && subject ? (
                        /* Class Card */
                        <div
                          className="h-full w-full rounded-xl p-2.5 border transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between group/card relative"
                          style={{
                            backgroundColor: subject.bgLight || '#F8FAFC',
                            borderColor: subject.borderCol || '#E2E8F0',
                          }}
                        >
                          <div>
                            {/* Header: Code & Type */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider"
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                  color: subject.color || '#635BDB'
                                }}
                              >
                                {subject.code}
                              </span>
                              <span className="text-[10px] font-medium text-slate-500 bg-white/70 px-1.5 py-0.5 rounded">
                                {lecture.type || 'Lecture'}
                              </span>
                            </div>

                            {/* Subject Name */}
                            <h5
                              className="text-xs font-bold leading-tight line-clamp-2"
                              style={{ color: '#0F172A' }}
                            >
                              {subject.name}
                            </h5>

                            {/* Room & Faculty */}
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-600">
                              <span className="flex items-center gap-0.5 font-medium">
                                <MapPin className="w-2.5 h-2.5 opacity-60" />
                                {lecture.room || subject.room}
                              </span>
                              <span className="flex items-center gap-0.5 text-slate-500 truncate max-w-[110px]">
                                <User className="w-2.5 h-2.5 opacity-60" />
                                {subject.faculty?.split(' ').slice(-1)[0]}
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions (Mark attendance right from schedule) */}
                          <div className="mt-2 pt-1.5 border-t border-slate-900/10 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onMarkAttendance && onMarkAttendance(subject.id, 'present', `Attended ${day} ${slotTime}`)}
                                title="Mark Present for this class"
                                className="p-1 rounded bg-white hover:bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-200 transition"
                              >
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </button>
                              <button
                                onClick={() => onMarkAttendance && onMarkAttendance(subject.id, 'absent', `Missed ${day} ${slotTime}`)}
                                title="Mark Absent for this class"
                                className="p-1 rounded bg-white hover:bg-rose-50 text-rose-700 shadow-2xs border border-rose-200 transition"
                              >
                                <X className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>

                            {/* Edit / Delete slot controls */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditSlot(lecture)}
                                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-white/80"
                                title="Edit slot details"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteSlot(lecture.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white/80"
                                title="Remove class"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Free Period Cell */
                        <div
                          onClick={() => onAddSlot({ day, timeSlot: slotTime })}
                          className="h-full w-full rounded-xl border border-dashed border-slate-200/90 hover:border-primary/40 hover:bg-primary-subtle/30 transition-all cursor-pointer flex flex-col items-center justify-center p-2 text-center group/free"
                        >
                          <span className="text-[10px] font-medium text-slate-400 group-hover/free:text-primary transition-colors flex items-center gap-1">
                            <Plus className="w-3 h-3 opacity-0 group-hover/free:opacity-100 transition-opacity" />
                            Free Period
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

