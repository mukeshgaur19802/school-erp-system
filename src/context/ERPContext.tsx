'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserRole,
  UserSession,
  Student,
  Teacher,
  DeletedStudent,
  DeletedTeacher,
  AttendanceRecord,
  Homework,
  Classwork,
  ExamMark,
  NotificationItem,
  TimetableSlot,
  BusRoute,
  FeePaymentRecord,
  CalendarEvent,
  PeriodTime,
  DailyOverride,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_HOMEWORK,
  INITIAL_CLASSWORK,
  INITIAL_EXAM_MARKS,
  INITIAL_ATTENDANCE,
  INITIAL_BUS_ROUTES,
} from '../data/initialData';
import { pushToCloud, pullFromCloud } from '../utils/cloudSync';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface ToastAlert {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

// Pre-configured Demo Teacher Mrs. Sharma (Mobile: 0000000000)
const DEMO_TEACHER: Teacher = {
  id: 'TCH-DEMO-001',
  name: 'Mrs. Sharma',
  mobile: '0000000000',
  email: 'sharma@kidzrkidz.edu',
  password: 'teach#321',
  role: 'Class Teacher',
  assignments: [
    {
      className: 'Class 8',
      section: 'A',
      subject: 'Mathematics',
      isClassTeacher: true,
    },
  ],
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  joinDate: '2024-04-01',
};

export const PHOTO_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'EV-1', title: 'Independence Day Celebration', date: '2026-08-15', category: 'Celebration', description: 'Flag hoisting, cultural performances, and patriotic speeches.', targetAudience: 'Everyone' },
  { id: 'EV-2', title: 'Teacher\'s Day Celebration', date: '2026-09-05', category: 'Celebration', description: 'Student-led performances honoring teaching faculty.', targetAudience: 'Everyone' },
  { id: 'EV-3', title: 'Annual Sports Fest 2026', date: '2026-11-14', category: 'Event', description: 'Inter-house athletic meets and relay races.', targetAudience: 'Everyone' },
  { id: 'EV-4', title: 'Diwali School Holiday', date: '2026-11-01', category: 'Holiday', description: 'School closed for Diwali festival.', targetAudience: 'Everyone' },
];

const INITIAL_TIMETABLE_SLOTS: TimetableSlot[] = [
  { id: 'TS-1', day: 'Monday', time: '08:30 AM - 09:15 AM', period: 1, subject: 'Mathematics', className: 'Class 8', section: 'A', teacherName: 'Mrs. Sharma', roomNo: 'Room 204' },
  { id: 'TS-2', day: 'Monday', time: '09:15 AM - 10:00 AM', period: 2, subject: 'Science', className: 'Class 8', section: 'A', teacherName: 'Mr. Singh', roomNo: 'Room 204' },
  { id: 'TS-3', day: 'Monday', time: '10:00 AM - 10:45 AM', period: 3, subject: 'English', className: 'Class 8', section: 'A', teacherName: 'Ms. Gupta', roomNo: 'Room 204' },
  { id: 'TS-4', day: 'Tuesday', time: '08:30 AM - 09:15 AM', period: 1, subject: 'Mathematics', className: 'Class 8', section: 'A', teacherName: 'Mrs. Sharma', roomNo: 'Room 204' },
];

export const DEFAULT_PERIODS: PeriodTime[] = [
  { periodId: 'ZERO', name: 'ZERO', time: '07:30 AM - 07:45 AM', isBreak: false },
  { periodId: '1', name: '1', time: '07:45 AM - 08:25 AM', isBreak: false },
  { periodId: '2', name: '2', time: '08:25 AM - 09:05 AM', isBreak: false },
  { periodId: 'FRUIT', name: 'FRUIT', time: '09:05 AM - 09:15 AM', isBreak: true },
  { periodId: '3', name: '3', time: '09:15 AM - 09:55 AM', isBreak: false },
  { periodId: '4', name: '4', time: '09:55 AM - 10:35 AM', isBreak: false },
  { periodId: '5', name: '5', time: '10:35 AM - 11:15 AM', isBreak: false },
  { periodId: 'LUNCH', name: 'LUNCH', time: '11:15 AM - 11:40 AM', isBreak: true },
  { periodId: '6', name: '6', time: '11:40 AM - 12:20 PM', isBreak: false },
  { periodId: '7', name: '7', time: '12:20 PM - 01:00 PM', isBreak: false },
  { periodId: '8', name: '8', time: '01:00 PM - 01:40 PM', isBreak: false },
  { periodId: 'MUSIC', name: 'MUSIC', time: '01:40 PM - 02:00 PM', isBreak: true }
];

interface ERPContextType {
  isAuthenticated: boolean;
  currentUser: UserSession | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  login: (role: UserRole, userDetails: { email?: string; mobile?: string; name: string; teacherId?: string }) => void;
  logout: () => void;

  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;

  students: Student[];
  teachers: Teacher[];
  deletedStudents: DeletedStudent[];
  deletedTeachers: DeletedTeacher[];
  notifications: NotificationItem[];
  homework: Homework[];
  classwork: Classwork[];
  examMarks: ExamMark[];
  timetable: TimetableSlot[];
  attendance: AttendanceRecord[];
  busRoutes: BusRoute[];
  calendarEvents: CalendarEvent[];
  toasts: ToastAlert[];
  periodConfigs: Record<string, PeriodTime[]>;
  dailyOverrides: DailyOverride[];

  // Actions
  addStudent: (data: Omit<Student, 'id' | 'admissionNo' | 'paymentHistory'> & { customAdmissionNo?: string }) => void;
  editStudent: (id: string, updatedData: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (data: Omit<Teacher, 'id' | 'joinDate'>) => void;
  editTeacher: (id: string, updatedData: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  resetTeacherPassword: (teacherId: string, newPass: string) => void;
  resetStudentPassword: (studentId: string, newPass: string) => void;
  markAttendance: (records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }[], className: string, section: string, date: string) => void;
  addHomework: (data: Omit<Homework, 'id'> & { assignedDate?: string }) => void;
  addClasswork: (data: Omit<Classwork, 'id'> & { date?: string }) => void;
  addExamMarks: (data: Omit<ExamMark, 'id'>[]) => void;
  makeFeePayment: (studentId: string, amount: number, method: 'UPI' | 'Bank' | 'Cash', feeType: string) => void;
  sendNotification: (data: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (id: string) => void;
  addToast: (title: string, message: string, type?: ToastAlert['type']) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
  
  savePeriodConfigs: (classSectionKey: string, configs: PeriodTime[]) => void;
  addDailyOverride: (override: Omit<DailyOverride, 'id'>) => void;
  deleteDailyOverride: (id: string) => void;
  updateTimetableSlot: (slot: TimetableSlot) => void;
  assignClassTeacher: (className: string, section: string, teacherId: string | null) => void;

  currentStudent: Student | null;
  currentTeacher: Teacher | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  activeModal: 'NONE' | 'ID_CARD' | 'REPORT_CARD' | 'FEE_RECEIPT' | 'EDIT_STUDENT' | 'EDIT_TEACHER' | 'INSPECT_TEACHER';
  setActiveModal: (modal: 'NONE' | 'ID_CARD' | 'REPORT_CARD' | 'FEE_RECEIPT' | 'EDIT_STUDENT' | 'EDIT_TEACHER' | 'INSPECT_TEACHER') => void;
  modalData: any;
  setModalData: (data: any) => void;
  cloudSyncStatus: 'CONNECTED' | 'ERROR' | 'SYNCING' | 'LOCAL_ONLY';
  cloudErrorMsg: string;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

// Permanent storage key prefix for permanent data retention
const CURRENT_STORAGE_PREFIX = 'KIDZ_R_KIDZ_ERP_DATA_V1_';
const LEGACY_STORAGE_PREFIXES = ['KIDZ_R_KIDZ_V3_', 'KIDZ_R_KIDZ_V2_', 'KIDZ_R_KIDZ_'];

// Automatic Alphabetical Roll Number Assigner per Class & Section
function recalculateAlphabeticalRollNumbers(rawStudents: Student[]): Student[] {
  const groups: Record<string, Student[]> = {};
  rawStudents.forEach((stu) => {
    const key = `${stu.className}-${stu.section}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(stu);
  });

  const updatedStudents: Student[] = [];
  // Sort the keys alphabetically so classes/sections are grouped in order
  const sortedKeys = Object.keys(groups).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  sortedKeys.forEach((key) => {
    const group = groups[key];
    group.sort((a, b) => a.name.trim().localeCompare(b.name.trim(), undefined, { sensitivity: 'base' }));
    group.forEach((stu, idx) => {
      updatedStudents.push({ ...stu, rollNo: idx + 1 });
    });
  });

  return updatedStudents;
}

function loadStoredData<T>(keySuffix: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  const currentVal = localStorage.getItem(CURRENT_STORAGE_PREFIX + keySuffix);
  if (currentVal) {
    try {
      const parsed = JSON.parse(currentVal);
      if (parsed !== null && parsed !== undefined) {
        return parsed as T;
      }
    } catch (e) {}
  }

  for (const legacyPrefix of LEGACY_STORAGE_PREFIXES) {
    const legacyVal = localStorage.getItem(legacyPrefix + keySuffix);
    if (legacyVal) {
      try {
        const parsed = JSON.parse(legacyVal);
        if (parsed !== null && parsed !== undefined) {
          try { localStorage.setItem(CURRENT_STORAGE_PREFIX + keySuffix, legacyVal); } catch (e) {}
          return parsed as T;
        }
      } catch (e) {}
    }
  }

  return fallback;
}

export const getLocalDateString = () => {
  const date = new Date();
  const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 10);
  return localISOTime;
};

function safeSetStorage(keySuffix: string, value: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_STORAGE_PREFIX + keySuffix, JSON.stringify(value));
  } catch (e) {
    console.warn(`[Storage Warning] Quota exceeded for ${keySuffix}`);
  }
}

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeRole, setActiveRoleState] = useState<UserRole>('ADMIN');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('TCH-DEMO-001');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [activeModal, setActiveModal] = useState<'NONE' | 'ID_CARD' | 'REPORT_CARD' | 'FEE_RECEIPT' | 'EDIT_STUDENT' | 'EDIT_TEACHER' | 'INSPECT_TEACHER'>('NONE');
  const [modalData, setModalData] = useState<any>(null);

  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // State initialization
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [classwork, setClasswork] = useState<Classwork[]>([]);
  const [examMarks, setExamMarks] = useState<ExamMark[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [periodConfigs, setPeriodConfigs] = useState<Record<string, PeriodTime[]>>({});
  const [dailyOverrides, setDailyOverrides] = useState<DailyOverride[]>([]);
  const [deletedStudents, setDeletedStudents] = useState<DeletedStudent[]>([]);
  const [deletedTeachers, setDeletedTeachers] = useState<DeletedTeacher[]>([]);

  // Client-side hydration on mount to prevent Next.js hydration failures
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem(CURRENT_STORAGE_PREFIX + 'USER');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user) {
            setCurrentUser(user);
            if (user.role) setActiveRoleState(user.role);
            if (user.teacherId) setSelectedTeacherId(user.teacherId);
          }
        } catch (e) {}
      }
      const authStr = sessionStorage.getItem(CURRENT_STORAGE_PREFIX + 'AUTH');
      if (authStr === 'true') {
        setIsAuthenticated(true);
      }

      const selectedStudent = sessionStorage.getItem(CURRENT_STORAGE_PREFIX + 'SELECTED_STUDENT_ID') || loadStoredData<string>('SELECTED_STUDENT_ID', '');
      if (selectedStudent) {
        setSelectedStudentId(selectedStudent);
      }
      const selectedTeacher = sessionStorage.getItem(CURRENT_STORAGE_PREFIX + 'SELECTED_TEACHER_ID') || loadStoredData<string>('SELECTED_TEACHER_ID', 'TCH-DEMO-001');
      if (selectedTeacher) {
        setSelectedTeacherId(selectedTeacher);
      }
    }

    setStudents(recalculateAlphabeticalRollNumbers(loadStoredData<Student[]>('STUDENTS', INITIAL_STUDENTS)));
    setTeachers(() => {
      const loaded = loadStoredData<Teacher[]>('TEACHERS', [DEMO_TEACHER]);
      if (!loaded.find((t) => t.mobile === '0000000000')) {
        return [DEMO_TEACHER, ...loaded];
      }
      return loaded;
    });
    setDeletedStudents(loadStoredData<DeletedStudent[]>('DELETED_STUDENTS', []));
    setDeletedTeachers(loadStoredData<DeletedTeacher[]>('DELETED_TEACHERS', []));
    setHomework(loadStoredData<Homework[]>('HOMEWORK', INITIAL_HOMEWORK));
    setClasswork(loadStoredData<Classwork[]>('CLASSWORK', INITIAL_CLASSWORK));
    setExamMarks(loadStoredData<ExamMark[]>('EXAM_MARKS', INITIAL_EXAM_MARKS));
    setNotifications(loadStoredData<NotificationItem[]>('NOTIFICATIONS', INITIAL_NOTIFICATIONS));
    setBusRoutes(loadStoredData<BusRoute[]>('BUS_ROUTES', INITIAL_BUS_ROUTES));
    setCalendarEvents(loadStoredData<CalendarEvent[]>('CALENDAR', INITIAL_CALENDAR_EVENTS));
    setTimetable(loadStoredData<TimetableSlot[]>('TIMETABLE', INITIAL_TIMETABLE_SLOTS));
    setPeriodConfigs(loadStoredData<Record<string, PeriodTime[]>>('PERIOD_CONFIGS', {}));
    setDailyOverrides(loadStoredData<DailyOverride[]>('DAILY_OVERRIDES', []));
  }, []);

  // Track the hash of the last successfully pushed state to prevent local-push loop conflicts
  const lastPushedHashRef = useRef<string>('');
  const isLocalChangePendingRef = useRef<boolean>(false);

  const touchLocalState = () => {
    isLocalChangePendingRef.current = true;
  };

  const [cloudSyncStatus, setCloudSyncStatus] = useState<'CONNECTED' | 'ERROR' | 'SYNCING' | 'LOCAL_ONLY'>('LOCAL_ONLY');
  const [cloudErrorMsg, setCloudErrorMsg] = useState<string>('');

  // Request notification permission for Web Push alerts
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  const triggerPushNotification = (title: string, message: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body: message,
            icon: '/logo.jpg',
          });
        } catch (e) {
          console.error("Failed to trigger native Notification:", e);
        }
      }
    }
  };

  // Trigger native push notifications for newly received notifications targeting the current user
  const processedNotifsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUser) return;
    
    notifications.forEach((notif) => {
      // If already processed during this session, skip
      if (processedNotifsRef.current.has(notif.id)) return;
      processedNotifsRef.current.add(notif.id);

      // Only alert on notifications created in the last 10 minutes to avoid spamming historical ones on load
      const createdTime = new Date(notif.createdAt).getTime();
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      if (createdTime < tenMinutesAgo) return;

      // Check if it targets the current user
      let isTargeted = false;
      if (currentUser.role === 'PARENT' && selectedStudentId) {
        const student = students.find(s => s.id === selectedStudentId);
        if (notif.targetAudience === 'Everyone') {
          isTargeted = true;
        } else if (notif.targetAudience === 'Selected Classes' && student) {
          isTargeted = (notif.targetClassSection === `${student.className}-${student.section}`);
        } else if (notif.targetAudience === 'Individual Parents') {
          isTargeted = (notif.targetStudentId === selectedStudentId);
        }
      } else if (currentUser.role === 'TEACHER') {
        if (notif.targetAudience === 'Everyone' || notif.targetAudience === 'Teachers Only') {
          isTargeted = true;
        }
      }

      if (isTargeted) {
        triggerPushNotification(notif.title, notif.message);
      }
    });
  }, [notifications, currentUser, selectedStudentId, students]);

  // 1. Real-Time onSnapshot Firestore Listener for immediate cross-device sync
  useEffect(() => {
    if (db) {
      setCloudSyncStatus('SYNCING');
      const unsub = onSnapshot(doc(db, 'school', 'krk_global_data'), (docSnap: any) => {
        setCloudSyncStatus('CONNECTED');
        setCloudErrorMsg('');
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          const cloudHash = JSON.stringify(cloudData);

          // Skip if we have unpushed local changes, or if the update matches our last push
          if (isLocalChangePendingRef.current) return;
          if (cloudHash === lastPushedHashRef.current) return;

          lastPushedHashRef.current = cloudHash;

          if (cloudData.students) setStudents(recalculateAlphabeticalRollNumbers(cloudData.students));
          if (cloudData.teachers) setTeachers(cloudData.teachers);
          if (cloudData.deletedStudents) setDeletedStudents(cloudData.deletedStudents);
          if (cloudData.deletedTeachers) setDeletedTeachers(cloudData.deletedTeachers);
          if (cloudData.homework) setHomework(cloudData.homework);
          if (cloudData.classwork) setClasswork(cloudData.classwork);
          if (cloudData.timetable) setTimetable(cloudData.timetable);
          if (cloudData.calendarEvents) setCalendarEvents(cloudData.calendarEvents);
          if (cloudData.notifications) setNotifications(cloudData.notifications);
          if (cloudData.busRoutes) setBusRoutes(cloudData.busRoutes);
          if (cloudData.attendance) setAttendance(cloudData.attendance);
          if (cloudData.periodConfigs) setPeriodConfigs(cloudData.periodConfigs);
          if (cloudData.dailyOverrides) setDailyOverrides(cloudData.dailyOverrides);
        }
      }, (error: any) => {
        console.error("Firestore onSnapshot error:", error);
        setCloudSyncStatus('ERROR');
        setCloudErrorMsg(error.message || String(error));
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    const payload = {
      students,
      teachers,
      deletedStudents,
      deletedTeachers,
      homework,
      classwork,
      timetable,
      calendarEvents,
      notifications,
      busRoutes,
      attendance,
      periodConfigs,
      dailyOverrides,
    };
    const currentHash = JSON.stringify(payload);

    if (currentHash === lastPushedHashRef.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        setCloudSyncStatus('SYNCING');
        const success = await pushToCloud(payload);
        if (success) {
          lastPushedHashRef.current = currentHash;
          isLocalChangePendingRef.current = false;
          setCloudSyncStatus('CONNECTED');
          setCloudErrorMsg('');
        } else {
          setCloudSyncStatus('ERROR');
          setCloudErrorMsg('Could not push to Cloud database');
        }
      } catch (e: any) {
        setCloudSyncStatus('ERROR');
        setCloudErrorMsg(e.message || String(e));
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [students, teachers, deletedStudents, deletedTeachers, homework, classwork, timetable, calendarEvents, notifications, busRoutes, attendance, periodConfigs, dailyOverrides]);

  // Sync session states to sessionStorage, and backing up data tables to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(CURRENT_STORAGE_PREFIX + 'AUTH', isAuthenticated ? 'true' : 'false');
        if (currentUser) {
          sessionStorage.setItem(CURRENT_STORAGE_PREFIX + 'USER', JSON.stringify(currentUser));
        } else {
          sessionStorage.removeItem(CURRENT_STORAGE_PREFIX + 'USER');
        }
      } catch (e) {}
      safeSetStorage('ROLE', activeRole);
      safeSetStorage('STUDENTS', students);
      safeSetStorage('TEACHERS', teachers);
      safeSetStorage('NOTIFICATIONS', notifications);
      safeSetStorage('HOMEWORK', homework);
      safeSetStorage('CLASSWORK', classwork);
      safeSetStorage('EXAM_MARKS', examMarks);
      safeSetStorage('ATTENDANCE', attendance);
      safeSetStorage('BUS_ROUTES', busRoutes);
      safeSetStorage('CALENDAR', calendarEvents);
      safeSetStorage('TIMETABLE', timetable);
      safeSetStorage('PERIOD_CONFIGS', periodConfigs);
      safeSetStorage('DAILY_OVERRIDES', dailyOverrides);
      safeSetStorage('SELECTED_STUDENT_ID', selectedStudentId);
      safeSetStorage('SELECTED_TEACHER_ID', selectedTeacherId);
      try {
        sessionStorage.setItem(CURRENT_STORAGE_PREFIX + 'SELECTED_STUDENT_ID', selectedStudentId);
        sessionStorage.setItem(CURRENT_STORAGE_PREFIX + 'SELECTED_TEACHER_ID', selectedTeacherId);
      } catch (e) {}
    }
  }, [isAuthenticated, currentUser, activeRole, students, teachers, deletedStudents, deletedTeachers, notifications, homework, classwork, examMarks, attendance, busRoutes, calendarEvents, timetable, periodConfigs, dailyOverrides, selectedStudentId, selectedTeacherId]);

  const login = (role: UserRole, userDetails: { email?: string; mobile?: string; name: string; teacherId?: string }) => {
    setIsAuthenticated(true);
    const session: UserSession = {
      role,
      name: userDetails.name,
      email: userDetails.email || `${role.toLowerCase()}@kidzrkidz.edu`,
      mobile: userDetails.mobile,
      teacherId: userDetails.teacherId,
    };
    setCurrentUser(session);
    setActiveRoleState(role);
    if (userDetails.teacherId) setSelectedTeacherId(userDetails.teacherId);
    setActiveTab('dashboard');
    addToast('Welcome to KIDZ R KIDZ Pre School ERP!', `Logged in successfully as ${role}.`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(CURRENT_STORAGE_PREFIX + 'AUTH');
        sessionStorage.removeItem(CURRENT_STORAGE_PREFIX + 'USER');
      } catch (e) {}
    }
    addToast('Signed Out', 'Logged out from KIDZ R KIDZ ERP.', 'info');
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const addToast = (title: string, message: string, type: ToastAlert['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Actions
  const addStudent = (data: Omit<Student, 'id' | 'admissionNo' | 'paymentHistory'> & { customAdmissionNo?: string }) => {
    const newId = 'STU-' + Math.floor(100 + Math.random() * 900);
    const admNo = data.customAdmissionNo?.trim() || ('KRK-2025-' + String(students.length + 1).padStart(3, '0'));

    const newStudent: Student = {
      ...data,
      id: newId,
      admissionNo: admNo,
      paymentHistory: [],
      password: 'student#123',
    };

    setStudents((prev) => {
      const updatedList = [newStudent, ...prev];
      return recalculateAlphabeticalRollNumbers(updatedList);
    });

    setSelectedStudentId(newId);

    const teacherNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: `New Admission: ${data.name}`,
      message: `Student ${data.name} (Father: ${data.fatherName}) admitted to Class ${data.className}-${data.section}.`,
      category: 'Homework',
      targetAudience: 'Teachers Only',
      senderName: 'Admission Desk',
      senderRole: 'ADMIN',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setNotifications((prev) => [teacherNotif, ...prev]);

    try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
    addToast(
      'Admission Completed!',
      `Added ${data.name} to Class ${data.className}-${data.section} (Adm No: ${admNo}). Roll number automatically assigned alphabetically.`,
      'success'
    );
    touchLocalState();
  };

  const editStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents((prev) => {
      const updatedList = prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
      return recalculateAlphabeticalRollNumbers(updatedList);
    });
    addToast('Student Profile Updated', 'Saved student profile changes & recalculated alphabetical roll numbers.', 'success');
    touchLocalState();
  };

  const addTeacher = (data: Omit<Teacher, 'id' | 'joinDate'>) => {
    const newId = 'TCH-' + Math.floor(100 + Math.random() * 900);
    const newTeacher: Teacher = {
      ...data,
      id: newId,
      password: data.password || 'teach#321',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: data.avatar || PHOTO_PLACEHOLDER
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    setSelectedTeacherId(newId);
    addToast('Teacher Account Created', `${data.name} registered with mobile ${data.mobile}.`, 'success');
    touchLocalState();
  };

  const editTeacher = (id: string, updatedData: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
    addToast('Teacher Profile Updated', 'Updated teacher details & assignments.', 'success');
    touchLocalState();
  };

  const deleteStudent = (id: string) => {
    // ✋ ROLE-BASED ACCESS CONTROL: Only ADMIN can delete student records
    if (activeRole !== 'ADMIN') {
      addToast('Access Denied', 'Only administrators can delete student records. This action is logged and monitored.', 'error');
      return;
    }

    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;

    // 1. Clear outstanding balance for deleted archive
    const archivedStudent: DeletedStudent = {
      ...studentToDelete,
      deletedAt: new Date().toISOString(),
      fees: {
        ...studentToDelete.fees,
        pendingAmount: 0,
        paidAmount: studentToDelete.fees.totalFee
      }
    };

    // 2. Add to deleted archive list
    setDeletedStudents(prev => [...prev, archivedStudent]);

    // 3. Remove from active students
    setStudents(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return recalculateAlphabeticalRollNumbers(filtered);
    });

    addToast('Student Account Deleted', `${studentToDelete.name}'s record was archived and their outstanding balance cleared.`, 'success');
    touchLocalState();
  };

  const deleteTeacher = (id: string) => {
    // ✋ ROLE-BASED ACCESS CONTROL: Only ADMIN can delete teacher records
    if (activeRole !== 'ADMIN') {
      addToast('Access Denied', 'Only administrators can delete teacher records. This action is logged and monitored.', 'error');
      return;
    }

    const teacherToDelete = teachers.find(t => t.id === id);
    if (!teacherToDelete) return;

    const archivedTeacher: DeletedTeacher = {
      ...teacherToDelete,
      deletedAt: new Date().toISOString()
    };

    // 1. Add to deleted archive list
    setDeletedTeachers(prev => [...prev, archivedTeacher]);

    // 2. Remove from active teachers list
    setTeachers(prev => prev.filter(t => t.id !== id));

    // 3. Unassign from timetable slots / daily overrides
    setTimetable(prev => prev.map(slot => 
      slot.teacherName.toLowerCase() === teacherToDelete.name.toLowerCase()
        ? { ...slot, teacherName: 'Unassigned' }
        : slot
    ));

    setDailyOverrides(prev => prev.map(override => 
      override.teacherName.toLowerCase() === teacherToDelete.name.toLowerCase()
        ? { ...override, teacherName: 'Unassigned' }
        : override
    ));

    addToast('Teacher Account Deleted', `${teacherToDelete.name}'s record has been archived.`, 'success');
    touchLocalState();
  };

  const resetTeacherPassword = (teacherId: string, newPass: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, password: newPass } : t))
    );
    addToast('Password Reset', `Password reset for teacher account.`, 'success');
    touchLocalState();
  };

  const resetStudentPassword = (studentId: string, newPass: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, password: newPass } : s))
    );
    addToast('Password Reset', `Password reset for student account.`, 'success');
    touchLocalState();
  };

  const markAttendance = (
    records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }[],
    className: string,
    section: string,
    date: string
  ) => {
    setAttendance((prev) => {
      const filtered = prev.filter(r => !(r.date === date && r.className === className && r.section === section));
      const newEntries: AttendanceRecord[] = records.map((rec) => ({
        id: 'ATT-' + Math.random().toString(36).substring(2, 7),
        date: date,
        studentId: rec.studentId,
        className,
        section,
        status: rec.status,
        remarks: rec.remarks,
      }));
      return [...newEntries, ...filtered];
    });

    // Create notifications for the parents
    const newNotifs: NotificationItem[] = records.map((rec) => {
      const student = students.find((s) => s.id === rec.studentId);
      const studentName = student ? student.name : 'Your child';
      const statusText = rec.status;
      return {
        id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        title: `Attendance Alert: ${studentName} is ${statusText}`,
        message: `Dear Parent, your child ${studentName} has been marked ${statusText} for date ${date}.`,
        category: 'Emergency Alert',
        targetAudience: 'Individual Parents',
        targetStudentId: rec.studentId,
        senderName: currentTeacher?.name || 'Class Teacher',
        senderRole: 'TEACHER',
        createdAt: new Date().toISOString(),
        isRead: false,
      };
    });

    setNotifications((prev) => {
      // Remove any existing attendance notifications for these students on this specific date
      const studentIds = new Set(records.map(r => r.studentId));
      const filtered = prev.filter(n => {
        if (n.targetAudience === 'Individual Parents' && studentIds.has(n.targetStudentId || '')) {
          const isAttendanceNotif = n.title.startsWith('Attendance Alert:') && n.message.includes(`for date ${date}`);
          return !isAttendanceNotif;
        }
        return true;
      });
      return [...newNotifs, ...filtered];
    });

    addToast('Attendance Saved', `Marked attendance for ${date} (Class ${className}-${section}).`, 'success');

    // Push notification for the class attendance
    const present = records.filter(r => r.status === 'PRESENT').length;
    const total = records.length;
    triggerPushNotification(
      `Attendance Marked: Class ${className}-${section}`,
      `Roster updated for ${date}. Present: ${present}/${total} students.`
    );
    touchLocalState();
  };

  const addHomework = (data: Omit<Homework, 'id'> & { assignedDate?: string }) => {
    const newId = 'HW-' + Date.now();
    const dateStr = data.assignedDate || getLocalDateString();
    const newHw: Homework = {
      ...data,
      id: newId,
      assignedDate: dateStr,
    };
    setHomework((prev) => [newHw, ...prev]);

    const hwNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: `${data.subject} Homework Assigned`,
      message: `${data.teacherName} posted: "${data.title}" for Class ${data.className}-${data.section}. ${data.dueDate ? `Due: ${data.dueDate}.` : ''}`,
      category: 'Homework',
      targetAudience: 'Selected Classes',
      targetClassSection: `${data.className}-${data.section}`,
      senderName: data.teacherName,
      senderRole: 'TEACHER',
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [hwNotif, ...prev]);

    addToast('Homework Posted', `Published homework for Class ${data.className}-${data.section}.`, 'success');
    triggerPushNotification(
      `${data.subject} Homework Posted`,
      `Class ${data.className}-${data.section}: "${data.title}" by ${data.teacherName}.${data.dueDate ? ` Due: ${data.dueDate}` : ''}`
    );
    touchLocalState();
  };

  const addClasswork = (data: Omit<Classwork, 'id'> & { date?: string }) => {
    const newId = 'CW-' + Date.now();
    const dateStr = data.date || getLocalDateString();
    const newCw: Classwork = {
      ...data,
      id: newId,
      date: dateStr,
    };
    setClasswork((prev) => [newCw, ...prev]);

    const cwNotif: NotificationItem = {
      id: 'NOTIF-' + (Date.now() + 1),
      title: `${data.subject} Classwork Posted`,
      message: `${data.teacherName} posted Classwork: "${data.title}" for Class ${data.className}-${data.section}. Topics covered: "${data.topicsCovered}".`,
      category: 'Homework',
      targetAudience: 'Selected Classes',
      targetClassSection: `${data.className}-${data.section}`,
      senderName: data.teacherName,
      senderRole: 'TEACHER',
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [cwNotif, ...prev]);

    addToast('Classwork Posted', `Published daily classwork for Class ${data.className}-${data.section}.`, 'success');
    triggerPushNotification(
      `${data.subject} Classwork Posted`,
      `Class ${data.className}-${data.section}: "${data.title}" by ${data.teacherName}`
    );
    touchLocalState();
  };

  const addExamMarks = (entries: Omit<ExamMark, 'id'>[]) => {
    const newMarks: ExamMark[] = entries.map(e => ({
      ...e,
      id: 'EM-' + Math.random().toString(36).substring(2, 7),
    }));
    setExamMarks((prev) => [...newMarks, ...prev]);
    addToast('Exam Marks Saved', `Saved marks for ${entries.length} students.`, 'success');
    touchLocalState();
  };

  const makeFeePayment = (
    studentId: string,
    amount: number,
    method: 'UPI' | 'Bank' | 'Cash',
    feeType: string
  ) => {
    const receiptNo = 'KRK-RCP-' + Math.floor(1000 + Math.random() * 9000);
    const todayStr = new Date().toISOString().split('T')[0];

    const newPayment: FeePaymentRecord = {
      id: 'REC-' + Date.now(),
      date: todayStr,
      amount,
      method,
      receiptNo,
      feeType,
      status: 'SUCCESS',
    };

    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === studentId) {
          const updatedPaid = stu.fees.paidAmount + amount;
          const updatedPending = Math.max(0, stu.fees.totalFee - updatedPaid);
          return {
            ...stu,
            fees: {
              ...stu.fees,
              paidAmount: updatedPaid,
              pendingAmount: updatedPending,
            },
            paymentHistory: [newPayment, ...stu.paymentHistory],
          };
        }
        return stu;
      })
    );

    const stuObj = students.find(s => s.id === studentId);
    setModalData({ student: stuObj, payment: newPayment });
    setActiveModal('FEE_RECEIPT');

    try { confetti({ particleCount: 80, spread: 85, origin: { y: 0.5 } }); } catch (e) {}
    addToast('Payment Recorded!', `Receipt #${receiptNo} generated for ₹${amount.toLocaleString('en-IN')}.`, 'success');
    touchLocalState();
  };

  const sendNotification = (data: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...data,
      id: 'NOTIF-' + Date.now(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addToast('Announcement Broadcasted', `Sent "${data.title}" to ${data.targetAudience}.`, 'success');
    triggerPushNotification(`📢 Announcement: ${data.title}`, data.message);
    touchLocalState();
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    touchLocalState();
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'EV-' + Date.now(),
    };
    setCalendarEvents((prev) => [newEvent, ...prev]);
    addToast('Calendar Updated', `Added "${event.title}" to Annual School Calendar.`, 'success');
    touchLocalState();
  };

  const deleteCalendarEvent = (id: string) => {
    // ✋ ROLE-BASED ACCESS CONTROL: Only ADMIN can delete calendar events
    if (activeRole !== 'ADMIN') {
      addToast('Access Denied', 'Only administrators can delete calendar events.', 'error');
      return;
    }
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    addToast('Event Removed', 'Event removed from Calendar.', 'info');
    touchLocalState();
  };
  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slot,
      id: 'TS-' + Date.now(),
    };
    setTimetable((prev) => [...prev, newSlot]);
    addToast('Timetable Updated', `Added ${slot.subject} for Class ${slot.className}-${slot.section}.`, 'success');
    touchLocalState();
  };

  const deleteTimetableSlot = (id: string) => {
    // ✋ ROLE-BASED ACCESS CONTROL: Only ADMIN can delete timetable slots
    if (activeRole !== 'ADMIN') {
      addToast('Access Denied', 'Only administrators can delete timetable slots.', 'error');
      return;
    }
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    addToast('Slot Removed', 'Removed slot from Timetable.', 'info');
    touchLocalState();
  };

  const savePeriodConfigs = (classSectionKey: string, configs: PeriodTime[]) => {
    setPeriodConfigs((prev) => ({
      ...prev,
      [classSectionKey]: configs,
    }));
    addToast('Period Timings Updated', `Custom timings saved for ${classSectionKey}.`, 'success');
    touchLocalState();
  };

  const addDailyOverride = (override: Omit<DailyOverride, 'id'>) => {
    const newOverride: DailyOverride = {
      ...override,
      id: 'DO-' + Date.now(),
    };
    setDailyOverrides((prev) => {
      const filtered = prev.filter(
        (o) =>
          !(
            o.date === override.date &&
            o.className === override.className &&
            o.section === override.section &&
            o.periodId === override.periodId
          )
      );
      return [...filtered, newOverride];
    });
    addToast('Schedule Updated', `Assigned substitute for Period ${override.periodId} on ${override.date}.`, 'success');
    touchLocalState();
  };

  const deleteDailyOverride = (id: string) => {
    // ✋ ROLE-BASED ACCESS CONTROL: Only ADMIN can delete daily overrides
    if (activeRole !== 'ADMIN') {
      addToast('Access Denied', 'Only administrators can delete daily overrides.', 'error');
      return;
    }
    setDailyOverrides((prev) => prev.filter((o) => o.id !== id));
    addToast('Override Removed', 'Removed substitute override.', 'info');
    touchLocalState();
  };

  const updateTimetableSlot = (slot: TimetableSlot) => {
    setTimetable((prev) => {
      const idx = prev.findIndex((s) => s.id === slot.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = slot;
        return copy;
      }
      return [...prev, slot];
    });
    touchLocalState();
  };

  const assignClassTeacher = (className: string, section: string, teacherId: string | null) => {
    setTeachers((prev) =>
      prev.map((t) => {
        let updatedAssignments = t.assignments.map((a) => {
          if (a.className === className && a.section === section) {
            return { ...a, isClassTeacher: false };
          }
          return a;
        });

        if (t.id === teacherId) {
          const hasAssignment = updatedAssignments.some(
            (a) => a.className === className && a.section === section
          );
          if (hasAssignment) {
            updatedAssignments = updatedAssignments.map((a) => {
              if (a.className === className && a.section === section) {
                return { ...a, isClassTeacher: true };
              }
              return a;
            });
          } else {
            updatedAssignments.push({
              className,
              section,
              subject: 'Class Teacher Duties',
              isClassTeacher: true,
            });
          }
        }

        return { ...t, assignments: updatedAssignments };
      })
    );
    addToast('Class Teacher Assigned', 'Class teacher updated successfully.', 'success');
    touchLocalState();
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      try { localStorage.clear(); } catch (e) {}
    }
    setStudents([]);
    setTeachers([DEMO_TEACHER]);
    setDeletedStudents([]);
    setDeletedTeachers([]);
    setNotifications([]);
    setHomework([]);
    setClasswork([]);
    setExamMarks([]);
    setAttendance([]);
    setBusRoutes([]);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setTimetable(INITIAL_TIMETABLE_SLOTS);
    setPeriodConfigs({});
    setDailyOverrides([]);
    addToast('Data Wiped', 'App memory cleared.', 'info');
  };
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0] || null;
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0] || DEMO_TEACHER;

  return (
    <ERPContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeRole,
        setActiveRole,
        login,
        logout,
        selectedStudentId,
        setSelectedStudentId,
        selectedTeacherId,
        setSelectedTeacherId,
        students,
        teachers,
        deletedStudents,
        deletedTeachers,
        notifications,
        homework,
        classwork,
        examMarks,
        timetable,
        attendance,
        busRoutes,
        calendarEvents,
        toasts,
        periodConfigs,
        dailyOverrides,
        addStudent,
        editStudent,
        deleteStudent,
        addTeacher,
        editTeacher,
        deleteTeacher,
        resetTeacherPassword,
        resetStudentPassword,
        markAttendance,
        addHomework,
        addClasswork,
        addExamMarks,
        makeFeePayment,
        sendNotification,
        markNotificationRead,
        addCalendarEvent,
        deleteCalendarEvent,
        addTimetableSlot,
        deleteTimetableSlot,
        addToast,
        removeToast,
        resetAllData,
        savePeriodConfigs,
        addDailyOverride,
        deleteDailyOverride,
        updateTimetableSlot,
        assignClassTeacher,
        currentStudent,
        currentTeacher,
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        modalData,
        setModalData,
        cloudSyncStatus,
        cloudErrorMsg,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
