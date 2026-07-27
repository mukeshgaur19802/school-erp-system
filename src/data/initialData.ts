import { Teacher, Student, AttendanceRecord, Homework, Classwork, ExamMark, NotificationItem, TimetableSlot, BusRoute } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-001',
    admissionNo: 'KRK-2025-001',
    name: 'Rahul Sharma',
    fatherName: 'Mr. Devendra Sharma',
    motherName: 'Mrs. Pooja Sharma',
    className: 'Class 8',
    section: 'A',
    rollNo: 1,
    academicYear: '2025-2026',
    dob: '2012-05-15',
    gender: 'Male',
    photo: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=150&auto=format&fit=crop&q=80',
    parentPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    parentPhone: '9876543210',
    parentEmail: 'devendra.sharma@gmail.com',
    currentAddress: 'Block C-4, Janakpuri, New Delhi',
    permanentAddress: 'Block C-4, Janakpuri, New Delhi',
    admissionDate: '2025-04-10',
    booksPackage: 'Standard Package',
    hasTransport: true,
    fees: {
      admissionFee: 5000,
      tuitionFee: 20000,
      transportFee: 5000,
      booksFee: 3000,
      annualFee: 2000,
      totalFee: 35000,
      paidAmount: 25000,
      pendingAmount: 10000,
    },
    paymentHistory: [],
    password: 'student#123',
  },
  {
    id: 'STU-002',
    admissionNo: 'KRK-2025-002',
    name: 'Priya Gupta',
    fatherName: 'Mr. Alok Gupta',
    motherName: 'Mrs. Ritu Gupta',
    className: 'Class 8',
    section: 'A',
    rollNo: 2,
    academicYear: '2025-2026',
    dob: '2012-09-20',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    parentPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    parentPhone: '9999999999',
    parentEmail: 'alok.gupta@gmail.com',
    currentAddress: 'H-12, Sector 15, Rohini, New Delhi',
    permanentAddress: 'H-12, Sector 15, Rohini, New Delhi',
    admissionDate: '2025-04-12',
    booksPackage: 'Premium Package',
    hasTransport: false,
    fees: {
      admissionFee: 5000,
      tuitionFee: 20000,
      transportFee: 0,
      booksFee: 3000,
      annualFee: 2000,
      totalFee: 30000,
      paidAmount: 30000,
      pendingAmount: 0,
    },
    paymentHistory: [],
    password: 'student#123',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_HOMEWORK: Homework[] = [];
export const INITIAL_CLASSWORK: Classwork[] = [];
export const INITIAL_EXAM_MARKS: ExamMark[] = [];
export const INITIAL_TIMETABLE: TimetableSlot[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_BUS_ROUTES: BusRoute[] = [];
