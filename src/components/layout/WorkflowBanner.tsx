'use client';

import React from 'react';
import { useERP } from '../../context/ERPContext';
import { Sparkles, UserPlus, CheckCircle, Bell, BookOpen, CreditCard } from 'lucide-react';

export const WorkflowBanner: React.FC = () => {
  const { setActiveRole, setActiveTab } = useERP();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/40 py-2 px-3 sm:px-6 lg:px-8 text-white shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-indigo-300 shrink-0 text-[11px] sm:text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Interactive 5-Step ERP Tour:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full max-w-4xl">
          {/* Step 1 */}
          <button
            onClick={() => {
              setActiveRole('ADMIN');
              setActiveTab('dashboard');
            }}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500/50 text-slate-200 transition-all text-[10px] sm:text-[11px] group active:scale-95"
          >
            <UserPlus className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">1. Add Student</span>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => {
              setActiveRole('ADMIN');
              setActiveTab('fees');
            }}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500/50 text-slate-200 transition-all text-[10px] sm:text-[11px] group active:scale-95"
          >
            <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">2. Auto Ledger</span>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => {
              setActiveRole('TEACHER');
              setActiveTab('dashboard');
            }}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 border border-slate-700/60 hover:border-emerald-500/50 text-slate-200 transition-all text-[10px] sm:text-[11px] group active:scale-95"
          >
            <Bell className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">3. Teacher Alert</span>
          </button>

          {/* Step 4 */}
          <button
            onClick={() => {
              setActiveRole('TEACHER');
              setActiveTab('homework');
            }}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 border border-slate-700/60 hover:border-emerald-500/50 text-slate-200 transition-all text-[10px] sm:text-[11px] group active:scale-95"
          >
            <BookOpen className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">4. Homework</span>
          </button>

          {/* Step 5 */}
          <button
            onClick={() => {
              setActiveRole('PARENT');
              setActiveTab('fees');
            }}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-medium transition-all text-[10px] sm:text-[11px] group active:scale-95"
          >
            <CreditCard className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">5. Pay Fee</span>
          </button>
        </div>
      </div>
    </div>
  );
};
