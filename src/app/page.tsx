'use client';

import React from 'react';
import Link from 'next/link';
import { Laptop, Smartphone, QrCode, Sparkles, ExternalLink } from 'lucide-react';

export default function WelcomePortal() {
  const appUrl = typeof window !== 'undefined' ? `${window.location.origin}/app` : 'https://kidzrkidz.vercel.app/app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&color=25-118-210&bgcolor=255-255-255`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-2xl border border-blue-500/30 shadow-md">
            <img src="/logo.jpg" alt="KIDZ R KIDZ logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white uppercase">KIDZ R KIDZ</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Pre School ERP</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Active System</span>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center relative z-10 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Unified ERP & Communication Suite</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Select Your Portal Experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            KIDZ R KIDZ School Management System operates in two modes. Select the optimized interface for your device or role below.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {/* Card 1: Admin Console */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 shadow-2xl transition-all duration-300 group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Laptop className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-white group-hover:text-blue-300 transition-colors">
                  Super Admin Desk
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Management Console optimized for laptops and desktop displays. Handle admissions, fees, billing, schedules, announcements, and directories.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60">Admissions Desk</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60">Fee Ledger</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60">Broadcaster</span>
              </div>
            </div>
            <Link
              href="/admin"
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs text-center shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Desktop Console</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Mobile App (Parent & Teacher) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 shadow-2xl transition-all duration-300 group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-white group-hover:text-teal-300 transition-colors">
                  Teacher & Parent App
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mobile-first Progressive Web App (PWA). Mark attendance, check notifications, pay fees, post assignments, and enter marks on any smartphone.
                </p>
              </div>
              
              {/* QR Code Mockup for Mobile scan */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-4 text-xs">
                <div className="bg-white p-1 rounded-xl shrink-0">
                  <img src={qrCodeUrl} alt="App QR" className="w-20 h-20" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Quick Access</span>
                  </span>
                  <p className="font-semibold text-white text-[11px]">Scan with your Phone</p>
                  <p className="text-[10px] text-slate-500">Opens the touch-friendly mobile portal instantly.</p>
                </div>
              </div>
            </div>
            <Link
              href="/app"
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs text-center shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Open Mobile Portal</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900 text-center relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-semibold">
        <p>© 2026 KIDZ R KIDZ Pre School. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-blue-400 transition-colors">Admin Console</Link>
          <span>•</span>
          <Link href="/app" className="hover:text-teal-400 transition-colors">Mobile Portal</Link>
          <span>•</span>
          <a href="https://vercel.com/mukeshgaur1980/kidzrkidz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            <span>Vercel Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
