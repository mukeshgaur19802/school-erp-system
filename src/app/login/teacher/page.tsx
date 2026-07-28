'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '../../../context/ERPContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function TeacherLoginPage() {
  const { isAuthenticated, activeRole, login, teachers } = useERP();
  const router = useRouter();

  const [teacherPhone, setTeacherPhone] = useState('0000000000');
  const [teacherPass, setTeacherPass] = useState('teach#321');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && activeRole === 'TEACHER') {
      router.push('/app');
    }
  }, [isAuthenticated, activeRole, router]);

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const match = teachers.find(t => t.mobile.trim() === teacherPhone.trim());
    if (match) {
      if (match.password && match.password !== teacherPass) {
        setErrorMessage('Incorrect password. Default is teach#321.');
        return;
      }
      login('TEACHER', {
        mobile: match.mobile,
        name: match.name,
        teacherId: match.id
      });
      router.push('/app');
    } else if (teacherPhone === '0000000000') {
      // Demo teacher fallback
      login('TEACHER', {
        mobile: '0000000000',
        name: 'Mrs. Pooja Sharma (Demo)',
        teacherId: 'TCH-DEMO-001'
      });
      router.push('/app');
    } else {
      // General registration fallback
      login('TEACHER', {
        mobile: teacherPhone,
        name: `Teacher (${teacherPhone})`
      });
      router.push('/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-md w-full relative z-10 space-y-6 animate-fade-in">
        
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block bg-white p-3 rounded-2xl shadow-2xl max-w-[240px] border-2 border-teal-500/40 hover:scale-105 transition-transform">
            <img src="/logo.jpg" alt="Logo" className="w-full h-auto object-contain max-h-16" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">KIDZ R KIDZ Teacher Space</h1>
            <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">Class Teacher App</p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs text-center font-bold">
            {errorMessage}
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-teal-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Teacher Workspace Portal</span>
            <h2 className="font-black text-lg text-white">Enter Credentials</h2>
          </div>
          
          <form onSubmit={handleTeacherLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Registered Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 0000000000"
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Workspace Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={teacherPass}
                  onChange={(e) => setTeacherPass(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs shadow-xl shadow-teal-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Enter Teacher Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setTeacherPhone('0000000000');
                setTeacherPass('teach#321');
              }}
              className="flex items-center gap-1.5 text-[10px] text-teal-400 hover:underline font-bold uppercase tracking-wider cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reset to Demo Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
