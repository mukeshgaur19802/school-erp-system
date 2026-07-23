'use client';

import React from 'react';
import { ERPProvider, useERP } from '../context/ERPContext';
import { LoginScreen } from '../components/auth/LoginScreen';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';

// Admin Modules
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { TeacherManagement } from '../components/admin/TeacherManagement';
import { FeeManagement } from '../components/admin/FeeManagement';
import { NotificationCenter } from '../components/admin/NotificationCenter';
import { TimetableManager } from '../components/admin/TimetableManager';

// Teacher Modules
import { TeacherDashboard } from '../components/teacher/TeacherDashboard';
import { AttendanceMarker } from '../components/teacher/AttendanceMarker';
import { HomeworkManager } from '../components/teacher/HomeworkManager';
import { MarksEntry } from '../components/teacher/MarksEntry';

// Parent Modules
import { ParentDashboard } from '../components/parent/ParentDashboard';
import { ParentAcademics } from '../components/parent/ParentAcademics';
import { ParentFeeGateway } from '../components/parent/ParentFeeGateway';

// Shared / Transport Modules
import { TransportDashboard } from '../components/transport/TransportDashboard';
import { SchoolCalendar } from '../components/common/SchoolCalendar';

// Modals
import { IDCardModal } from '../components/common/IDCardModal';
import { ReportCardModal } from '../components/common/ReportCardModal';
import { FeeReceiptModal } from '../components/common/FeeReceiptModal';
import { EditStudentModal } from '../components/admin/EditStudentModal';
import { EditTeacherModal } from '../components/admin/EditTeacherModal';
import { TeacherDetailModal } from '../components/admin/TeacherDetailModal';

function MainApp() {
  const { isAuthenticated, activeRole, activeTab, activeModal } = useERP();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderRoleModule = () => {
    switch (activeRole) {
      case 'ADMIN':
        switch (activeTab) {
          case 'teachers':
            return <TeacherManagement />;
          case 'timetable':
            return <TimetableManager />;
          case 'dashboard':
            return <AdminDashboard />;
          case 'fees':
            return <FeeManagement />;
          case 'calendar':
            return <SchoolCalendar />;
          case 'notifications':
            return <NotificationCenter />;
          case 'transport':
            return <TransportDashboard />;
          default:
            return <AdminDashboard />;
        }

      case 'TEACHER':
        switch (activeTab) {
          case 'calendar':
            return <SchoolCalendar />;
          case 'attendance':
            return <AttendanceMarker />;
          case 'homework':
            return <HomeworkManager />;
          case 'marks':
            return <MarksEntry />;
          case 'dashboard':
          default:
            return <TeacherDashboard />;
        }

      case 'PARENT':
        switch (activeTab) {
          case 'academics':
            return <ParentAcademics />;
          case 'fees':
            return <ParentFeeGateway />;
          case 'calendar':
            return <SchoolCalendar />;
          case 'notifications':
            return <ParentAcademics />;
          case 'profile':
          case 'dashboard':
          default:
            return <ParentDashboard />;
        }

      case 'TRANSPORT':
        switch (activeTab) {
          case 'schedules':
          case 'dashboard':
          default:
            return <TransportDashboard />;
        }

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col antialiased selection:bg-blue-500 selection:text-white pb-16 lg:pb-0">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderRoleModule()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Modals & Document Generators */}
      {activeModal === 'ID_CARD' && <IDCardModal />}
      {activeModal === 'REPORT_CARD' && <ReportCardModal />}
      {activeModal === 'FEE_RECEIPT' && <FeeReceiptModal />}
      {activeModal === 'EDIT_STUDENT' && <EditStudentModal />}
      {activeModal === 'EDIT_TEACHER' && <EditTeacherModal />}
      {activeModal === 'INSPECT_TEACHER' && <TeacherDetailModal />}
    </div>
  );
}

export default function Home() {
  return (
    <ERPProvider>
      <MainApp />
    </ERPProvider>
  );
}
