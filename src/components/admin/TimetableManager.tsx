'use client';

import React, { useState } from 'react';
import { useERP, DEFAULT_PERIODS } from '../../context/ERPContext';
import { 
  Clock, Plus, Trash2, Calendar, BookOpen, Users, 
  ArrowLeft, Edit, AlertTriangle, Bell, UserCheck, ShieldAlert, X
} from 'lucide-react';
import { TimetableSlot, PeriodTime, DailyOverride } from '../../types';

export const TimetableManager: React.FC = () => {
  const { 
    timetable, 
    teachers, 
    periodConfigs, 
    dailyOverrides,
    addTimetableSlot, 
    deleteTimetableSlot,
    savePeriodConfigs,
    addDailyOverride,
    deleteDailyOverride,
    updateTimetableSlot,
    assignClassTeacher,
    sendNotification,
    addToast
  } = useERP();

  // Navigation states
  const [selectedClass, setSelectedClass] = useState<{ className: string; section: string } | null>(null);
  
  // Custom Timings Modal State
  const [showTimingsModal, setShowTimingsModal] = useState(false);
  const [editingTimings, setEditingTimings] = useState<PeriodTime[]>([]);

  // Period Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignData, setAssignData] = useState<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    periodId: string;
    time: string;
  } | null>(null);

  // Assignment fields
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [selectedTeacherName, setSelectedTeacherName] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [isSubstitute, setIsSubstitute] = useState(false);
  
  // View mode
  const [scheduleMode, setScheduleMode] = useState<'DEFAULT' | 'DAILY'>('DEFAULT');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Conflict warning confirmation
  const [conflictWarning, setConflictWarning] = useState<{
    teacherName: string;
    classNameSection: string;
    type: 'default' | 'override';
  } | null>(null);

  // Flat list of classes and sections to build tiles
  const classTiles = [
    { className: 'Play Group', section: '' },
    { className: 'Nursery', section: '' },
    { className: 'LKG', section: '' },
    { className: 'UKG', section: '' },
    ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap(num => [
      { className: `Class ${num}`, section: 'A' },
      { className: `Class ${num}`, section: 'B' }
    ])
  ];

  // Common subjects list
  const SUBJECTS_LIST = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Sanskrit', 'EVS', 
    'Social Studies', 'Computer', 'Art/Craft', 'Music', 'Sports', 
    'Yoga', 'GK', 'Club', 'Assembly', 'Class Teacher duties', 'Fruit Break', 'Lunch Break'
  ];

  const className = selectedClass?.className || '';
  const section = selectedClass?.section || '';
  const classKey = section ? `${className}-${section}` : className;

  // Active periods config for the selected class
  const activePeriods = periodConfigs[classKey] || DEFAULT_PERIODS;

  const getVisiblePeriods = (periods: PeriodTime[]) => {
    const reversed = [...periods].reverse();
    const firstNonEmptyFromEndIdx = reversed.findIndex(p => p.time && p.time.trim() !== '');
    if (firstNonEmptyFromEndIdx === -1) {
      // Fallback: show first 6 periods
      return periods.slice(0, 6);
    }
    return periods.slice(0, periods.length - firstNonEmptyFromEndIdx);
  };

  const visiblePeriods = getVisiblePeriods(activePeriods);

  // Find class teacher
  const classTeacher = teachers.find(t => 
    t.assignments.some(a => a.className === className && a.section === section && a.isClassTeacher)
  ) || null;

  // Handler to open timings modal
  const handleOpenTimingsModal = () => {
    setEditingTimings(JSON.parse(JSON.stringify(activePeriods)));
    setShowTimingsModal(true);
  };

  const handleSaveTimings = () => {
    savePeriodConfigs(classKey, editingTimings);
    setShowTimingsModal(false);
  };

  // Check if a teacher has a conflict at this slot
  const checkTeacherConflict = (tName: string, day: string, date: string, pId: string, isSub: boolean) => {
    if (!tName || tName === 'Unassigned' || tName === 'None') return null;

    if (isSub) {
      // 1. Check if there's a daily substitute override for this teacher on this date and period in another class
      const overrideConflict = dailyOverrides.find(o =>
        o.date === date &&
        o.periodId === pId &&
        o.teacherName === tName &&
        !(o.className === className && o.section === section)
      );
      if (overrideConflict) {
        return { type: 'override' as const, classNameSection: `${overrideConflict.className}-${overrideConflict.section}` };
      }

      // 2. Check if they are scheduled in the weekly default for this day of week,
      // but only if that default class has NOT substituted them out for this date.
      const defaultConflict = timetable.find(s =>
        s.day === day &&
        s.periodId === pId &&
        s.teacherName === tName &&
        !(s.className === className && s.section === section)
      );
      if (defaultConflict) {
        const isConflictOverridden = dailyOverrides.some(o =>
          o.date === date &&
          o.periodId === pId &&
          o.className === defaultConflict.className &&
          o.section === defaultConflict.section
        );
        if (!isConflictOverridden) {
          return { type: 'default' as const, classNameSection: `${defaultConflict.className}-${defaultConflict.section}` };
        }
      }
    } else {
      // Default weekly conflict check:
      const defaultConflict = timetable.find(s =>
        s.day === day &&
        s.periodId === pId &&
        s.teacherName === tName &&
        !(s.className === className && s.section === section)
      );
      if (defaultConflict) {
        return { type: 'default' as const, classNameSection: `${defaultConflict.className}-${defaultConflict.section}` };
      }
    }
    return null;
  };

  // Handler to open period assignment modal
  const handleOpenAssignModal = (
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
    periodId: string,
    time: string,
    existingSlot?: TimetableSlot,
    existingOverride?: DailyOverride
  ) => {
    setAssignData({ day, periodId, time });
    
    // Prefill fields
    const activeSubject = existingOverride?.subject || existingSlot?.subject || '';
    if (SUBJECTS_LIST.includes(activeSubject)) {
      setSelectedSubject(activeSubject);
      setCustomSubject('');
    } else if (activeSubject) {
      setSelectedSubject('Custom');
      setCustomSubject(activeSubject);
    } else {
      setSelectedSubject('');
      setCustomSubject('');
    }

    setSelectedTeacherName(existingOverride?.teacherName || existingSlot?.teacherName || '');
    setRoomNo(existingSlot?.roomNo || 'Room ' + (200 + Math.floor(Math.random() * 10)));
    setIsSubstitute(scheduleMode === 'DAILY');
    setConflictWarning(null);
    setShowAssignModal(true);
  };

  // Detect conflicts as form fields change
  const handleTeacherChange = (tName: string) => {
    setSelectedTeacherName(tName);
    if (!assignData) return;

    const conflict = checkTeacherConflict(
      tName, 
      assignData.day, 
      selectedDate, 
      assignData.periodId, 
      isSubstitute
    );

    if (conflict) {
      setConflictWarning({
        teacherName: tName,
        classNameSection: conflict.classNameSection,
        type: conflict.type
      });
    } else {
      setConflictWarning(null);
    }
  };

  const handleSaveAssignment = () => {
    if (!assignData) return;
    const finalSubject = selectedSubject === 'Custom' ? customSubject : selectedSubject;

    // 1. Resolve conflicts if admin confirms or override warning is bypassed
    if (conflictWarning) {
      const targetConflictClass = conflictWarning.classNameSection;
      const [cName, cSec] = targetConflictClass.split('-');

      if (isSubstitute) {
        // Free teacher by overriding that period's teacher to "Unassigned" on this specific date
        addDailyOverride({
          date: selectedDate,
          periodId: assignData.periodId,
          className: cName,
          section: cSec || '',
          subject: 'Teacher reassigned as substitute',
          teacherName: 'Unassigned',
          isSubstitute: true
        });
      } else {
        // Delete standard weekly slot that creates conflict
        const conflictSlot = timetable.find(s =>
          s.day === assignData.day &&
          s.periodId === assignData.periodId &&
          s.teacherName === conflictWarning.teacherName &&
          !(s.className === className && s.section === section)
        );
        if (conflictSlot) {
          deleteTimetableSlot(conflictSlot.id);
        }
      }
    }

    // 2. Save current class period assignment
    if (isSubstitute) {
      addDailyOverride({
        date: selectedDate,
        periodId: assignData.periodId,
        className,
        section,
        subject: finalSubject,
        teacherName: selectedTeacherName,
        isSubstitute: true
      });

      // Send substitute teacher notification
      if (selectedTeacherName && selectedTeacherName !== 'Unassigned') {
        sendNotification({
          title: 'Substitute Period Assigned',
          message: `You have been assigned as a substitute teacher for ${finalSubject} in Class ${className}-${section} on ${selectedDate} (Period ${assignData.periodId}, ${assignData.time}).`,
          category: 'Staff Meeting',
          targetAudience: 'Teachers Only',
          senderName: 'Admin',
          senderRole: 'ADMIN'
        });
      }
    } else {
      // Find if standard weekly slot already exists
      const existing = timetable.find(s =>
        s.day === assignData.day &&
        s.className === className &&
        s.section === section &&
        s.periodId === assignData.periodId
      );

      if (existing) {
        updateTimetableSlot({
          ...existing,
          subject: finalSubject,
          teacherName: selectedTeacherName,
          time: assignData.time,
          roomNo
        });
      } else {
        addTimetableSlot({
          day: assignData.day,
          time: assignData.time,
          periodId: assignData.periodId,
          period: isNaN(Number(assignData.periodId)) ? 1 : Number(assignData.periodId),
          subject: finalSubject,
          className,
          section,
          teacherName: selectedTeacherName,
          roomNo
        });
      }

      // Send default assignment teacher notification
      if (selectedTeacherName && selectedTeacherName !== 'Unassigned') {
        sendNotification({
          title: 'Weekly Timetable Assignment',
          message: `You have been assigned to teach ${finalSubject} for Class ${className}-${section} on ${assignData.day} at Period ${assignData.periodId} (${assignData.time}).`,
          category: 'Staff Meeting',
          targetAudience: 'Teachers Only',
          senderName: 'Admin',
          senderRole: 'ADMIN'
        });
      }
    }

    setShowAssignModal(false);
  };

  // Helper to resolve day of week from date picker
  const getDayNameFromDate = (dateStr: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr);
    return days[d.getDay()] as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  };

  const getCellDetails = (dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday', periodId: string) => {
    const weeklySlot = timetable.find(s =>
      s.className === className &&
      s.section === section &&
      s.day === dayName &&
      s.periodId === periodId
    );

    let override: DailyOverride | undefined;
    if (scheduleMode === 'DAILY') {
      override = dailyOverrides.find(o =>
        o.className === className &&
        o.section === section &&
        o.date === selectedDate &&
        o.periodId === periodId
      );
    }

    return { weeklySlot, override };
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* LANDING VIEW: TILES LIST */}
      {!selectedClass && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 inline-block">
              Timetable & Teaching Hours
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Classes & Faculty Schedules
            </h1>
            <p className="text-xs text-slate-400">
              Select any class below to configure its weekly timetable, customize period timings, and assign substitute teachers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {classTiles.map((tile) => {
              const count = timetable.filter(s => s.className === tile.className && s.section === tile.section).length;
              const ct = teachers.find(t => t.assignments.some(a => a.className === tile.className && a.section === tile.section && a.isClassTeacher));
              return (
                <button
                  key={`${tile.className}-${tile.section}`}
                  onClick={() => setSelectedClass(tile)}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/50 shadow-md text-left transition-all duration-300 transform hover:-translate-y-0.5 space-y-3 cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-extrabold text-[9px] uppercase tracking-wide">
                      {tile.section ? `Section ${tile.section}` : 'General'}
                    </span>
                    <Clock className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base leading-tight group-hover:text-blue-300 transition-colors">
                      {tile.className}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {count} Periods Scheduled
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-500">Class Teacher:</span>
                    <p className="font-semibold text-slate-300 truncate mt-0.5">
                      {ct ? ct.name : 'Not Assigned'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL VIEW: TIMETABLE GRID */}
      {selectedClass && (
        <div className="space-y-6">
          {/* Header Controls Block */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Back to Classes"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-white">
                    {className} {section && ` - Section ${section}`} Timetable
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Class Teacher:</span>
                    <select
                      value={classTeacher?.id || ''}
                      onChange={(e) => assignClassTeacher(className, section, e.target.value || null)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">-- Unassigned --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Edit timings CTA */}
              <button
                onClick={handleOpenTimingsModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-blue-400" />
                <span>Edit Period Timings</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              {/* Mode Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                <button
                  onClick={() => setScheduleMode('DEFAULT')}
                  className={`px-3.5 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer ${
                    scheduleMode === 'DEFAULT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Weekly Default Template
                </button>
                <button
                  onClick={() => setScheduleMode('DAILY')}
                  className={`px-3.5 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer ${
                    scheduleMode === 'DAILY' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Daily Schedule Override
                </button>
              </div>

              {/* Date picker for substitute mode */}
              {scheduleMode === 'DAILY' && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-bold">Select Date:</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500 cursor-pointer"
                  />
                  <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-extrabold text-[10px] uppercase font-mono">
                    {getDayNameFromDate(selectedDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timetable Grid Table Container */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse table-fixed select-none text-[11px]">
              <thead>
                {/* Headers Row */}
                <tr className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[9px] border-b border-slate-800">
                  <th className="w-[100px] py-3 text-left pl-4 font-black">DAY</th>
                  {visiblePeriods.map((period) => (
                    <th key={period.periodId} className="py-3 text-center border-l border-slate-800/50 font-black">
                      <div className="font-extrabold text-slate-200">{period.name}</div>
                      <div className="font-semibold text-slate-500 font-mono mt-0.5">{period.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName) => {
                  const isHighlightedDay = scheduleMode === 'DAILY' && getDayNameFromDate(selectedDate) === dayName;
                  
                  return (
                    <tr 
                      key={dayName} 
                      className={`border-b border-slate-800/80 transition-colors ${
                        isHighlightedDay ? 'bg-blue-950/15' : 'hover:bg-slate-800/20'
                      }`}
                    >
                      {/* Day Label */}
                      <td className="py-4 pl-4 font-black text-slate-300 uppercase select-none">
                        {dayName.substring(0, 3)}
                        {isHighlightedDay && (
                          <span className="block text-[8px] text-blue-400 font-bold tracking-widest mt-0.5">TODAY</span>
                        )}
                      </td>

                      {/* Period Cells */}
                      {visiblePeriods.map((period) => {
                        const { weeklySlot, override } = getCellDetails(
                          dayName as any, 
                          period.periodId
                        );

                        // If it's a break period, span across all 6 rows (only render on Monday)
                        if (period.isBreak) {
                          if (dayName === 'Monday') {
                            return (
                              <td
                                key={period.periodId}
                                rowSpan={6}
                                className="bg-slate-950/50 text-center font-bold border-l border-slate-800 align-middle w-[50px] p-2"
                              >
                                <div 
                                  className="flex flex-col items-center justify-center font-extrabold tracking-[0.2em] text-[10px] text-blue-400 uppercase h-full py-16" 
                                  style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                                >
                                  {period.name}
                                </div>
                              </td>
                            );
                          }
                          // Skip rendering for subsequent rows
                          return null;
                        }

                        // Normal Cell Display
                        const activeSubject = override ? override.subject : (weeklySlot?.subject || '');
                        const activeTeacher = override ? override.teacherName : (weeklySlot?.teacherName || '');
                        const isSubstituted = !!override;
                        const isUnassigned = activeTeacher === 'Unassigned' || !activeSubject;

                        return (
                          <td 
                            key={period.periodId} 
                            onClick={() => handleOpenAssignModal(
                              dayName as any, 
                              period.periodId, 
                              period.time, 
                              weeklySlot, 
                              override
                            )}
                            className={`p-3 border-l border-slate-800/60 text-center cursor-pointer transition-all hover:bg-slate-800/35 relative group ${
                              isSubstituted 
                                ? activeTeacher === 'Unassigned' 
                                  ? 'bg-red-950/15 border-red-500/20 text-red-300'
                                  : 'bg-amber-950/30 border-amber-500/30 text-amber-300' 
                                : isUnassigned
                                  ? 'text-slate-600'
                                  : 'bg-slate-800/20 text-slate-100'
                            }`}
                          >
                            {!isUnassigned ? (
                              <div className="space-y-1">
                                <div className="font-extrabold uppercase text-slate-200 group-hover:text-blue-300 transition-colors truncate">
                                  {activeSubject}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium truncate">
                                  {activeTeacher}
                                </div>
                                {isSubstituted && (
                                  <span className="absolute top-1 right-1 px-1 rounded bg-amber-500/20 text-amber-400 text-[7px] font-black uppercase tracking-wider scale-90">
                                    {activeTeacher === 'Unassigned' ? 'Free' : 'Sub'}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-400 italic">
                                + Assign
                              </span>
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
      )}

      {/* MODAL 1: EDIT PERIOD TIMINGS */}
      {showTimingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Configure Timetable Period Slots
              </h3>
              <button 
                onClick={() => setShowTimingsModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {editingTimings.map((p, idx) => (
                <div key={p.periodId} className="grid grid-cols-12 gap-2 items-center text-xs">
                  <div className="col-span-3 font-bold text-slate-300 uppercase tracking-wide">
                    {p.name}
                  </div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={p.time}
                      onChange={(e) => {
                        const copy = [...editingTimings];
                        copy[idx].time = e.target.value;
                        setEditingTimings(copy);
                      }}
                      placeholder="e.g. 07:45 AM - 08:25 AM"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-[11px]"
                    />
                  </div>
                  <div className="col-span-3 flex items-center gap-1 justify-end">
                    <label className="text-[10px] text-slate-500 font-bold uppercase select-none">Break</label>
                    <input
                      type="checkbox"
                      checked={p.isBreak}
                      onChange={(e) => {
                        const copy = [...editingTimings];
                        copy[idx].isBreak = e.target.checked;
                        setEditingTimings(copy);
                      }}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800 text-xs font-bold">
              <button
                onClick={() => setShowTimingsModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTimings}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                Save Custom Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PERIOD ASSIGNMENT */}
      {showAssignModal && assignData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  Assign Slot: {assignData.day} - {assignData.periodId}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{assignData.time}</p>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Mode indicator check */}
              {scheduleMode === 'DAILY' && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Configuring substitute teacher for <strong>{selectedDate}</strong> only. Default weekly timetable won't be modified.</span>
                </div>
              )}

              {/* Subject Field */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject Name *</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    if (e.target.value !== 'Custom') setCustomSubject('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="">-- Select Subject --</option>
                  <option value="Custom">Custom Subject...</option>
                  {SUBJECTS_LIST.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>

                {selectedSubject === 'Custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom subject name..."
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white mt-2"
                  />
                )}
              </div>

              {/* Teacher Field */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assigned Faculty *</label>
                <select
                  value={selectedTeacherName}
                  onChange={(e) => handleTeacherChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="">-- Unassigned (Free Period) --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                  ))}
                </select>
              </div>

              {/* Classroom Field */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Classroom / Location</label>
                <input
                  type="text"
                  placeholder="Room 204"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Substitute Checkbox Override */}
              {scheduleMode === 'DAILY' && (
                <div className="flex items-center gap-2 p-1">
                  <input
                    type="checkbox"
                    id="subCheck"
                    checked={isSubstitute}
                    onChange={(e) => setIsSubstitute(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="subCheck" className="text-slate-300 font-bold cursor-pointer select-none">
                    Save as substitute override (Only applies on {selectedDate})
                  </label>
                </div>
              )}

              {/* COLLISION DETECTED ALERT SECTION */}
              {conflictWarning && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-extrabold text-[10px]">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>LOGICAL FACULTY CONFLICT DETECTED</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    <strong>{conflictWarning.teacherName}</strong> is already assigned to teach <strong>{conflictWarning.classNameSection}</strong> during this period.
                  </p>
                  <div className="p-2 rounded bg-red-950/60 border border-red-500/20 text-[9px] text-red-300 font-semibold leading-relaxed">
                    Saving will automatically <strong>FREE</strong> {conflictWarning.teacherName} from {conflictWarning.classNameSection} and reassign them here.
                  </div>
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 pt-3 border-t border-slate-800 text-xs font-bold">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                {conflictWarning ? 'Free Teacher & Reassign' : 'Save Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
