'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '../../../context/ERPContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Laptop } from 'lucide-react';

export default function AdminLoginPage() {
  const { isAuthenticated, activeRole, login } = useERP();
  const router = useRouter();

  const [adminEmail, setAdminEmail] = useState('mukeshgaur19802@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && activeRole === 'ADMIN') {
      router.push('/admin');
    }
  }, [isAuthenticated, activeRole, router]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim() === 'mukeshgaur19802@gmail.com' && adminPassword.trim() === 'admin123') {
      login('ADMIN', { email: adminEmail, name: 'Mukesh Gaur (Super Admin)' });
      router.push('/admin');
    } else {
      setErrorMessage('Invalid credentials. Default: mukeshgaur19802@gmail.com / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-md w-full relative z-10 space-y-6 animate-fade-in">
        
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block bg-white p-3 rounded-2xl shadow-2xl max-w-[240px] border-2 border-blue-500/40 hover:scale-105 transition-transform">
            <img src="/logo.jpg" alt="Logo" className="w-full h-auto object-contain max-h-16" />
          </Link>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-bold uppercase tracking-wider">Admin</span>
          </div>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
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
