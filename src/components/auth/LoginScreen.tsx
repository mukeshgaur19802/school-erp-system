'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ShieldCheck, Users, GraduationCap, Bus, Lock, Mail, Phone, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginScreen: React.FC = () => {
  const { login, teachers } = useERP();

  const [selectedRoleView, setSelectedRoleView] = useState<'PORTAL' | UserRole>('PORTAL');

  // Form states
  const [adminEmail, setAdminEmail] = useState('mukeshgaur19802@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [teacherMobile, setTeacherMobile] = useState('0000000000');
  const [teacherPassword, setTeacherPassword] = useState('123456');

  const [parentMobile, setParentMobile] = useState('');
  const [parentAdmNo, setParentAdmNo] = useState('');

  const [transportMobile, setTransportMobile] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    login('ADMIN', { email: adminEmail, name: 'Mukesh Gaur (Super Admin)' });
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check teacher in state
    const teacherMatch = teachers.find(
      (t) => t.mobile.trim() === teacherMobile.trim()
    );

    if (teacherMatch) {
      if (teacherMatch.password && teacherMatch.password !== teacherPassword) {
        setErrorMessage('Incorrect password. Default demo password is 123456.');
        return;
      }
      login('TEACHER', {
        mobile: teacherMatch.mobile,
        name: teacherMatch.name,
        teacherId: teacherMatch.id,
      });
    } else if (teacherMobile === '0000000000') {
      login('TEACHER', {
        mobile: '0000000000',
        name: 'Mrs. Sharma (Demo Teacher)',
        teacherId: 'TCH-DEMO-001',
      });
    } else {
      login('TEACHER', {
        mobile: teacherMobile,
        name: `Teacher (${teacherMobile})`,
      });
    }
  };

  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('PARENT', { mobile: parentMobile, name: 'Parent App Portal' });
  };

  const handleTransportLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('TRANSPORT', { mobile: transportMobile, name: 'Fleet Operations' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-[280px] mx-auto border-2 border-blue-500/40">
            <img
              src="/logo.jpg"
              alt="KIDZ R KIDZ Pre School"
              className="w-full h-auto object-contain max-h-20"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              KIDZ R KIDZ Pre School
            </h1>
            <p className="text-xs text-blue-300 font-semibold mt-0.5">
              School Management System & Communication Portal
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs text-center font-bold">
            {errorMessage}
          </div>
        )}

        {/* 1. Portal Selection Screen */}
        {selectedRoleView === 'PORTAL' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-base font-extrabold text-white">Select Login Portal</h2>
              <p className="text-xs text-slate-400">Choose your account type to proceed to dedicated login</p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Admin Portal Button */}
              <button
                onClick={() => setSelectedRoleView('ADMIN')}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-left transition-all duration-200 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Admin Control Desk</h3>
                    <p className="text-[11px] text-slate-400 group-hover:text-blue-100">Super Admin Login (mukeshgaur19802@gmail.com)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </button>

              {/* Teacher Portal Button */}
              <button
                onClick={() => setSelectedRoleView('TEACHER')}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-teal-600 border border-slate-700 hover:border-teal-500 text-left transition-all duration-200 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Teacher Login Portal</h3>
                    <p className="text-[11px] text-slate-400 group-hover:text-teal-100">Mobile & Password (Demo: 0000000000)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </button>

              {/* Parent App Button */}
              <button
                onClick={() => setSelectedRoleView('PARENT')}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-amber-500 border border-slate-700 hover:border-amber-400 text-left transition-all duration-200 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-white/20 group-hover:text-slate-950 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white group-hover:text-slate-950">Parent App Portal</h3>
                    <p className="text-[11px] text-slate-400 group-hover:text-slate-900">Parent Mobile & Student Adm No</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-950 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Transport Desk Button */}
              <button
                onClick={() => setSelectedRoleView('TRANSPORT')}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-left transition-all duration-200 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Transport Operations</h3>
                    <p className="text-[11px] text-slate-400 group-hover:text-indigo-100">Driver & Route Manager Login</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Dedicated Admin Login Page */}
        {selectedRoleView === 'ADMIN' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-blue-500/40 shadow-2xl backdrop-blur-2xl space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedRoleView('PORTAL')}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Selection</span>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                Management Desk
              </span>
              <h2 className="font-black text-xl text-white">Admin Authentication</h2>
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
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-medium"
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
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-medium"
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
        )}

        {/* 3. Dedicated Teacher Login Page */}
        {selectedRoleView === 'TEACHER' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-teal-500/40 shadow-2xl backdrop-blur-2xl space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedRoleView('PORTAL')}
              className="flex items-center gap-1.5 text-xs text-teal-400 hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Selection</span>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                Teaching Faculty Portal
              </span>
              <h2 className="font-black text-xl text-white">Teacher Login</h2>
            </div>

            <form onSubmit={handleTeacherLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter mobile login id"
                    value={teacherMobile}
                    onChange={(e) => setTeacherMobile(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 font-medium font-mono"
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
                    placeholder="Enter your password"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTeacherMobile('0000000000');
                    setTeacherPassword('123456');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-extrabold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-fill Demo Teacher</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xl shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Sign In as Teacher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 4. Dedicated Parent Login Page */}
        {selectedRoleView === 'PARENT' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-amber-500/30 shadow-2xl backdrop-blur-2xl space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedRoleView('PORTAL')}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Selection</span>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Parent & Student Portal
              </span>
              <h2 className="font-black text-xl text-white">Parent Sign In</h2>
            </div>

            <form onSubmit={handleParentLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Registered Parent Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={parentMobile}
                    onChange={(e) => setParentMobile(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Student Admission Number *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. KRK-2025-001"
                    value={parentAdmNo}
                    onChange={(e) => setParentAdmNo(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-medium font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setParentMobile('9876543210');
                    setParentAdmNo('KRK-2025-001');
                    login('PARENT', { mobile: '9876543210', name: 'Demo Parent' });
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Demo Parent Login</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Enter Parent Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 5. Dedicated Transport Login Page */}
        {selectedRoleView === 'TRANSPORT' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl backdrop-blur-2xl space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedRoleView('PORTAL')}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Selection</span>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Transport Desk
              </span>
              <h2 className="font-black text-xl text-white">Fleet Manager Login</h2>
            </div>

            <form onSubmit={handleTransportLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Driver Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98112 99887"
                    value={transportMobile}
                    onChange={(e) => setTransportMobile(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Enter Transport Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default LoginScreen;
