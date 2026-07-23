'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserRole,
  UserSession,
  Student,
  Teacher,
  AttendanceRecord,
  Homework,
  Classwork,
  ExamMark,
  NotificationItem,
  TimetableSlot,
  BusRoute,
  FeePaymentRecord,
  CalendarEvent,
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
  password: '123456',
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
  notifications: NotificationItem[];
  homework: Homework[];
  classwork: Classwork[];
  examMarks: ExamMark[];
  timetable: TimetableSlot[];
  attendance: AttendanceRecord[];
  busRoutes: BusRoute[];
  calendarEvents: CalendarEvent[];
  toasts: ToastAlert[];

  // Actions
  addStudent: (data: Omit<Student, 'id' | 'admissionNo' | 'paymentHistory'> & { customAdmissionNo?: string }) => void;
  editStudent: (id: string, updatedData: Partial<Student>) => void;
  addTeacher: (data: Omit<Teacher, 'id' | 'joinDate'>) => void;
  editTeacher: (id: string, updatedData: Partial<Teacher>) => void;
  resetTeacherPassword: (teacherId: string, newPass: string) => void;
  markAttendance: (records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }[], className: string, section: string) => void;
  addHomework: (data: Omit<Homework, 'id' | 'assignedDate'>) => void;
  addClasswork: (data: Omit<Classwork, 'id' | 'date'>) => void;
  addExamMarks: (data: Omit<ExamMark, 'id'>[]) => void;
  makeFeePayment: (studentId: string, amount: number, method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking' | 'Cash', feeType: string) => void;
  sendNotification: (data: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (id: string) => void;
  addToast: (title: string, message: string, type?: ToastAlert['type']) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
  
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
  Object.values(groups).forEach((group) => {
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

function safeSetStorage(keySuffix: string, value: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_STORAGE_PREFIX + keySuffix, JSON.stringify(value));
  } catch (e) {
    console.warn(`[Storage Warning] Quota exceeded for ${keySuffix}`);
  }
}

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    return loadStoredData<UserSession | null>('USER', null);
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const current = localStorage.getItem(CURRENT_STORAGE_PREFIX + 'AUTH');
      if (current) return current === 'true';
      for (const legacy of LEGACY_STORAGE_PREFIXES) {
        const legacyVal = localStorage.getItem(legacy + 'AUTH');
        if (legacyVal) return legacyVal === 'true';
      }
    }
    return false;
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const user = loadStoredData<UserSession | null>('USER', null);
    if (user?.role) return user.role;
    return loadStoredData<UserRole>('ROLE', 'ADMIN');
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('TCH-DEMO-001');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [activeModal, setActiveModal] = useState<'NONE' | 'ID_CARD' | 'REPORT_CARD' | 'FEE_RECEIPT' | 'EDIT_STUDENT' | 'EDIT_TEACHER' | 'INSPECT_TEACHER'>('NONE');
  const [modalData, setModalData] = useState<any>(null);

  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // State initialization
  const [students, setStudents] = useState<Student[]>(() => {
    const loaded = loadStoredData<Student[]>('STUDENTS', INITIAL_STUDENTS);
    return recalculateAlphabeticalRollNumbers(loaded);
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const loaded = loadStoredData<Teacher[]>('TEACHERS', [DEMO_TEACHER]);
    if (!loaded.find((t) => t.mobile === '0000000000')) {
      return [DEMO_TEACHER, ...loaded];
    }
    return loaded;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return loadStoredData<NotificationItem[]>('NOTIFICATIONS', INITIAL_NOTIFICATIONS);
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    return loadStoredData<Homework[]>('HOMEWORK', INITIAL_HOMEWORK);
  });

  const [classwork, setClasswork] = useState<Classwork[]>(() => {
    return loadStoredData<Classwork[]>('CLASSWORK', INITIAL_CLASSWORK);
  });

  const [examMarks, setExamMarks] = useState<ExamMark[]>(() => {
    return loadStoredData<ExamMark[]>('EXAM_MARKS', INITIAL_EXAM_MARKS);
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    return loadStoredData<AttendanceRecord[]>('ATTENDANCE', INITIAL_ATTENDANCE);
  });

  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(() => {
    return loadStoredData<BusRoute[]>('BUS_ROUTES', INITIAL_BUS_ROUTES);
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    return loadStoredData<CalendarEvent[]>('CALENDAR', INITIAL_CALENDAR_EVENTS);
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    return loadStoredData<TimetableSlot[]>('TIMETABLE', INITIAL_TIMETABLE_SLOTS);
  });

  // Track the hash of the last successfully pushed state to prevent local-push loop conflicts
  const lastPushedHashRef = useRef<string>('');

  const [cloudSyncStatus, setCloudSyncStatus] = useState<'CONNECTED' | 'ERROR' | 'SYNCING' | 'LOCAL_ONLY'>('LOCAL_ONLY');
  const [cloudErrorMsg, setCloudErrorMsg] = useState<string>('');

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

          // Skip if the cloud update matches what we just pushed locally
          if (cloudHash === lastPushedHashRef.current) return;

          lastPushedHashRef.current = cloudHash;

          if (cloudData.students) setStudents(recalculateAlphabeticalRollNumbers(cloudData.students));
          if (cloudData.teachers) setTeachers(cloudData.teachers);
          if (cloudData.homework) setHomework(cloudData.homework);
          if (cloudData.classwork) setClasswork(cloudData.classwork);
          if (cloudData.timetable) setTimetable(cloudData.timetable);
          if (cloudData.calendarEvents) setCalendarEvents(cloudData.calendarEvents);
          if (cloudData.notifications) setNotifications(cloudData.notifications);
          if (cloudData.busRoutes) setBusRoutes(cloudData.busRoutes);
          if (cloudData.attendance) setAttendance(cloudData.attendance);
        }
      }, (error: any) => {
        console.error("Firestore onSnapshot error:", error);
        setCloudSyncStatus('ERROR');
        setCloudErrorMsg(error.message || String(error));
      });
      return () => unsub();
    }
  }, []);

  // 2. Debounced Pushes to Cloud Database (Firestore / REST Fallback)
  useEffect(() => {
    const payload = {
      students,
      teachers,
      homework,
      classwork,
      timetable,
      calendarEvents,
      notifications,
      busRoutes,
      attendance,
    };
    const currentHash = JSON.stringify(payload);

    if (currentHash === lastPushedHashRef.current) return;

    const timeoutId = setTimeout(async () => {
      lastPushedHashRef.current = currentHash;
      try {
        setCloudSyncStatus('SYNCING');
        const success = await pushToCloud(payload);
        if (success) {
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
  }, [students, teachers, homework, classwork, timetable, calendarEvents, notifications, busRoutes, attendance]);

  // Sync to local storage as secondary backup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(CURRENT_STORAGE_PREFIX + 'AUTH', isAuthenticated ? 'true' : 'false'); } catch (e) {}
      if (currentUser) safeSetStorage('USER', currentUser);
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
    }
  }, [isAuthenticated, currentUser, activeRole, students, teachers, notifications, homework, classwork, examMarks, attendance, busRoutes, calendarEvents, timetable]);

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
        localStorage.removeItem(CURRENT_STORAGE_PREFIX + 'AUTH');
        localStorage.removeItem(CURRENT_STORAGE_PREFIX + 'USER');
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
  };

  const editStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents((prev) => {
      const updatedList = prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
      return recalculateAlphabeticalRollNumbers(updatedList);
    });
    addToast('Student Profile Updated', 'Saved student profile changes & recalculated alphabetical roll numbers.', 'success');
  };

  const addTeacher = (data: Omit<Teacher, 'id' | 'joinDate'>) => {
    const newId = 'TCH-' + Math.floor(100 + Math.random() * 900);
    const newTeacher: Teacher = {
      ...data,
      id: newId,
      password: data.password || '123456',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: data.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*100)}?w=150&auto=format&fit=crop&q=80`
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    setSelectedTeacherId(newId);
    addToast('Teacher Account Created', `${data.name} registered with mobile ${data.mobile}.`, 'success');
  };

  const editTeacher = (id: string, updatedData: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
    addToast('Teacher Profile Updated', 'Updated teacher details & assignments.', 'success');
  };

  const resetTeacherPassword = (teacherId: string, newPass: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, password: newPass } : t))
    );
    addToast('Password Reset', `Password reset for teacher account.`, 'success');
  };

  const markAttendance = (
    records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }[],
    className: string,
    section: string
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setAttendance((prev) => {
      const filtered = prev.filter(r => !(r.date === todayStr && r.className === className && r.section === section));
      const newEntries: AttendanceRecord[] = records.map((rec) => ({
        id: 'ATT-' + Math.random().toString(36).substring(2, 7),
        date: todayStr,
        studentId: rec.studentId,
        className,
        section,
        status: rec.status,
        remarks: rec.remarks,
      }));
      return [...newEntries, ...filtered];
    });
    addToast('Attendance Saved', `Marked attendance for Class ${className}-${section}.`, 'success');
  };

  const addHomework = (data: Omit<Homework, 'id' | 'assignedDate'>) => {
    const newId = 'HW-' + Date.now();
    const todayStr = new Date().toISOString().split('T')[0];
    const newHw: Homework = {
      ...data,
      id: newId,
      assignedDate: todayStr,
    };
    setHomework((prev) => [newHw, ...prev]);

    const hwNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: `${data.subject} Homework Assigned`,
      message: `${data.teacherName} posted: "${data.title}" for Class ${data.className}-${data.section}. Due: ${data.dueDate}.`,
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
  };

  const addClasswork = (data: Omit<Classwork, 'id' | 'date'>) => {
    const newId = 'CW-' + Date.now();
    const todayStr = new Date().toISOString().split('T')[0];
    const newCw: Classwork = {
      ...data,
      id: newId,
      date: todayStr,
    };
    setClasswork((prev) => [newCw, ...prev]);
    addToast('Classwork Posted', `Published daily classwork for Class ${data.className}-${data.section}.`, 'success');
  };

  const addExamMarks = (entries: Omit<ExamMark, 'id'>[]) => {
    const newMarks: ExamMark[] = entries.map(e => ({
      ...e,
      id: 'EM-' + Math.random().toString(36).substring(2, 7),
    }));
    setExamMarks((prev) => [...newMarks, ...prev]);
    addToast('Exam Marks Saved', `Saved marks for ${entries.length} students.`, 'success');
  };

  const makeFeePayment = (
    studentId: string,
    amount: number,
    method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking' | 'Cash',
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
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'EV-' + Date.now(),
    };
    setCalendarEvents((prev) => [newEvent, ...prev]);
    addToast('Calendar Updated', `Added "${event.title}" to Annual School Calendar.`, 'success');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    addToast('Event Removed', 'Event removed from Calendar.', 'info');
  };

  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slot,
      id: 'TS-' + Date.now(),
    };
    setTimetable((prev) => [...prev, newSlot]);
    addToast('Timetable Updated', `Added ${slot.subject} for Class ${slot.className}-${slot.section}.`, 'success');
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    addToast('Slot Removed', 'Removed slot from Timetable.', 'info');
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      try { localStorage.clear(); } catch (e) {}
    }
    setStudents([]);
    setTeachers([DEMO_TEACHER]);
    setNotifications([]);
    setHomework([]);
    setClasswork([]);
    setExamMarks([]);
    setAttendance([]);
    setBusRoutes([]);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setTimetable(INITIAL_TIMETABLE_SLOTS);
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
        notifications,
        homework,
        classwork,
        examMarks,
        timetable,
        attendance,
        busRoutes,
        calendarEvents,
        toasts,
        addStudent,
        editStudent,
        addTeacher,
        editTeacher,
        resetTeacherPassword,
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
