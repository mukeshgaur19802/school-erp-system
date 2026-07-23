'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  ShieldCheck,
  GraduationCap,
  Users,
  Bus,
  Bell,
  Sparkles,
  X,
  LogOut
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    notifications,
    markNotificationRead,
    currentUser,
    logout,
    toasts,
    removeToast,
    setActiveTab,
  } = useERP();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setActiveTab('dashboard');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl font-sans">
      {/* Toast Overlay */}
      {toasts.length > 0 && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full pointer-events-auto">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-xl transition-all duration-300 animate-slide-in ${
                toast.type === 'success'
                  ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100'
                  : toast.type === 'error'
                  ? 'bg-rose-950/95 border-rose-500/50 text-rose-100'
                  : 'bg-blue-950/95 border-blue-500/50 text-blue-100'
              }`}
            >
              <Sparkles className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-xs">{toast.title}</h4>
                <p className="text-[11px] mt-0.5 text-slate-200 leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Header */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-white p-1.5 rounded-xl border border-blue-500/30 shrink-0">
              <img
                src="/logo.jpg"
                alt="KIDZ R KIDZ Pre School"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent uppercase">
                KIDZ R KIDZ PRE SCHOOL
              </span>
              <p className="text-[10px] text-blue-300 font-semibold hidden sm:block">School ERP & Communication Platform</p>
            </div>
          </div>

          {/* Role Tabs - STRICT SECURITY ISOLATION: Hidden for Teachers, Parents & Transport */}
          {activeRole === 'ADMIN' && (
            <div className="hidden lg:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => handleRoleChange('ADMIN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeRole === 'ADMIN'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            </div>
          )}

          {/* User Badge & Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      <h3 className="font-semibold text-xs text-white">Announcements</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                      {unreadNotifs.length} new
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto mt-2 space-y-2 pr-1">
                    {unreadNotifs.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No unread notifications</p>
                    ) : (
                      unreadNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold uppercase">
                            <span>{n.category}</span>
                            <span className="text-slate-400 font-normal">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 className="font-semibold text-xs text-white mt-1">{n.title}</h4>
                          <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white truncate max-w-[140px]">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-blue-300 truncate max-w-[140px]">
                  {currentUser?.email || currentUser?.mobile || activeRole}
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-slate-400 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
