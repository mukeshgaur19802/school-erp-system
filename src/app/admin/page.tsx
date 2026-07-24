'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import Link from 'next/link';
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

// Modals
import { IDCardModal } from '../../components/common/IDCardModal';
import { ReportCardModal } from '../../components/common/ReportCardModal';
import { FeeReceiptModal } from '../../components/common/FeeReceiptModal';
import { EditStudentModal } from '../../components/admin/EditStudentModal';
import { EditTeacherModal } from '../../components/admin/EditTeacherModal';
import { TeacherDetailModal } from '../../components/admin/TeacherDetailModal';

export default function AdminPortal() {
  const { isAuthenticated, activeRole, activeTab, activeModal, login, logout } = useERP();
  
  const [adminEmail, setAdminEmail] = useState('mukeshgaur19802@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim() === 'mukeshgaur19802@gmail.com' && adminPassword.trim() === 'admin123') {
      login('ADMIN', { email: adminEmail, name: 'Mukesh Gaur (Super Admin)' });
    } else {
      setErrorMessage('Invalid credentials. Default: mukeshgaur19802@gmail.com / admin123');
    }
  };

  // 1. Not Authenticated: Render Admin Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-md w-full relative z-10 space-y-6 animate-fade-in">
          
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block bg-white p-3 rounded-2xl shadow-2xl max-w-[240px] border-2 border-blue-500/40 hover:scale-105 transition-transform">
              <img src="/logo.jpg" alt="Logo" className="w-full h-auto object-contain max-h-16" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">KIDZ R KIDZ Admin Desk</h1>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Super Admin Console</p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs text-center font-bold">
              {errorMessage}
            </div>
          )}

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-blue-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Authorized Entry Only</span>
              <h2 className="font-black text-lg text-white">Enter Credentials</h2>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Admin Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Enter Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
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
