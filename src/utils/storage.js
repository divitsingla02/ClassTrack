import {
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_ACTIVITY,
  INITIAL_USER_PROFILE
} from '../data/mockData';

const STORAGE_KEYS = {
  SUBJECTS: 'classtrack_subjects_v1',
  TIMETABLE: 'classtrack_timetable_v1',
  ACTIVITY: 'classtrack_activity_v1',
  PROFILE: 'classtrack_profile_v1',
};

export function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

export function loadSubjects() {
  return getStoredData(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
}

export function saveSubjects(subjects) {
  setStoredData(STORAGE_KEYS.SUBJECTS, subjects);
}

export function loadTimetable() {
  return getStoredData(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
}

export function saveTimetable(timetable) {
  setStoredData(STORAGE_KEYS.TIMETABLE, timetable);
}

export function loadActivity() {
  return getStoredData(STORAGE_KEYS.ACTIVITY, INITIAL_ACTIVITY);
}

export function saveActivity(activity) {
  setStoredData(STORAGE_KEYS.ACTIVITY, activity);
}

export function loadProfile() {
  return getStoredData(STORAGE_KEYS.PROFILE, INITIAL_USER_PROFILE);
}

export function saveProfile(profile) {
  setStoredData(STORAGE_KEYS.PROFILE, profile);
}

export function resetAllStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(INITIAL_TIMETABLE));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(INITIAL_ACTIVITY));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
  } catch (err) {
    console.error('Failed to reset storage:', err);
  }
}

export function clearAttendanceData() {
  try {
    const subjects = loadSubjects().map(sub => ({
      ...sub,
      attended: 0,
      total: 0
    }));
    saveSubjects(subjects);
    saveActivity([]);
    return subjects;
  } catch (err) {
    console.error('Failed to clear attendance:', err);
    return [];
  }
}

