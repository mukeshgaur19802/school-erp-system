'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  GraduationCap,
  CreditCard,
  Award,
  BookOpen,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  Inbox
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { currentStudent, homework, attendance, examMarks, setActiveTab, setActiveModal, setModalData, editStudent, addToast } = useERP();

  if (!currentStudent) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 font-sans animate-fade-in">
        <Inbox className="w-12 h-12 text-blue-400 mx-auto" />
        <h2 className="text-lg font-black text-white">No Active Student Profile Found</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please log in as Admin and add a new student admission to view student profile, attendance, and fee details here.
        </p>
      </div>
    );
  }

  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent.id);
  const presentCount = studentAttendance.filter((a) => a.status === 'PRESENT').length;
  const totalAttDays = Math.max(1, studentAttendance.length);
  const attPercentage = Math.round((presentCount / totalAttDays) * 100);

  const studentHw = homework.filter(
    (h) => h.className === currentStudent.className && h.section === currentStudent.section
  );

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangePassExpanded, setIsChangePassExpanded] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;
    const actualPass = currentStudent.password || 'student#123';
    if (currentPassword !== actualPass) {
      addToast('Error', 'Incorrect current password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Error', 'New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 4) {
      addToast('Error', 'Password must be at least 4 characters long.', 'error');
      return;
    }
    editStudent(currentStudent.id, { password: newPassword });
    addToast('Success', 'Password updated successfully.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangePassExpanded(false);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentStudent.photo}
                alt={currentStudent.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-xl shrink-0"
              />
              {currentStudent.parentPhoto && (
                <img
                  src={currentStudent.parentPhoto}
                  alt="Parent"
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 absolute -bottom-2 -right-2 shadow-md"
                  title={`Parent Photo: ${currentStudent.fatherName}`}
                />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                  STUDENT PROFILE CARD
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentStudent.admissionNo}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">
                {currentStudent.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="font-semibold text-amber-400">Class {currentStudent.className}-{currentStudent.section}</span> •
                <span>Roll No #{currentStudent.rollNo}</span> •
                <span>Father: {currentStudent.fatherName}</span> •
                <span>Mother: {currentStudent.motherName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setModalData(currentStudent);
                setActiveModal('ID_CARD');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Digital ID Card</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Fees Online</span>
            </button>
          </div>
        </div>

        {/* Address Info Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Current Address:</span>
              <span className="text-slate-200">{currentStudent.currentAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Parent Contact & Email:</span>
              <span className="text-slate-200">{currentStudent.parentPhone} ({currentStudent.parentEmail})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Attendance Rate</span>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">{attPercentage}%</h2>
            <span className="text-[11px] text-slate-400">Target 95%</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Pending Fee Balance</span>
            <h2 className="text-2xl font-black text-amber-300 mt-1">
              ₹{currentStudent.fees.pendingAmount.toLocaleString('en-IN')}
            </h2>
            <button onClick={() => setActiveTab('fees')} className="text-[11px] text-amber-400 hover:underline mt-1 font-medium block">
              Pay Online →
            </button>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Active Homework</span>
            <h2 className="text-2xl font-black text-cyan-300 mt-1">{studentHw.length} Tasks</h2>
            <button onClick={() => setActiveTab('academics')} className="text-[11px] text-cyan-400 hover:underline mt-1 font-medium block">
              View Worksheets →
            </button>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Term Evaluation</span>
            <h2 className="text-2xl font-black text-blue-300 mt-1">Grade A+</h2>
            <button
              onClick={() => {
                setModalData(currentStudent);
                setActiveModal('REPORT_CARD');
              }}
              className="text-[11px] text-blue-400 hover:underline mt-1 font-medium block"
            >
              View Report Card →
            </button>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div 
          onClick={() => setIsChangePassExpanded(!isChangePassExpanded)}
          className="flex items-center justify-between cursor-pointer"
        >
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            🔑 Change Portal Password
          </h3>
          <span className="text-xs text-blue-400 font-bold">{isChangePassExpanded ? 'Hide' : 'Change'}</span>
        </div>

        {isChangePassExpanded && (
          <form onSubmit={handlePasswordChange} className="space-y-3 pt-2 text-xs max-w-sm">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Current Password</label>
              <input 
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-700 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">New Password</label>
              <input 
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-700 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Confirm New Password</label>
              <input 
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-700 text-white font-mono"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-900/10"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
