'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { BookMarked, CheckCircle2, Award, Calendar, BookOpen, Clock, Printer, Sparkles, Paperclip } from 'lucide-react';

export const ParentAcademics: React.FC = () => {
  const { currentStudent, attendance, homework, classwork, examMarks, timetable, setActiveModal, setModalData } = useERP();
  const [academicTab, setAcademicTab] = useState<'ATTENDANCE' | 'HOMEWORK' | 'TIMETABLE' | 'RESULTS'>('HOMEWORK');
  const [selectedParentDate, setSelectedParentDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [showAllDatesParent, setShowAllDatesParent] = useState(false);

  const studentAtt = attendance.filter((a) => a.studentId === currentStudent?.id);
  const studentHw = homework.filter((h) => h.className === currentStudent?.className && h.section === currentStudent?.section);
  const studentCw = classwork.filter((c) => c.className === currentStudent?.className && c.section === currentStudent?.section);
  const studentMarks = examMarks.filter((m) => m.studentId === currentStudent?.id);
  const studentTt = timetable.filter((t) => t.className === currentStudent?.className && t.section === currentStudent?.section);

  const filteredHw = showAllDatesParent 
    ? studentHw 
    : studentHw.filter(h => h.assignedDate === selectedParentDate);
  const filteredCw = showAllDatesParent 
    ? studentCw 
    : studentCw.filter(c => c.date === selectedParentDate);

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
        <div className="space-y-6">
          {/* Date Picker Filter */}
          <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-md">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Filter Daily Work by Date:
            </span>
            <div className="flex items-center gap-3">
              <input
                type="date"
                disabled={showAllDatesParent}
                value={selectedParentDate}
                onChange={(e) => setSelectedParentDate(e.target.value)}
                className="bg-slate-850 text-white px-3 py-1.5 rounded-xl border border-slate-700 disabled:opacity-50 font-mono focus:outline-none"
              />
              <label className="flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAllDatesParent}
                  onChange={(e) => setShowAllDatesParent(e.target.checked)}
                  className="rounded border-slate-750 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                />
                <span>Show All Dates</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Homework Column */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Daily Homework Tasks ({filteredHw.length})
              </h3>
              <div className="space-y-3">
                {filteredHw.length === 0 ? (
                  <p className="text-slate-400 text-xs italic py-8 text-center bg-slate-800/10 rounded-2xl border border-slate-800/40">
                    No homework assigned for {showAllDatesParent ? 'any date' : selectedParentDate}.
                  </p>
                ) : (
                  filteredHw.map((hw) => (
                    <div key={hw.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-300">{hw.subject}</span>
                        <span className="text-[10px] text-amber-400 font-semibold">Due: {hw.dueDate}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{hw.title}</h4>
                      <p className="text-xs text-slate-300">{hw.description}</p>
                      {hw.attachmentUrl && (hw.attachmentUrl.startsWith('data:image/') || hw.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)/i)) ? (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 max-w-full shadow-md bg-slate-950">
                          <img src={hw.attachmentUrl} alt="Attached Worksheet" className="w-full h-auto max-h-48 object-cover" />
                          {hw.attachmentName && (
                            <div className="p-2 bg-slate-900 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
                              <span className="truncate max-w-[150px]">{hw.attachmentName}</span>
                              <a href={hw.attachmentUrl} download={hw.attachmentName} className="text-cyan-400 font-bold hover:underline shrink-0">Download</a>
                            </div>
                          )}
                        </div>
                      ) : (
                        hw.attachmentName && (
                          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 inline-flex items-center gap-1.5 text-xs text-cyan-300 mt-1">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span className="truncate">{hw.attachmentName}</span>
                            {hw.attachmentUrl && hw.attachmentUrl !== '#' && (
                              <a href={hw.attachmentUrl} download={hw.attachmentName} className="ml-2 text-cyan-400 font-bold hover:underline">Download</a>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Classwork Column */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-400" />
                Daily Classwork Summary ({filteredCw.length})
              </h3>
              <div className="space-y-3">
                {filteredCw.length === 0 ? (
                  <p className="text-slate-400 text-xs italic py-8 text-center bg-slate-800/10 rounded-2xl border border-slate-800/40">
                    No classwork posted for {showAllDatesParent ? 'any date' : selectedParentDate}.
                  </p>
                ) : (
                  filteredCw.map((cw) => (
                    <div key={cw.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-300">{cw.subject}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{cw.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{cw.title}</h4>
                      <p className="text-xs text-slate-300 whitespace-pre-line">{cw.description}</p>
                    </div>
                  ))
                )}
              </div>
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
