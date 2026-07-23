'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Phone, Mail, Calendar, BookOpen, Clock, CheckCircle2, FileText, Filter } from 'lucide-react';
import { Teacher } from '../../types';

export const TeacherDetailModal: React.FC = () => {
  const { modalData, timetable, classwork, homework, attendance, setActiveModal } = useERP();
  const teacher: Teacher = modalData;

  if (!teacher) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const teacherSlots = timetable.filter(
    (s) => s.teacherName.toLowerCase() === teacher.name.toLowerCase()
  );

  const teacherClasswork = classwork.filter(
    (cw) => cw.teacherName.toLowerCase() === teacher.name.toLowerCase() && cw.date === selectedDate
  );

  const teacherHomework = homework.filter(
    (hw) => hw.teacherName.toLowerCase() === teacher.name.toLowerCase() && hw.assignedDate === selectedDate
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img src={teacher.avatar} alt={teacher.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-lg shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {teacher.role}
                </span>
                <span className="text-xs text-slate-400 font-mono">Mobile: {teacher.mobile}</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">{teacher.name}</h2>
              <p className="text-xs text-slate-400">{teacher.email}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('NONE')}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date Picker Filter for Historical Date-Wise Verification */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-white">Date-Wise Work & Classwork Audit:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Select Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Timetable Schedule */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            Assigned Period Schedule Slots ({teacherSlots.length} Slots)
          </h3>

          {teacherSlots.length === 0 ? (
            <p className="text-slate-400 text-xs italic bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              No period slots currently assigned in Timetable Manager.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {teacherSlots.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <div className="flex justify-between text-[10px] text-teal-400 font-bold">
                    <span>{s.day}</span>
                    <span>{s.time}</span>
                  </div>
                  <h4 className="font-bold text-white">{s.subject} (Class {s.className}-{s.section})</h4>
                  <p className="text-[10px] text-slate-400">{s.roomNo}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date-Wise Classwork Activity */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Classwork Covered on {selectedDate} ({teacherClasswork.length} Entries)
          </h3>

          {teacherClasswork.length === 0 ? (
            <p className="text-slate-400 text-xs italic bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              No classwork logged by {teacher.name} on {selectedDate}.
            </p>
          ) : (
            <div className="space-y-2">
              {teacherClasswork.map((cw) => (
                <div key={cw.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-white">{cw.title} (Class {cw.className}-{cw.section})</div>
                  <p className="text-slate-300 text-[11px]">"{cw.topicsCovered}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date-Wise Homework Activity */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Homework Posted on {selectedDate} ({teacherHomework.length} Entries)
          </h3>

          {teacherHomework.length === 0 ? (
            <p className="text-slate-400 text-xs italic bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              No homework assigned by {teacher.name} on {selectedDate}.
            </p>
          ) : (
            <div className="space-y-2">
              {teacherHomework.map((hw) => (
                <div key={hw.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>{hw.title} (Class {hw.className}-{hw.section})</span>
                    <span className="text-amber-300 text-[10px]">Due: {hw.dueDate}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">"{hw.description}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
