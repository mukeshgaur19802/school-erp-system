'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { BookMarked, CheckCircle2, Award, Calendar, BookOpen, Clock, Printer, Sparkles } from 'lucide-react';

export const ParentAcademics: React.FC = () => {
  const { currentStudent, attendance, homework, classwork, examMarks, timetable, setActiveModal, setModalData } = useERP();
  const [academicTab, setAcademicTab] = useState<'ATTENDANCE' | 'HOMEWORK' | 'TIMETABLE' | 'RESULTS'>('HOMEWORK');

  const studentAtt = attendance.filter((a) => a.studentId === currentStudent?.id);
  const studentHw = homework.filter((h) => h.className === currentStudent?.className && h.section === currentStudent?.section);
  const studentCw = classwork.filter((c) => c.className === currentStudent?.className && c.section === currentStudent?.section);
  const studentMarks = examMarks.filter((m) => m.studentId === currentStudent?.id);
  const studentTt = timetable.filter((t) => t.className === currentStudent?.className && t.section === currentStudent?.section);

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* Top Navigation Sub-Tabs */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-lg text-white">Academic Progress Center</h2>
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setAcademicTab('HOMEWORK')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              academicTab === 'HOMEWORK'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Homework & Classwork
          </button>
          <button
            onClick={() => setAcademicTab('ATTENDANCE')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              academicTab === 'ATTENDANCE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Attendance Logs
          </button>
          <button
            onClick={() => setAcademicTab('TIMETABLE')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              academicTab === 'TIMETABLE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Timetable
          </button>
          <button
            onClick={() => setAcademicTab('RESULTS')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              academicTab === 'RESULTS'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Exam Results & Report Card
          </button>
        </div>
      </div>

      {/* Homework Tab */}
      {academicTab === 'HOMEWORK' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Daily Homework Tasks ({studentHw.length})
            </h3>
            <div className="space-y-3">
              {studentHw.map((hw) => (
                <div key={hw.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300">{hw.subject}</span>
                    <span className="text-[10px] text-amber-400 font-semibold">Due: {hw.dueDate}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{hw.title}</h4>
                  <p className="text-xs text-slate-300">{hw.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-emerald-400" />
              Daily Classwork Summary ({studentCw.length})
            </h3>
            <div className="space-y-3">
              {studentCw.map((cw) => (
                <div key={cw.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300">{cw.subject}</span>
                    <span className="text-[10px] text-slate-400">{cw.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{cw.title}</h4>
                  <p className="text-xs text-slate-300">{cw.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {academicTab === 'ATTENDANCE' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Daily Attendance Register Logs
          </h3>
          <div className="divide-y divide-slate-800">
            {studentAtt.map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{att.date}</span>
                <span className={`font-bold px-3 py-1 rounded-xl border ${
                  att.status === 'PRESENT'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Tab */}
      {academicTab === 'TIMETABLE' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Weekly Class Timetable (Class {currentStudent?.className}-{currentStudent?.section})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {studentTt.map((tt) => (
              <div key={tt.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">Period {tt.period}</span>
                <h4 className="font-bold text-sm text-white">{tt.subject}</h4>
                <p className="text-xs text-slate-400">{tt.teacherName}</p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/50">{tt.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Results Tab */}
      {academicTab === 'RESULTS' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Unit Test & Term Exam Results
            </h3>

            <button
              onClick={() => {
                setModalData(currentStudent);
                setActiveModal('REPORT_CARD');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Progress Report Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {studentMarks.map((m) => (
              <div key={m.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-[10px] font-bold text-amber-300 uppercase">{m.examName}</span>
                <h4 className="font-bold text-base text-white">{m.subject}</h4>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-lg font-black text-emerald-400">{m.marksObtained} / {m.maxMarks}</span>
                  <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Grade {m.grade}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic">"{m.remarks}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
