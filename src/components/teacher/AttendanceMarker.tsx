'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { CheckSquare, UserCheck, CheckCircle2, XCircle, Clock, Save } from 'lucide-react';

export const AttendanceMarker: React.FC = () => {
  const { students, markAttendance, currentTeacher } = useERP();

  const [selectedClass, setSelectedClass] = useState('5');
  const [selectedSection, setSelectedSection] = useState('A');

  // Filter students matching selected class & section
  const classStudents = students.filter(
    (s) => s.className === selectedClass && s.section === selectedSection
  );

  const [attendanceState, setAttendanceState] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' }>(() => {
    const initial: { [key: string]: 'PRESENT' | 'ABSENT' | 'LATE' } = {};
    students.forEach((s) => {
      initial[s.id] = 'PRESENT';
    });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map((s) => ({
      studentId: s.id,
      status: attendanceState[s.id] || 'PRESENT',
    }));

    markAttendance(records, selectedClass, selectedSection);
  };

  const presentCount = classStudents.filter((s) => attendanceState[s.id] === 'PRESENT').length;
  const absentCount = classStudents.filter((s) => attendanceState[s.id] === 'ABSENT').length;
  const lateCount = classStudents.filter((s) => attendanceState[s.id] === 'LATE').length;

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs">
              <label className="text-slate-400 font-medium px-2">Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-900 text-white px-3 py-1 rounded-xl focus:outline-none"
              >
                {['Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((c) => (
                  <option key={c} value={c}>{c.startsWith('Class') ? c : `Class ${c}`}</option>
                ))}
              </select>

              <label className="text-slate-400 font-medium px-2">Sec:</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-slate-900 text-white px-3 py-1 rounded-xl focus:outline-none"
              >
                {['A','B','C','D'].map((s) => (
                  <option key={s} value={s}>Sec {s}</option>
                ))}
              </select>
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
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
            <span className="text-amber-300 font-semibold">Late: {lateCount}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">
            Class {selectedClass}-{selectedSection} Student Roster ({classStudents.length} Students)
          </h3>

          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Submit Attendance Register</span>
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {classStudents.map((stu) => (
            <div
              key={stu.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-2xl transition-colors"
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

              {/* Status Toggle Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(stu.id, 'PRESENT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    attendanceState[stu.id] === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Present</span>
                </button>

                <button
                  onClick={() => handleStatusChange(stu.id, 'ABSENT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    attendanceState[stu.id] === 'ABSENT'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </button>

                <button
                  onClick={() => handleStatusChange(stu.id, 'LATE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    attendanceState[stu.id] === 'LATE'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Late</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
