'use client';

import React, { useState, useEffect } from 'react';
import { useERP, getLocalDateString } from '../../context/ERPContext';
import { CheckCircle2, XCircle, Clock, Save } from 'lucide-react';

export const AttendanceMarker: React.FC = () => {
  const { students, attendance, markAttendance, currentTeacher, addToast } = useERP();

  // Find assignments where teacher is class teacher
  const classTeacherAssignments = currentTeacher?.assignments.filter(a => a.isClassTeacher) || [];

  const [selectedClass, setSelectedClass] = useState(() => classTeacherAssignments[0]?.className || '');
  const [selectedSection, setSelectedSection] = useState(() => classTeacherAssignments[0]?.section || '');
  const [attDate, setAttDate] = useState(() => getLocalDateString());
  const [unmarkedErrorIds, setUnmarkedErrorIds] = useState<Set<string>>(new Set());

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Roster student selection
  const classStudents = students.filter(
    (s) => s.className === selectedClass && s.section === selectedSection
  );

  const [attendanceState, setAttendanceState] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' | undefined }>(() => {
    return {};
  });

  // Dynamically load historical attendance when date, class or section changes
  useEffect(() => {
    const initial: { [studentId: string]: 'PRESENT' | 'ABSENT' | undefined } = {};
    classStudents.forEach((s) => {
      const record = attendance.find(
        (r) => r.studentId === s.id && r.date === attDate
      );
      initial[s.id] = record ? (record.status as 'PRESENT' | 'ABSENT') : undefined;
    });
    setAttendanceState(initial);
    setUnmarkedErrorIds(new Set());
    setIsSaved(false);
  }, [attDate, selectedClass, selectedSection, attendance, students]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | undefined) => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
    setIsSaved(false);
  };

  const handleSaveAttendance = async () => {
    const unmarked: string[] = [];
    const records = classStudents.map((s) => {
      const status = attendanceState[s.id];
      if (!status) {
        unmarked.push(s.id);
      }
      return {
        studentId: s.id,
        status: status as 'PRESENT' | 'ABSENT',
      };
    });

    if (unmarked.length > 0) {
      setUnmarkedErrorIds(new Set(unmarked));
      addToast(
        'Attendance Incomplete',
        'Please mark attendance for all students before saving.',
        'error'
      );
      return;
    }

    setUnmarkedErrorIds(new Set());
    setIsSaving(true);
    // 1-second visual feedback for the user
    await new Promise((resolve) => setTimeout(resolve, 1000));
    markAttendance(records, selectedClass, selectedSection, attDate);
    setIsSaving(false);
    setIsSaved(true);
  };

  const presentCount = classStudents.filter((s) => attendanceState[s.id] === 'PRESENT').length;
  const absentCount = classStudents.filter((s) => attendanceState[s.id] === 'ABSENT').length;
  const unmarkedCount = classStudents.length - presentCount - absentCount;

  // Access Control Screen if not assigned as a Class Teacher
  if (classTeacherAssignments.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 font-sans animate-fade-in">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-black text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          You are not assigned as a Class Teacher for any class. If you are substituting, please contact the Admin to assign you as the Class Teacher for today.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              Daily Attendance Register
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Mark Class Attendance
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select class and mark Present/Absent status. Updates parent mobile app instantly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs">
              <label className="text-slate-400 font-semibold px-2">Date:</label>
              <input
                type="date"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
                className="bg-slate-900 text-white px-2 py-0.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 font-semibold font-mono"
              />

              <label className="text-slate-400 font-semibold px-2">Class:</label>
              {classTeacherAssignments.length === 1 ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-xl font-bold font-sans">
                  {classTeacherAssignments[0].className} - Sec {classTeacherAssignments[0].section}
                </span>
              ) : (
                <select
                  value={`${selectedClass}-${selectedSection}`}
                  onChange={(e) => {
                    const [c, s] = e.target.value.split('-');
                    setSelectedClass(c);
                    setSelectedSection(s);
                  }}
                  className="bg-slate-900 text-white px-3 py-1 rounded-xl focus:outline-none font-bold font-sans"
                >
                  {classTeacherAssignments.map((a) => (
                    <option key={`${a.className}-${a.section}`} value={`${a.className}-${a.section}`}>
                      {a.className} - Sec {a.section}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-emerald-300 font-semibold">Present: {presentCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
            <span className="text-rose-300 font-semibold">Absent: {absentCount}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/45 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Unmarked: {unmarkedCount}</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">
            Class {selectedClass}-{selectedSection} Student Roster ({classStudents.length} Students)
          </h3>
        </div>

        <div className="divide-y divide-slate-800/80">
          {[...classStudents].sort((a, b) => a.rollNo - b.rollNo).map((stu) => (
            <div
              key={stu.id}
              className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-2xl transition-all ${
                unmarkedErrorIds.has(stu.id)
                  ? 'border border-rose-500/50 bg-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                  : 'border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={stu.photo}
                  alt={stu.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{stu.name}</h4>
                  <p className="text-xs text-slate-400">
                    Roll No #{stu.rollNo} • Adm: {stu.admissionNo}
                  </p>
                </div>
              </div>

              {/* Mutually Exclusive Checkboxes */}
              <div className="flex items-center gap-6 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={attendanceState[stu.id] === 'PRESENT'}
                    onChange={() => {
                      setUnmarkedErrorIds((prev) => {
                        const next = new Set(prev);
                        next.delete(stu.id);
                        return next;
                      });
                      handleStatusChange(stu.id, attendanceState[stu.id] === 'PRESENT' ? undefined : 'PRESENT');
                    }}
                    className="w-4.5 h-4.5 rounded border-slate-750 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer accent-emerald-500"
                  />
                  <span className={`text-xs font-bold ${attendanceState[stu.id] === 'PRESENT' ? 'text-emerald-400' : 'text-slate-400'}`}>Present</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={attendanceState[stu.id] === 'ABSENT'}
                    onChange={() => {
                      setUnmarkedErrorIds((prev) => {
                        const next = new Set(prev);
                        next.delete(stu.id);
                        return next;
                      });
                      handleStatusChange(stu.id, attendanceState[stu.id] === 'ABSENT' ? undefined : 'ABSENT');
                    }}
                    className="w-4.5 h-4.5 rounded border-slate-750 bg-slate-800 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900 cursor-pointer accent-rose-500"
                  />
                  <span className={`text-xs font-bold ${attendanceState[stu.id] === 'ABSENT' ? 'text-rose-400' : 'text-slate-400'}`}>Absent</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Save & Publish Button */}
        {classStudents.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80 flex justify-end">
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving || isSaved}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-black text-xs shadow-lg ${
                isSaved
                  ? 'bg-emerald-600 border border-emerald-500 text-white shadow-emerald-700/20 cursor-default'
                  : isSaving
                    ? 'bg-slate-800 border border-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-600/30 hover:scale-[1.02] cursor-pointer'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Saved & Sent successfully! ✓</span>
                </>
              ) : isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving & Sending...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Send to Parents</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
