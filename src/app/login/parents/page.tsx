'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '../../../context/ERPContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function ParentsLoginPage() {
  const { isAuthenticated, activeRole, login, students, setSelectedStudentId } = useERP();
  const router = useRouter();

  const [parentPhone, setParentPhone] = useState('9876543210');
  const [parentPassword, setParentPassword] = useState('student#123');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-populate parent phone with first student's parent phone
  useEffect(() => {
    if (students && students.length > 0 && parentPhone === '9876543210') {
      setParentPhone(students[0].parentPhone);
    }
  }, [students, parentPhone]);

  useEffect(() => {
    if (isAuthenticated && activeRole === 'PARENT') {
      router.push('/app');
    }
  }, [isAuthenticated, activeRole, router]);

  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const match = students.find(s => s.parentPhone.trim() === parentPhone.trim());
    if (match) {
      const studentPass = match.password || 'student#123';
      if (studentPass !== parentPassword) {
        setErrorMessage('Incorrect password. Default parent password is student#123.');
        return;
      }
      setSelectedStudentId(match.id);
      login('PARENT', {
        mobile: parentPhone,
        name: `Parent of ${match.name}`
      });
      router.push('/app');
    } else {
      setErrorMessage(`No student account registered under phone number: "${parentPhone}".`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-md w-full relative z-10 space-y-6 animate-fade-in">
        
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block bg-white p-3 rounded-2xl shadow-2xl max-w-[240px] border-2 border-indigo-500/40 hover:scale-105 transition-transform">
            <img src="/logo.jpg" alt="Logo" className="w-full h-auto object-contain max-h-16" />
          </Link>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">Parents</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">KIDZ R KIDZ Parents Portal</h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Parent & Student Hub</p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs text-center font-bold">
            {errorMessage}
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Communication & PWA Portal</span>
            <h2 className="font-black text-lg text-white">Enter Credentials</h2>
          </div>
          
          <form onSubmit={handleParentLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Parent Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Mobile number"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Student Portal Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={parentPassword}
                  onChange={(e) => setParentPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Enter Parents Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (students && students.length > 0) {
                  setParentPhone(students[0].parentPhone);
                } else {
                  setParentPhone('9876543210');
                }
                setParentPassword('student#123');
              }}
              className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:underline font-bold uppercase tracking-wider cursor-pointer"
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
