'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Clock, Plus, Trash2, Calendar, BookOpen, Users, Building } from 'lucide-react';

export const TimetableManager: React.FC = () => {
  const { timetable, teachers, addTimetableSlot, deleteTimetableSlot } = useERP();

  const [day, setDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [time, setTime] = useState('08:30 AM - 09:15 AM');
  const [period, setPeriod] = useState(1);
  const [className, setClassName] = useState('Class 8');
  const [section, setSection] = useState('A');
  const [subject, setSubject] = useState('Mathematics');
  const [teacherName, setTeacherName] = useState(teachers[0]?.name || 'Mrs. Sharma');
  const [roomNo, setRoomNo] = useState('Room 204');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTimetableSlot({
      day,
      time,
      period: Number(period),
      className,
      section,
      subject,
      teacherName,
      roomNo,
    });
  };

  const filteredSlots = timetable.filter((s) => s.day === day);

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 inline-block">
          School Hours & Period Schedules
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Admin Timetable & Period Manager
        </h1>
        <p className="text-xs text-slate-400">
          Configure daily teaching periods and assign faculty members to subject classes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to add slot */}
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" />
            Add Period Schedule Slot
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Day of Week *</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Period No.</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Time Slot *</label>
                <input
                  type="text"
                  required
                  placeholder="08:30 AM - 09:15 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Class</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  {['Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  {['A','B','C','D'].map((s) => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Subject Name *</label>
              <input
                type="text"
                required
                placeholder="Mathematics, English, EVS..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assigned Teacher *</label>
              <select
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Classroom / Lab No.</label>
              <input
                type="text"
                placeholder="Room 204"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg shadow-blue-600/30"
            >
              <Clock className="w-4 h-4" />
              <span>Add to Timetable</span>
            </button>
          </div>
        </form>

        {/* Timetable View for selected Day */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Weekly Schedule ({day})
            </h3>

            <div className="flex items-center gap-1 overflow-x-auto">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDay(d as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    day === d ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {filteredSlots.length === 0 ? (
            <p className="text-slate-400 py-12 text-center text-xs italic">
              No period slots scheduled for {day}. Fill the form on left to assign daily classes.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredSlots.map((slot) => (
                <div key={slot.id} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold text-[10px] font-mono">
                        Period #{slot.period || 1} • {slot.time}
                      </span>
                      <span className="font-semibold text-slate-400">{slot.roomNo}</span>
                    </div>
                    <h4 className="font-extrabold text-white text-sm">{slot.subject}</h4>
                    <p className="text-slate-300">
                      Class {slot.className}-{slot.section} | Assigned: <strong className="text-teal-300">{slot.teacherName}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTimetableSlot(slot.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors"
                    title="Remove Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
