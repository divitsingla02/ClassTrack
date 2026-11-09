/**
 * Initial Mock Data for ClassTrack
 * Pre-populated with realistic engineering/college course details
 */

export const INITIAL_SUBJECTS = [
  {
    id: 'sub-dsa-101',
    code: 'CS-301',
    name: 'Data Structures and Algorithms',
    faculty: 'Prof. Robert Vance',
    email: 'r.vance@tech.edu',
    color: '#635BDB', // Primary Indigo
    bgLight: '#EEEDFE',
    borderCol: '#C7D2FE',
    attended: 36,
    total: 38, // 36 / 38 = 94.7% (Excellent > 90%)
    threshold: 75,
    room: 'Lab 402',
    notes: 'Practical lab exam scheduled for end of month.'
  },
  {
    id: 'sub-dbms-102',
    code: 'CS-302',
    name: 'Database Management Systems',
    faculty: 'Dr. Jennifer Martinez',
    email: 'j.martinez@tech.edu',
    color: '#0EA5E9', // Sky Blue
    bgLight: '#E0F2FE',
    borderCol: '#BAE6FD',
    attended: 28,
    total: 34, // 28 / 34 = 82.4% (Safe 75-89%)
    threshold: 75,
    room: 'Lecture Hall 105',
    notes: 'SQL project submissions due next Friday.'
  },
  {
    id: 'sub-math-103',
    code: 'MA-204',
    name: 'Discrete Mathematics',
    faculty: 'Prof. Ananya Sharma',
    email: 'a.sharma@tech.edu',
    color: '#EF4444', // Red/Critical
    bgLight: '#FEF2F2',
    borderCol: '#FECACA',
    attended: 20,
    total: 31, // 20 / 31 = 64.5% (Critical < 65%)
    threshold: 75,
    room: 'Room 301',
    notes: 'Need consecutive attendances to recover attendance.'
  },
  {
    id: 'sub-ai-104',
    code: 'AI-305',
    name: 'Fundamentals of AI',
    faculty: 'Dr. Kevin Chen',
    email: 'k.chen@tech.edu',
    color: '#8B5CF6', // Purple/Violet
    bgLight: '#F3EEFF',
    borderCol: '#DDD6FE',
    attended: 26,
    total: 30, // 26 / 30 = 86.7% (Safe)
    threshold: 75,
    room: 'AI Seminar Hall',
    notes: 'Search algorithms & heuristic evaluation.'
  },
  {
    id: 'sub-cn-105',
    code: 'CS-306',
    name: 'Computer Networks',
    faculty: 'Prof. David Miller',
    email: 'd.miller@tech.edu',
    color: '#F59E0B', // Amber/Warning
    bgLight: '#FFFBEB',
    borderCol: '#FDE68A',
    attended: 23,
    total: 30, // 23 / 30 = 76.7% (Warning/On edge close to 75%)
    threshold: 75,
    room: 'Networking Lab 2',
    notes: 'Only 0-1 bunks left before dropping below 75%!'
  },
  {
    id: 'sub-bc-106',
    code: 'HS-102',
    name: 'Business Communication',
    faculty: 'Ms. Sarah Jenkins',
    email: 's.jenkins@tech.edu',
    color: '#10B981', // Emerald
    bgLight: '#ECFDF5',
    borderCol: '#A7F3D0',
    attended: 19,
    total: 21, // 19 / 21 = 90.5% (Excellent)
    threshold: 75,
    room: 'Auditorium B',
    notes: 'Executive presentation pitch mock sessions.'
  }
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:15 AM - 11:15 AM',
  '11:30 AM - 12:30 PM',
  '01:30 PM - 02:30 PM',
  '02:45 PM - 03:45 PM',
  '04:00 PM - 05:00 PM',
];

export const INITIAL_TIMETABLE = [
  // Monday
  {
    id: 'tt-mon-1',
    day: 'Monday',
    timeSlot: '09:00 AM - 10:00 AM',
    subjectId: 'sub-dsa-101',
    room: 'Lab 402',
    type: 'Lecture'
  },
  {
    id: 'tt-mon-2',
    day: 'Monday',
    timeSlot: '10:15 AM - 11:15 AM',
    subjectId: 'sub-dbms-102',
    room: 'Lecture Hall 105',
    type: 'Lecture'
  },
  {
    id: 'tt-mon-3',
    day: 'Monday',
    timeSlot: '11:30 AM - 12:30 PM',
    subjectId: 'sub-math-103',
    room: 'Room 301',
    type: 'Tutorial'
  },
  {
    id: 'tt-mon-4',
    day: 'Monday',
    timeSlot: '01:30 PM - 02:30 PM',
    subjectId: 'sub-ai-104',
    room: 'AI Seminar Hall',
    type: 'Lecture'
  },

  // Tuesday
  {
    id: 'tt-tue-1',
    day: 'Tuesday',
    timeSlot: '09:00 AM - 10:00 AM',
    subjectId: 'sub-cn-105',
    room: 'Networking Lab 2',
    type: 'Lab'
  },
  {
    id: 'tt-tue-2',
    day: 'Tuesday',
    timeSlot: '10:15 AM - 11:15 AM',
    subjectId: 'sub-cn-105',
    room: 'Networking Lab 2',
    type: 'Lab'
  },
  {
    id: 'tt-tue-3',
    day: 'Tuesday',
    timeSlot: '01:30 PM - 02:30 PM',
    subjectId: 'sub-bc-106',
    room: 'Auditorium B',
    type: 'Workshop'
  },
  {
    id: 'tt-tue-4',
    day: 'Tuesday',
    timeSlot: '02:45 PM - 03:45 PM',
    subjectId: 'sub-dsa-101',
    room: 'Lab 402',
    type: 'Lecture'
  },

  // Wednesday
  {
    id: 'tt-wed-1',
    day: 'Wednesday',
    timeSlot: '09:00 AM - 10:00 AM',
    subjectId: 'sub-math-103',
    room: 'Room 301',
    type: 'Lecture'
  },
  {
    id: 'tt-wed-2',
    day: 'Wednesday',
    timeSlot: '10:15 AM - 11:15 AM',
    subjectId: 'sub-dbms-102',
    room: 'Lecture Hall 105',
    type: 'Lecture'
  },
  {
    id: 'tt-wed-3',
    day: 'Wednesday',
    timeSlot: '11:30 AM - 12:30 PM',
    subjectId: 'sub-ai-104',
    room: 'AI Seminar Hall',
    type: 'Lecture'
  },
  {
    id: 'tt-wed-4',
    day: 'Wednesday',
    timeSlot: '02:45 PM - 03:45 PM',
    subjectId: 'sub-bc-106',
    room: 'Auditorium B',
    type: 'Presentation'
  },

  // Thursday
  {
    id: 'tt-thu-1',
    day: 'Thursday',
    timeSlot: '09:00 AM - 10:00 AM',
    subjectId: 'sub-dsa-101',
    room: 'Lab 402',
    type: 'Hands-on'
  },
  {
    id: 'tt-thu-2',
    day: 'Thursday',
    timeSlot: '10:15 AM - 11:15 AM',
    subjectId: 'sub-cn-105',
    room: 'Room 204',
    type: 'Lecture'
  },
  {
    id: 'tt-thu-3',
    day: 'Thursday',
    timeSlot: '01:30 PM - 02:30 PM',
    subjectId: 'sub-math-103',
    room: 'Room 301',
    type: 'Lecture'
  },
  {
    id: 'tt-thu-4',
    day: 'Thursday',
    timeSlot: '02:45 PM - 03:45 PM',
    subjectId: 'sub-dbms-102',
    room: 'Lecture Hall 105',
    type: 'Lab'
  },

  // Friday
  {
    id: 'tt-fri-1',
    day: 'Friday',
    timeSlot: '09:00 AM - 10:00 AM',
    subjectId: 'sub-ai-104',
    room: 'AI Seminar Hall',
    type: 'Lecture'
  },
  {
    id: 'tt-fri-2',
    day: 'Friday',
    timeSlot: '10:15 AM - 11:15 AM',
    subjectId: 'sub-dsa-101',
    room: 'Lab 402',
    type: 'Lecture'
  },
  {
    id: 'tt-fri-3',
    day: 'Friday',
    timeSlot: '11:30 AM - 12:30 PM',
    subjectId: 'sub-cn-105',
    room: 'Room 204',
    type: 'Lecture'
  },
  {
    id: 'tt-fri-4',
    day: 'Friday',
    timeSlot: '01:30 PM - 02:30 PM',
    subjectId: 'sub-bc-106',
    room: 'Auditorium B',
    type: 'Interactive'
  },

  // Saturday
  {
    id: 'tt-sat-1',
    day: 'Saturday',
    timeSlot: '09:00 AM - 10:00 AM',
    subjectId: 'sub-math-103',
    room: 'Room 301',
    type: 'Revision'
  },
  {
    id: 'tt-sat-2',
    day: 'Saturday',
    timeSlot: '10:15 AM - 11:15 AM',
    subjectId: 'sub-dbms-102',
    room: 'Lecture Hall 105',
    type: 'Doubt Clearing'
  }
];

export const INITIAL_ACTIVITY = [
  {
    id: 'act-1',
    subjectId: 'sub-dsa-101',
    subjectName: 'Data Structures and Algorithms',
    type: 'present',
    timestamp: 'Today at 09:55 AM',
    date: '2026-11-08',
    note: 'Marked Present via One-Click'
  },
  {
    id: 'act-2',
    subjectId: 'sub-math-103',
    subjectName: 'Discrete Mathematics',
    type: 'absent',
    timestamp: 'Yesterday at 11:30 AM',
    date: '2026-11-07',
    note: 'Marked Absent'
  },
  {
    id: 'act-3',
    subjectId: 'sub-cn-105',
    subjectName: 'Computer Networks',
    type: 'present',
    timestamp: 'Nov 06 at 10:15 AM',
    date: '2026-11-06',
    note: 'Marked Present'
  },
  {
    id: 'act-4',
    subjectId: 'sub-dbms-102',
    subjectName: 'Database Management Systems',
    type: 'present',
    timestamp: 'Nov 05 at 02:45 PM',
    date: '2026-11-05',
    note: 'Marked Present'
  },
  {
    id: 'act-5',
    subjectId: 'sub-ai-104',
    subjectName: 'Fundamentals of AI',
    type: 'present',
    timestamp: 'Nov 04 at 01:30 PM',
    date: '2026-11-04',
    note: 'Marked Present'
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Alex Morgan',
  studentId: 'CS-2024-042',
  institution: 'Apex Institute of Technology',
  department: 'Computer Science & Engineering',
  semester: 'Semester 5 (Fall 2026)',
  email: 'alex.morgan@student.apex.edu',
  attendanceThreshold: 75,
  notifications: true,
  theme: 'system',
};

