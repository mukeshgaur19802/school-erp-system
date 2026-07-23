export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'TRANSPORT';

export interface UserSession {
  email?: string;
  mobile?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  teacherId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password?: string;
  role: 'Principal' | 'Vice Principal' | 'Class Teacher' | 'Subject Teacher';
  assignments: {
    className: string; // e.g. "Class 8"
    section: string;   // e.g. "A"
    subject: string;   // e.g. "Mathematics"
    isClassTeacher?: boolean;
  }[];
  avatar?: string;
  joinDate: string;
}

export interface FeeBreakdown {
  admissionFee: number;
  tuitionFee: number;
  transportFee: number;
  booksFee: number;
  annualFee: number;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface FeePaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking' | 'Cash';
  receiptNo: string;
  feeType: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface SiblingInfo {
  name: string;
  gender: 'M' | 'F';
  dob: string;
  school: string;
  className: string;
  isAlumni: boolean;
}

export interface EmergencyContactInfo {
  name: string;
  address: string;
  mobile: string;
  relation: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  className: string;  // e.g. "Class 8"
  section: string;    // e.g. "A"
  rollNo: number;
  academicYear: string; // e.g. "2025-2026"
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  photo: string;        // Student photo
  parentPhoto: string;  // Combined / Father photo
  fatherPhoto?: string; // Father photo
  motherPhoto?: string; // Mother photo
  parentPhone: string;
  parentEmail: string;
  currentAddress: string;
  permanentAddress: string;
  admissionDate: string;
  booksPackage: string;
  hasTransport: boolean;
  busRouteId?: string;

  // Official KIDZ R KIDZ Pre School Form Extended Fields
  placeOfBirth?: string;
  fatherQualification?: string;
  fatherOccupation?: string;
  fatherPhone2?: string;
  motherQualification?: string;
  motherOccupation?: string;
  motherPhone2?: string;
  siblings?: SiblingInfo[];
  emergencyContacts?: EmergencyContactInfo[];
  consents?: {
    emergencyPermission: boolean;
    transportPermission: boolean;
  };

  fees: FeeBreakdown;
  paymentHistory: FeePaymentRecord[];
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  className: string;
  section: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  remarks?: string;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  className: string;
  section: string;
  teacherName: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string;
  description: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachments?: string[];
}

export interface Classwork {
  id: string;
  title: string;
  subject: string;
  className: string;
  section: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  topicsCovered: string;
  description?: string;
  homeworkAssigned?: string;
  attachments?: string[];
}

export interface ExamMark {
  id: string;
  studentId: string;
  examName: string; // e.g. "Mid-Term"
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'School Holiday' | 'Fee Reminder' | 'Staff Meeting' | 'Homework' | 'Exam Schedule' | 'Emergency Alert';
  targetAudience: 'Everyone' | 'Teachers Only' | 'Selected Classes' | 'Individual Parents';
  targetClassSection?: string;
  targetStudentId?: string;
  senderName: string;
  senderRole: UserRole;
  createdAt: string;
  isRead: boolean;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  period?: number;
  subject: string;
  className: string;
  section: string;
  teacherName: string;
  roomNo: string;
}

export interface BusRoute {
  id: string;
  routeNo: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  busNumber: string;
  capacity: number;
  occupied: number;
  enrolledStudentsCount?: number;
  stops: {
    stopName: string;
    pickupTime: string;
    dropTime: string;
    timing?: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'Celebration' | 'Holiday' | 'Exam' | 'Event';
  description: string;
  targetAudience: 'Everyone' | 'Teachers Only' | 'Parents Only';
}
