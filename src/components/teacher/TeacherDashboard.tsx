'use client';

import React, { useState } from 'react';
import { useERP, DEFAULT_PERIODS } from '../../context/ERPContext';
import {
  Calendar,
  Bell,
  Clock,
  Filter
} from 'lucide-react';
import { PeriodTime, DailyOverride } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const {
    currentTeacher,
    students,
    timetable,
    attendance,
    markAttendance,
    homework,
    addHomework,
    classwork,
    addClasswork,
    examMarks,
    addExamMarks,
    notifications,
    editTeacher,
    addToast,
    periodConfigs,
    dailyOverrides,
  } = useERP();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedAuditDate, setSelectedAuditDate] = useState(todayStr);

  const [selectedScheduleDate, setSelectedScheduleDate] = useState(todayStr);

  const getDayNameFromDate = (dateStr: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr);
    return days[d.getDay()] as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  };

  const getTeacherScheduleForDate = (tName: string, dateStr: string) => {
    const dayName = getDayNameFromDate(dateStr);
    const schedule: {
      id: string;
      periodId: string;
      time: string;
      subject: string;
      className: string;
      section: string;
      isSubstitute: boolean;
    }[] = [];

    // Filter standard weekly default timetable slots where this teacher is assigned
    timetable.filter(s => s.day === dayName).forEach(slot => {
      const override = dailyOverrides.find(o =>
        o.date === dateStr &&
        o.periodId === slot.periodId &&
        o.className === slot.className &&
        o.section === slot.section
      );

      if (override) {
        if (override.teacherName.toLowerCase() === tName.toLowerCase()) {
          schedule.push({
            id: override.id,
            periodId: override.periodId || '1',
            time: slot.time,
            subject: override.subject,
            className: override.className,
            section: override.section,
            isSubstitute: true
          });
        }
      } else {
        if (slot.teacherName.toLowerCase() === tName.toLowerCase()) {
          schedule.push({
            id: slot.id,
            periodId: slot.periodId || String(slot.period || 1),
            time: slot.time,
            subject: slot.subject,
            className: slot.className,
            section: slot.section,
            isSubstitute: false
          });
        }
      }
    });

    // Also scan for substitute overrides where this teacher is assigned as a substitute
    dailyOverrides.filter(o => o.date === dateStr && o.teacherName.toLowerCase() === tName.toLowerCase()).forEach(override => {
      const alreadyAdded = schedule.some(s => s.periodId === override.periodId && s.className === override.className && s.section === override.section);
      if (!alreadyAdded) {
        const classKey = override.section ? `${override.className}-${override.section}` : override.className;
        const classPeriods = periodConfigs[classKey] || DEFAULT_PERIODS;
        const pTime = classPeriods.find(p => p.periodId === override.periodId)?.time || '08:30 AM - 09:15 AM';
        
        schedule.push({
          id: override.id,
          periodId: override.periodId,
          time: pTime,
          subject: override.subject,
          className: override.className,
          section: override.section,
          isSubstitute: true
        });
      }
    });

    return schedule.sort((a, b) => a.periodId.localeCompare(b.periodId, undefined, { numeric: true }));
  };

  const getTeacherWeeklySlot = (tName: string, day: string, pId: string) => {
    return timetable.find(s =>
      s.day === day &&
      s.periodId === pId &&
      s.teacherName.toLowerCase() === tName.toLowerCase()
    );
  };

  const getTeacherPeriodTime = (tName: string, periodId: string) => {
    // 1. Find weekly default slot timing
    const weeklySlot = timetable.find(s => 
      s.teacherName.toLowerCase() === tName.toLowerCase() && 
      s.periodId === periodId
    );
    if (weeklySlot) {
      const classKey = weeklySlot.section ? `${weeklySlot.className}-${weeklySlot.section}` : weeklySlot.className;
      const configs = periodConfigs[classKey] || DEFAULT_PERIODS;
      const config = configs.find(p => p.periodId === periodId);
      if (config) return config.time;
    }
    
    // 2. Fallback to daily overrides timing
    const override = dailyOverrides.find(o => 
      o.teacherName.toLowerCase() === tName.toLowerCase() && 
      o.periodId === periodId
    );
    if (override) {
      const classKey = override.section ? `${override.className}-${override.section}` : override.className;
      const configs = periodConfigs[classKey] || DEFAULT_PERIODS;
      const config = configs.find(p => p.periodId === periodId);
      if (config) return config.time;
    }

    // 3. Fallback to global DEFAULT_PERIODS timing
    return DEFAULT_PERIODS.find(p => p.periodId === periodId)?.time || '';
  };

  const getTeacherVisiblePeriods = () => {
    const tName = currentTeacher?.name || 'Mrs. Sharma';
    const periodsWithTimings = DEFAULT_PERIODS.map(p => {
      const time = getTeacherPeriodTime(tName, p.periodId);
      return { ...p, time };
    });

    const reversed = [...periodsWithTimings].reverse();
    const firstNonEmptyFromEndIdx = reversed.findIndex(p => p.time && p.time.trim() !== '');
    if (firstNonEmptyFromEndIdx === -1) {
      // Fallback: show first 6 periods
      return DEFAULT_PERIODS.slice(0, 6);
    }
    return DEFAULT_PERIODS.slice(0, DEFAULT_PERIODS.length - firstNonEmptyFromEndIdx);
  };

  // Primary Assignment for logged-in teacher
  const teacherAssignments = currentTeacher?.assignments || [
    { className: 'Class 8', section: 'A', subject: 'Mathematics', isClassTeacher: true }
  ];

  const primaryClass = teacherAssignments[0]?.className || 'Class 8';
  const primarySection = teacherAssignments[0]?.section || 'A';
  const primarySubject = teacherAssignments[0]?.subject || 'Mathematics';

  const assignedStudents = students.filter(
    (s) => s.className === primaryClass && s.section === primarySection
  );

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangePassExpanded, setIsChangePassExpanded] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacher) return;
    const actualPass = currentTeacher.password || 'teach#321';
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
    editTeacher(currentTeacher.id, { password: newPassword });
    addToast('Success', 'Password updated successfully.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangePassExpanded(false);
  };

  // Date-wise filtered historical classwork & homework
  const filteredClassworkHistory = classwork.filter(
    (cw) => cw.className === primaryClass && cw.section === primarySection && cw.date === selectedAuditDate
  );

  const filteredHomeworkHistory = homework.filter(
    (hw) => hw.className === primaryClass && hw.section === primarySection && hw.assignedDate === selectedAuditDate
  );

  const adminNotifs = notifications.filter(
    (n) => 
      (n.targetAudience === 'Everyone' || n.targetAudience === 'Teachers Only') &&
      n.senderName !== 'Admission Desk' &&
      n.senderRole === 'ADMIN'
  );

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Teacher Profile Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentTeacher?.avatar}
              alt={currentTeacher?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-xl shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30">
                  {currentTeacher?.role || 'Class Teacher'}
                </span>
                <span className="text-xs text-slate-400 font-mono">Mobile: {currentTeacher?.mobile}</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">
                {currentTeacher?.name || 'Mrs. Sharma'}
              </h1>
              <p className="text-xs text-slate-300">
                Assigned Subject: <strong className="text-teal-300">{primarySubject}</strong> | Assigned Class: <strong className="text-white">{primaryClass}-{primarySection}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Teaching Schedule (Date-dependent, resolves Substitutes) */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  Teaching Schedule for Date
                </h3>
                <p className="text-[10px] text-slate-400">
                  Showing schedule for {selectedScheduleDate} ({getDayNameFromDate(selectedScheduleDate)})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-semibold">Select Date:</span>
                <input
                  type="date"
                  value={selectedScheduleDate}
                  onChange={(e) => setSelectedScheduleDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {getTeacherScheduleForDate(currentTeacher?.name || 'Mrs. Sharma', selectedScheduleDate).length === 0 ? (
                <p className="text-slate-400 italic py-6 col-span-2 text-center text-[11px]">
                  No periods assigned to you for {selectedScheduleDate} ({getDayNameFromDate(selectedScheduleDate)}).
                </p>
              ) : (
                getTeacherScheduleForDate(currentTeacher?.name || 'Mrs. Sharma', selectedScheduleDate).map((slot) => (
                  <div 
                    key={slot.id} 
                    className={`p-4 rounded-2xl border transition-all space-y-1 ${
                      slot.isSubstitute 
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' 
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded ${
                        slot.isSubstitute ? 'bg-amber-500/20 text-amber-400' : 'bg-teal-500/10 text-teal-300'
                      }`}>
                        Period {slot.periodId} • {slot.isSubstitute ? 'Substitute Assignment' : 'Regular Class'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{slot.time}</span>
                    </div>
                    <div className="font-extrabold text-sm text-white">{slot.subject}</div>
                    <div className="text-[10px] text-slate-300">Class: {slot.className}-{slot.section}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Teacher Timetable Grid */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              Weekly Timetable Grid
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              {(() => {
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const teacherTimetable = timetable.filter(
                  (slot) => slot.teacherName.toLowerCase() === (currentTeacher?.name || 'Mrs. Sharma').toLowerCase()
                );

                const activePeriods = getTeacherVisiblePeriods();

                return (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-3 border-r border-slate-800">Day</th>
                        {activePeriods.map((p) => (
                          <th key={p.periodId} className="p-3 text-center border-r border-slate-800">
                            P{p.periodId}
                            <span className="block text-[8px] font-normal lowercase mt-0.5 text-slate-500 font-mono">({p.time})</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {days.map((day) => {
                        return (
                          <tr key={day} className="hover:bg-slate-900/40">
                            <td className="p-3 font-bold text-slate-300 bg-slate-950/20 border-r border-slate-800">{day.substring(0, 3)}</td>
                            {activePeriods.map((p) => {
                              const slot = teacherTimetable.find(
                                (s) => s.day === day && (s.periodId === p.periodId || String(s.period) === p.periodId)
                              );
                              return (
                                <td key={p.periodId} className="p-3 text-center border-r border-slate-800">
                                  {slot ? (
                                    <div>
                                      <div className="font-bold text-white text-[11px]">{slot.subject}</div>
                                      <div className="text-[9px] text-slate-400">{slot.className}-{slot.section}</div>
                                    </div>
                                  ) : (
                                    <span className="text-slate-600">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>

          {/* Date-Wise Historical Work Audit */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-teal-400" />
                  Date-Wise Classwork & Homework History
                </h3>
                <p className="text-xs text-slate-400">Verify historical lesson logs for any past date</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-semibold">Select Date:</span>
                <input
                  type="date"
                  value={selectedAuditDate}
                  onChange={(e) => setSelectedAuditDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Classwork covered */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">Classwork Logged on {selectedAuditDate}:</span>
                {filteredClassworkHistory.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px] py-2">No classwork logged for this date.</p>
                ) : (
                  filteredClassworkHistory.map((cw) => (
                    <div key={cw.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-white">{cw.title}</div>
                      <p className="text-slate-300 text-[11px]">"{cw.topicsCovered}"</p>
                    </div>
                  ))
                )}
              </div>

              {/* Homework assigned */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Homework Assigned on {selectedAuditDate}:</span>
                {filteredHomeworkHistory.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px] py-2">No homework assigned for this date.</p>
                ) : (
                  filteredHomeworkHistory.map((hw) => (
                    <div key={hw.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-white">{hw.title}</div>
                      <p className="text-slate-300 text-[11px]">"{hw.description}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Admin Notifications */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Admin Announcements Inbox
            </h3>

            <div className="space-y-3 text-xs">
              {adminNotifs.length === 0 ? (
                <p className="text-slate-400 py-6 text-center italic">No announcements from Principal / Admin office.</p>
              ) : (
                adminNotifs.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1">
                    <div className="flex justify-between text-[10px] text-teal-400 font-bold uppercase">
                      <span>{n.category}</span>
                      <span className="text-slate-400 font-normal">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-white">{n.title}</h4>
                    <p className="text-slate-300 text-[11px] leading-snug">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Change Password Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div 
              onClick={() => setIsChangePassExpanded(!isChangePassExpanded)}
              className="flex items-center justify-between cursor-pointer"
            >
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                🔑 Change Password
              </h3>
              <span className="text-xs text-teal-400 font-bold">{isChangePassExpanded ? 'Hide' : 'Change'}</span>
            </div>

            {isChangePassExpanded && (
              <form onSubmit={handlePasswordChange} className="space-y-3 pt-2 text-xs">
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
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md shadow-teal-900/10"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
