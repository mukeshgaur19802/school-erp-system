'use client';

import React from 'react';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Bell,
  Bus,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  Award,
  BookMarked,
  Printer,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeRole, activeTab, setActiveTab, currentStudent, currentTeacher, setActiveModal, setModalData } = useERP();

  const getNavItems = (): NavItem[] => {
    switch (activeRole) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Admin Overview', icon: LayoutDashboard },
          { id: 'teachers', label: 'Teacher Management', icon: Users },
          { id: 'timetable', label: 'Timetable & Hours', icon: Clock },
          { id: 'fees', label: 'Fee Management', icon: CreditCard },
          { id: 'calendar', label: 'Celebration Calendar', icon: CalendarIcon },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'transport', label: 'Transport & Fleet', icon: Bus },
        ];
      case 'TEACHER':
        return [
          { id: 'dashboard', label: "Teacher Dashboard", icon: LayoutDashboard },
          { id: 'calendar', label: 'School Calendar', icon: CalendarIcon },
          { id: 'notifications', label: 'Admin Alerts', icon: Bell },
        ];
      case 'PARENT':
        return [
          { id: 'profile', label: 'Student Profile', icon: GraduationCap },
          { id: 'academics', label: 'Academics & Attendance', icon: BookMarked },
          { id: 'fees', label: 'Fees & Receipts', icon: CreditCard, badge: 'Pay Online' },
          { id: 'calendar', label: 'Events & Holidays', icon: CalendarIcon },
          { id: 'notifications', label: 'Announcements', icon: Bell },
        ];
      case 'TRANSPORT':
        return [
          { id: 'dashboard', label: 'Fleet & Routes', icon: Bus },
          { id: 'schedules', label: 'Timings & Stops', icon: CalendarIcon },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-6 shrink-0 font-sans">
      {/* KIDZ R KIDZ Card Header */}
      <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 overflow-hidden border border-blue-500/40 shrink-0 flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="overflow-hidden">
            <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
              {activeRole === 'PARENT' ? 'PARENT APP' : activeRole}
            </span>
            <h4 className="font-extrabold text-xs text-white truncate mt-0.5 uppercase">
              KIDZ R KIDZ
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              {activeRole === 'ADMIN' && 'mukeshgaur19802@gmail.com'}
              {activeRole === 'TEACHER' && (currentTeacher?.name || 'Mrs. Sharma')}
              {activeRole === 'PARENT' && (currentStudent?.name ? `Class ${currentStudent?.className}-${currentStudent?.section}` : 'Parent Portal')}
              {activeRole === 'TRANSPORT' && 'Route Desk'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">
          Navigation Menu
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Document Generators */}
      {currentStudent && (
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
            Document Generators
          </span>
          
          <button
            onClick={() => {
              setModalData(currentStudent);
              setActiveModal('ID_CARD');
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
          >
            <div className="flex items-center gap-2">
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Student ID Card</span>
            </div>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>

          <button
            onClick={() => {
              setModalData(currentStudent);
              setActiveModal('REPORT_CARD');
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
          >
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>Progress Report Card</span>
            </div>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      )}
    </aside>
  );
};
