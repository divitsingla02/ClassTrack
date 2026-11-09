import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadSubjects,
  saveSubjects,
  loadTimetable,
  saveTimetable,
  loadActivity,
  saveActivity,
  loadProfile,
  saveProfile,
  resetAllStorage,
  clearAttendanceData
} from '../utils/storage';
import { calculateOverallStats } from '../utils/attendanceCalculations';
import { INITIAL_SUBJECTS, INITIAL_TIMETABLE, INITIAL_ACTIVITY, INITIAL_USER_PROFILE } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [subjects, setSubjectsState] = useState(() => loadSubjects());
  const [timetable, setTimetableState] = useState(() => loadTimetable());
  const [activity, setActivityState] = useState(() => loadActivity());
  const [profile, setProfileState] = useState(() => loadProfile());
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  const updateSubjects = (newSubjects) => {
    setSubjectsState(newSubjects);
    saveSubjects(newSubjects);
  };

  const updateTimetable = (newTimetable) => {
    setTimetableState(newTimetable);
    saveTimetable(newTimetable);
  };

  const updateActivity = (newActivity) => {
    setActivityState(newActivity);
    saveActivity(newActivity);
  };

  const updateProfileState = (newProfile) => {
    setProfileState(newProfile);
    saveProfile(newProfile);
  };

  // Toast System
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global threshold
  const threshold = profile?.attendanceThreshold || 75;

  // Real-time Overall Stats calculation
  const overallStats = calculateOverallStats(subjects, threshold);

  // Mark Attendance (Present / Absent)
  const markAttendance = (subjectId, status, customNote) => {
    const targetSubject = subjects.find((s) => s.id === subjectId);
    if (!targetSubject) return;

    const attendedChange = status === 'present' ? 1 : 0;
    const newAttended = Number(targetSubject.attended || 0) + attendedChange;
    const newTotal = Number(targetSubject.total || 0) + 1;

    const updatedSubjects = subjects.map((sub) => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          attended: newAttended,
          total: newTotal,
        };
      }
      return sub;
    });

    updateSubjects(updatedSubjects);

    // Format readable time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];

    const newActivityItem = {
      id: `act-${Date.now()}`,
      subjectId,
      subjectName: targetSubject.name,
      type: status,
      timestamp: `Today at ${timeString}`,
      date: dateString,
      note: customNote || (status === 'present' ? 'Marked Present' : 'Marked Absent'),
    };

    updateActivity([newActivityItem, ...activity.slice(0, 49)]);

    if (status === 'present') {
      addToast(`Marked Present for ${targetSubject.code} (${targetSubject.name})`, 'success');
    } else {
      addToast(`Marked Absent for ${targetSubject.code} (${targetSubject.name})`, 'warning');
    }
  };

  // Edit attendance numbers directly
  const editAttendance = (subjectId, attended, total, reason = '') => {
    const numAttended = Math.max(0, parseInt(attended, 10) || 0);
    const numTotal = Math.max(numAttended, parseInt(total, 10) || 0);

    const targetSubject = subjects.find((s) => s.id === subjectId);
    if (!targetSubject) return;

    const updatedSubjects = subjects.map((sub) => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          attended: numAttended,
          total: numTotal,
        };
      }
      return sub;
    });

    updateSubjects(updatedSubjects);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newActivityItem = {
      id: `act-${Date.now()}`,
      subjectId,
      subjectName: targetSubject.name,
      type: 'edit',
      timestamp: `Today at ${timeString}`,
      date: now.toISOString().split('T')[0],
      note: reason || `Updated to ${numAttended}/${numTotal} lectures`,
    };

    updateActivity([newActivityItem, ...activity.slice(0, 49)]);
    addToast(`Updated attendance for ${targetSubject.name}`, 'info');
  };

  // Add Subject
  const addSubject = (newSubjectData) => {
    const id = `sub-${Date.now()}`;
    const newSubject = {
      id,
      code: newSubjectData.code.trim().toUpperCase(),
      name: newSubjectData.name.trim(),
      faculty: newSubjectData.faculty?.trim() || 'Unassigned Faculty',
      email: newSubjectData.email?.trim() || '',
      color: newSubjectData.color || '#635BDB',
      bgLight: newSubjectData.bgLight || '#EEEDFE',
      borderCol: newSubjectData.borderCol || '#C7D2FE',
      attended: Number(newSubjectData.attended || 0),
      total: Number(newSubjectData.total || 0),
      threshold: Number(newSubjectData.threshold || threshold),
      room: newSubjectData.room?.trim() || 'General Hall',
      notes: newSubjectData.notes?.trim() || '',
    };

    updateSubjects([...subjects, newSubject]);
    addToast(`Subject "${newSubject.name}" added successfully!`, 'success');
  };

  // Update Subject details
  const updateSubject = (subjectId, fields) => {
    const updated = subjects.map((sub) => {
      if (sub.id === subjectId) {
        return { ...sub, ...fields };
      }
      return sub;
    });
    updateSubjects(updated);
    addToast('Subject details updated!', 'success');
  };

  // Delete Subject & associated timetable entries
  const deleteSubject = (subjectId) => {
    const target = subjects.find((s) => s.id === subjectId);
    const updatedSubjects = subjects.filter((s) => s.id !== subjectId);
    const updatedTimetable = timetable.filter((slot) => slot.subjectId !== subjectId);

    updateSubjects(updatedSubjects);
    updateTimetable(updatedTimetable);

    addToast(`Deleted "${target?.name || 'Subject'}" and associated schedule blocks`, 'info');
  };

  // Timetable CRUD
  const addTimetableSlot = (slotData) => {
    const newSlot = {
      id: `tt-${Date.now()}`,
      day: slotData.day,
      timeSlot: slotData.timeSlot,
      subjectId: slotData.subjectId,
      room: slotData.room || 'TBD',
      type: slotData.type || 'Lecture',
    };

    updateTimetable([...timetable, newSlot]);
    addToast(`Added class to ${slotData.day} timetable!`, 'success');
  };

  const updateTimetableSlot = (slotId, fields) => {
    const updated = timetable.map((slot) => {
      if (slot.id === slotId) {
        return { ...slot, ...fields };
      }
      return slot;
    });
    updateTimetable(updated);
    addToast('Timetable slot updated!', 'success');
  };

  const deleteTimetableSlot = (slotId) => {
    const updated = timetable.filter((slot) => slot.id !== slotId);
    updateTimetable(updated);
    addToast('Class removed from timetable', 'info');
  };

  // Profile / Settings
  const updateProfile = (fields) => {
    const updated = { ...profile, ...fields };
    updateProfileState(updated);
    addToast('Settings & Profile updated!', 'success');
  };

  // Reset to Mock Data
  const resetDemoData = () => {
    resetAllStorage();
    setSubjectsState(INITIAL_SUBJECTS);
    setTimetableState(INITIAL_TIMETABLE);
    setActivityState(INITIAL_ACTIVITY);
    setProfileState(INITIAL_USER_PROFILE);
    addToast('Reset application to original demo data!', 'info');
  };

  // Clear all attendance records
  const clearAttendanceRecords = () => {
    const cleared = clearAttendanceData();
    setSubjectsState(cleared);
    setActivityState([]);
    addToast('All attendance records have been reset to zero.', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        subjects,
        timetable,
        activity,
        profile,
        threshold,
        overallStats,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        markAttendance,
        editAttendance,
        addSubject,
        updateSubject,
        deleteSubject,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        updateProfile,
        resetDemoData,
        clearAttendanceRecords,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

