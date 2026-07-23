'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Menu,
  X,
  Bell,
  Bus,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { UserRole } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeRole, setActiveRole, activeTab, setActiveTab } = useERP();
  const [showRoleDrawer, setShowRoleDrawer] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setActiveTab('dashboard');
    setShowRoleDrawer(false);
  };

  return (
    <>
      {/* Bottom Sticky Tab Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 py-2 px-4 flex items-center justify-around text-xs font-sans">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'dashboard' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        {activeRole === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('fees')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'fees' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px]">Fees</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'calendar' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Calendar</span>
        </button>

        {/* Role Drawer Trigger - Strictly for Admin ONLY */}
        {activeRole === 'ADMIN' && (
          <button
            onClick={() => setShowRoleDrawer(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">Roles</span>
          </button>
        )}
      </div>

      {/* Role Switcher Bottom Sheet - Only accessible by Admin */}
      {showRoleDrawer && activeRole === 'ADMIN' && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 text-slate-100 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="KIDZ R KIDZ" className="h-6 w-auto object-contain bg-white rounded p-0.5" />
                <h3 className="font-extrabold text-sm text-white">Switch Role Portal (Admin Only)</h3>
              </div>
              <button
                onClick={() => setShowRoleDrawer(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => handleRoleSelect('ADMIN')}
                className="p-3 rounded-2xl bg-blue-600 text-white font-bold"
              >
                Admin Control Desk
              </button>
              <button
                onClick={() => handleRoleSelect('TEACHER')}
                className="p-3 rounded-2xl bg-teal-600 text-white font-bold"
              >
                Teacher View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
