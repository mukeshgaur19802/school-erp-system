'use client';

import React, { useState } from 'react';
import { useERP, DEFAULT_PERIODS } from '../../context/ERPContext';
import {
  Users,
  BookOpen,
  Calendar,
  CheckSquare,
  Award,
  Bell,
  Camera,
  Upload,
  Send,
  Sparkles,
  CheckCircle2,
  FileText,
  Trash2,
  Clock,
  Filter
} from 'lucide-react';
import { Homework, Classwork, ExamMark, PeriodTime, DailyOverride } from '../../types';

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

  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'ATTENDANCE' | 'CLASSWORK' | 'HOMEWORK' | 'MARKS' | 'NOTIFICATIONS'>('OVERVIEW');

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

  // 1. Attendance Form State
  const [attDate, setAttDate] = useState(todayStr);
  const [attStatusMap, setAttStatusMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});

  // 2. Classwork & Homework Form State
  const [hwTitle, setHwTitle] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwAttachments, setHwAttachments] = useState<string[]>([]);
  const [isDraggingHw, setIsDraggingHw] = useState(false);

  const [cwTitle, setCwTitle] = useState('');
  const [cwTopics, setCwTopics] = useState('');

  // 3. Exam Marks State
  const [examName, setExamName] = useState('Mid-Term Examination');
  const [maxMarks, setMaxMarks] = useState(100);
  const [marksMap, setMarksMap] = useState<Record<string, { obtained: number; remarks: string }>>({});

  // 4. Change Password State
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

  // File / Camera Upload Handler
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setHwAttachments((prev) => [...prev, e.target?.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAttendance = () => {
    const records = assignedStudents.map((stu) => ({
      studentId: stu.id,
      status: attStatusMap[stu.id] || 'PRESENT',
    }));
    markAttendance(records, primaryClass, primarySection);
  };

  const handlePostHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle || !hwDueDate) return;

    addHomework({
      title: hwTitle,
      subject: primarySubject,
      className: primaryClass,
      section: primarySection,
      teacherName: currentTeacher?.name || 'Mrs. Sharma',
      dueDate: hwDueDate,
      description: hwDesc || `Homework worksheet assigned for ${primarySubject}.`,
      attachments: hwAttachments,
    });

    setHwTitle('');
    setHwDesc('');
    setHwAttachments([]);
  };

  const handlePostClasswork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cwTitle || !cwTopics) return;

    addClasswork({
      title: cwTitle,
      subject: primarySubject,
      className: primaryClass,
      section: primarySection,
      teacherName: currentTeacher?.name || 'Mrs. Sharma',
      topicsCovered: cwTopics,
    });

    setCwTitle('');
    setCwTopics('');
  };

  const handleSaveExamMarks = () => {
    const entries = assignedStudents.map((stu) => {
      const entry = marksMap[stu.id] || { obtained: 85, remarks: 'Good Understanding' };
      const pct = (entry.obtained / maxMarks) * 100;
      let grade = 'A+';
      if (pct < 60) grade = 'C';
      else if (pct < 75) grade = 'B';
      else if (pct < 90) grade = 'A';

      return {
        studentId: stu.id,
        examName,
        subject: primarySubject,
        marksObtained: Number(entry.obtained),
        maxMarks: Number(maxMarks),
        grade,
        remarks: entry.remarks || 'Satisfactory Performance',
      };
    });

    addExamMarks(entries);
  };

  // Date-wise filtered historical classwork & homework
  const filteredClassworkHistory = classwork.filter(
    (cw) => cw.className === primaryClass && cw.section === primarySection && cw.date === selectedAuditDate
  );

  const filteredHomeworkHistory = homework.filter(
    (hw) => hw.className === primaryClass && hw.section === primarySection && hw.assignedDate === selectedAuditDate
  );

  const adminNotifs = notifications.filter(
    (n) => n.targetAudience === 'Everyone' || n.targetAudience === 'Teachers Only'
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

          {/* Sub Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <button
              onClick={() => setActiveSubTab('OVERVIEW')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeSubTab === 'OVERVIEW' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview & Schedule
            </button>
            <button
              onClick={() => setActiveSubTab('ATTENDANCE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeSubTab === 'ATTENDANCE' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveSubTab('HOMEWORK')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeSubTab === 'HOMEWORK' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Classwork & Homework
            </button>
            <button
              onClick={() => setActiveSubTab('MARKS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeSubTab === 'MARKS' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Exam Marks
            </button>
          </div>
        </div>
      </div>

      {/* 1. OVERVIEW & TIMETABLE SUB-TAB */}
      {activeSubTab === 'OVERVIEW' && (
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
                      <h4 className="font-extrabold text-sm text-slate-100 uppercase">{slot.subject}</h4>
                      <p className="text-slate-300 font-semibold">Class {slot.className}-{slot.section}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Weekly Timetable Grid */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  My Weekly Teaching Grid
                </h3>
                <p className="text-xs text-slate-400">
                  Weekly repeating default timetable assigned by Administrator.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
                <table className="w-full min-w-[850px] border-collapse table-fixed text-[11px] select-none">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[9px] border-b border-slate-800">
                      <th className="w-[70px] py-3 text-left pl-3 font-black">DAY</th>
                      {DEFAULT_PERIODS.map(p => (
                        <th key={p.periodId} className="py-2.5 text-center border-l border-slate-800/60 font-black">
                          <div className="text-slate-200 font-bold">{p.name}</div>
                          <div className="text-[9px] sm:text-[10px] text-teal-400 font-bold font-mono mt-1 whitespace-nowrap">
                            {getTeacherPeriodTime(currentTeacher?.name || 'Mrs. Sharma', p.periodId)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName) => {
                      return (
                        <tr key={dayName} className="border-b border-slate-800/60 hover:bg-slate-800/10 transition-colors">
                          <td className="py-2 pl-3 font-black text-slate-400 uppercase select-none">
                            {dayName.substring(0, 3)}
                          </td>
                          {DEFAULT_PERIODS.map(period => {
                            if (period.isBreak) {
                              if (dayName === 'Monday') {
                                return (
                                  <td
                                    key={period.periodId}
                                    rowSpan={6}
                                    className="bg-slate-950/50 text-center font-bold border-l border-slate-800 align-middle w-[35px] p-1"
                                  >
                                    <div 
                                      className="flex flex-col items-center justify-center font-black tracking-[0.2em] text-[8px] sm:text-[9px] text-teal-500/80 uppercase" 
                                      style={{ writingMode: 'vertical-rl', textOrientation: 'upright', maxHeight: '100px' }}
                                    >
                                      {period.name}
                                    </div>
                                  </td>
                                );
                              }
                              return null;
                            }

                            const slot = getTeacherWeeklySlot(currentTeacher?.name || 'Mrs. Sharma', dayName, period.periodId);
                            return (
                              <td 
                                key={period.periodId} 
                                className={`p-1.5 border-l border-slate-800/50 text-center align-middle h-[48px] overflow-hidden ${
                                  slot ? 'bg-teal-950/15 text-teal-100' : 'text-slate-600'
                                }`}
                              >
                                {slot ? (
                                  <div className="space-y-0.5">
                                    <div className="font-extrabold uppercase truncate text-teal-300 text-[10px] sm:text-[11px]">
                                      {slot.subject}
                                    </div>
                                    <div className="text-[8px] sm:text-[9px] text-slate-400 font-bold truncate">
                                      Class {slot.className}-{slot.section}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-700 italic">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                        <div className="font-bold text-white">{hw.title} (Due: {hw.dueDate})</div>
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
      )}

      {/* 2. ATTENDANCE SUB-TAB */}
      {activeSubTab === 'ATTENDANCE' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-400" />
                Daily Student Attendance Register ({primaryClass}-{primarySection})
              </h3>
              <p className="text-xs text-slate-400">Mark Present, Absent or Late for today</p>
            </div>

            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-lg shadow-teal-600/30 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish Attendance</span>
            </button>
          </div>

          {assignedStudents.length === 0 ? (
            <p className="text-slate-400 py-8 text-center text-xs">No students enrolled in this class to mark attendance.</p>
          ) : (
            <div className="space-y-2">
              {assignedStudents.map((stu) => {
                const currentStatus = attStatusMap[stu.id] || 'PRESENT';
                return (
                  <div key={stu.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={stu.photo} alt={stu.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white">{stu.name} (Roll #{stu.rollNo})</div>
                        <div className="text-[10px] text-slate-400">Father: {stu.fatherName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAttStatusMap({ ...attStatusMap, [stu.id]: 'PRESENT' })}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          currentStatus === 'PRESENT' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setAttStatusMap({ ...attStatusMap, [stu.id]: 'ABSENT' })}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          currentStatus === 'ABSENT' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => setAttStatusMap({ ...attStatusMap, [stu.id]: 'LATE' })}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          currentStatus === 'LATE' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. HOMEWORK & CLASSWORK SUB-TAB (WITH CAMERA / DRAG & DROP) */}
      {activeSubTab === 'HOMEWORK' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Post Homework with Notes/Image Upload */}
          <form onSubmit={handlePostHomework} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              Post Homework & Worksheet (Class {primaryClass}-{primarySection})
            </h3>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Homework Topic / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Exercise 4.2 Fractions Worksheet"
                value={hwTitle}
                onChange={(e) => setHwTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={hwDueDate}
                onChange={(e) => setHwDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Instructions for Parents & Students</label>
              <textarea
                rows={3}
                placeholder="Complete questions 1 to 10 in homework notebook..."
                value={hwDesc}
                onChange={(e) => setHwDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Drag & Drop Notes / Camera Attachment Box */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-300">
                Attach Notes / PDF / Image (Camera or Drag & Drop)
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingHw(true); }}
                onDragLeave={() => setIsDraggingHw(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingHw(false);
                  if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                }}
                className={`p-4 rounded-2xl border-2 border-dashed text-center space-y-2 bg-slate-800/50 ${
                  isDraggingHw ? 'border-teal-500 bg-teal-950/30' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <label className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }}
                    />
                  </label>

                  <label className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Capture Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400">Drag & drop files from your computer or snap notebook picture</p>
              </div>

              {hwAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {hwAttachments.map((att, idx) => (
                    <div key={idx} className="relative group">
                      <img src={att} alt="Attachment" className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                      <button
                        type="button"
                        onClick={() => setHwAttachments(hwAttachments.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 p-0.5 rounded-full bg-rose-600 text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-600/30"
            >
              <Send className="w-4 h-4" />
              <span>Publish Homework & Send Parent Alert</span>
            </button>
          </form>

          {/* Daily Classwork Logger */}
          <form onSubmit={handlePostClasswork} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Update Daily Classwork Log ({primaryClass}-{primarySection})
            </h3>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Classwork Lesson Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter 4 Fractions Introduction"
                value={cwTitle}
                onChange={(e) => setCwTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Topics Covered in Class Today *</label>
              <textarea
                rows={4}
                required
                placeholder="Explained proper and improper fractions with real life examples..."
                value={cwTopics}
                onChange={(e) => setCwTopics(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Classwork Activity</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. EXAM MARKS SUB-TAB */}
      {activeSubTab === 'MARKS' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Exam Evaluation Marks Entry ({primaryClass}-{primarySection})
              </h3>
              <p className="text-xs text-slate-400">Enter marks obtained out of max marks</p>
            </div>

            <button
              onClick={handleSaveExamMarks}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Save & Publish Report Card Marks</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Evaluation Exam Title</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Max Score</label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>
          </div>

          {assignedStudents.length === 0 ? (
            <p className="text-slate-400 py-8 text-center text-xs">No students enrolled in this class to enter marks.</p>
          ) : (
            <div className="space-y-2 pt-2">
              {assignedStudents.map((stu) => {
                const currentEntry = marksMap[stu.id] || { obtained: 85, remarks: 'Good Understanding' };
                return (
                  <div key={stu.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-center">
                    <div className="flex items-center gap-3">
                      <img src={stu.photo} alt={stu.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white">{stu.name} (Roll #{stu.rollNo})</div>
                        <div className="text-[10px] text-slate-400">Father: {stu.fatherName}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Marks Obtained (out of {maxMarks})</label>
                      <input
                        type="number"
                        value={currentEntry.obtained}
                        onChange={(e) => setMarksMap({ ...marksMap, [stu.id]: { ...currentEntry, obtained: Number(e.target.value) } })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-extrabold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Teacher Remarks</label>
                      <input
                        type="text"
                        value={currentEntry.remarks}
                        onChange={(e) => setMarksMap({ ...marksMap, [stu.id]: { ...currentEntry, remarks: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
