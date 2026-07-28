'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Mail, Lock, ArrowRight, Laptop } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Sidebar } from '../../components/layout/Sidebar';
import { MobileNav } from '../../components/layout/MobileNav';

// Admin Modules
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { TeacherManagement } from '../../components/admin/TeacherManagement';
import { FeeManagement } from '../../components/admin/FeeManagement';
import { NotificationCenter } from '../../components/admin/NotificationCenter';
import { TimetableManager } from '../../components/admin/TimetableManager';
import { SchoolCalendar } from '../../components/common/SchoolCalendar';
import { TransportDashboard } from '../../components/transport/TransportDashboard';
import { ArchiveManager } from '../../components/admin/ArchiveManager';

// Modals
import { IDCardModal } from '../../components/common/IDCardModal';
import { ReportCardModal } from '../../components/common/ReportCardModal';
import { FeeReceiptModal } from '../../components/common/FeeReceiptModal';
import { EditStudentModal } from '../../components/admin/EditStudentModal';
import { EditTeacherModal } from '../../components/admin/EditTeacherModal';
import { TeacherDetailModal } from '../../components/admin/TeacherDetailModal';

export default function AdminPortal() {
  const { isAuthenticated, activeRole, activeTab, activeModal, login, logout } = useERP();
  const router = useRouter();
  
  const [adminEmail, setAdminEmail] = useState('mukeshgaur19802@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/admin');
    }
  }, [isAuthenticated, router]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim() === 'mukeshgaur19802@gmail.com' && adminPassword.trim() === 'admin123') {
      login('ADMIN', { email: adminEmail, name: 'Mukesh Gaur (Super Admin)' });
    } else {
      setErrorMessage('Invalid credentials. Default: mukeshgaur19802@gmail.com / admin123');
    }
  };

  // 1. Not Authenticated: Redirect to dedicated admin login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-400 font-sans">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest">Redirecting to login...</p>
      </div>
    );
  }

  // 2. Authenticated but NOT as Admin: Deny Access and guide to Mobile App Portal
  if (activeRole !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-md w-full relative z-10 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-black text-white">Access Denied</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are currently authenticated as a **{activeRole}**. The Admin Console is restricted to administrators. Please use the mobile portal to access your dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-xs font-bold">
            <Link href="/app" className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-center shadow-lg transition-all">
              Go to Mobile Portal
            </Link>
            <button onClick={logout} className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700">
              Log Out of {activeRole}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated as Admin: Render Admin Console Layout (Desktop-first layout)
  const renderAdminModule = () => {
    switch (activeTab) {
      case 'teachers':
        return <TeacherManagement />;
      case 'timetable':
        return <TimetableManager />;
      case 'fees':
        return <FeeManagement />;
      case 'calendar':
        return <SchoolCalendar />;
      case 'notifications':
        return <NotificationCenter />;
      case 'transport':
        return <TransportDashboard />;
      case 'archives':
        return <ArchiveManager />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col antialiased selection:bg-blue-500 selection:text-white pb-16 lg:pb-0">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderAdminModule()}
        </main>
      </div>
      <MobileNav />

      {/* Document generators & editing modals */}
      {activeModal === 'ID_CARD' && <IDCardModal />}
      {activeModal === 'REPORT_CARD' && <ReportCardModal />}
      {activeModal === 'FEE_RECEIPT' && <FeeReceiptModal />}
      {activeModal === 'EDIT_STUDENT' && <EditStudentModal />}
      {activeModal === 'EDIT_TEACHER' && <EditTeacherModal />}
      {activeModal === 'INSPECT_TEACHER' && <TeacherDetailModal />}
    </div>
  );
}
