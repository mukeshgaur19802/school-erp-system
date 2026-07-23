'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ChevronLeft, ChevronRight, Plus, PartyPopper, Trash2, Calendar as CalendarIcon, X } from 'lucide-react';

export const SchoolCalendar: React.FC = () => {
  const { activeRole, calendarEvents, addCalendarEvent, deleteCalendarEvent } = useERP();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Celebration' | 'Holiday' | 'Exam' | 'Event'>('Celebration');
  const [description, setDescription] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCellClick = (dayNum: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(dayNum).padStart(2, '0');
    const fullDate = `${year}-${monthStr}-${dayStr}`;
    setSelectedDateStr(fullDate);
    if (activeRole === 'ADMIN') {
      setShowModal(true);
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedDateStr) return;

    addCalendarEvent({
      title,
      date: selectedDateStr,
      category,
      description: description || `School ${category} scheduled for ${selectedDateStr}.`,
      targetAudience: 'Everyone',
    });

    setTitle('');
    setDescription('');
    setShowModal(false);
  };

  // Helper to get events for a given YYYY-MM-DD
  const getEventsForDate = (dayNum: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(dayNum).padStart(2, '0');
    const fullDate = `${year}-${monthStr}-${dayStr}`;
    return calendarEvents.filter((ev) => ev.date === fullDate);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <PartyPopper className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              Google Calendar Style
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">
              Annual Celebration & School Calendar
            </h1>
            <p className="text-xs text-slate-400">
              {activeRole === 'ADMIN' ? 'Click any date cell on the grid below to schedule celebrations, events & holidays.' : 'View annual school celebrations, exams, and official holidays datewise.'}
            </p>
          </div>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700/60 shrink-0">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-white px-3 min-w-[130px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Google Calendar Month Grid */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-2 border-b border-slate-800">
          <div className="text-rose-400">Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div className="text-teal-400">Sat</div>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1 text-xs">
          {/* Empty leading padding slots */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] p-2 rounded-xl bg-slate-950/30 border border-slate-900/50 opacity-40" />
          ))}

          {/* Date Cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = getEventsForDate(dayNum);
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === dayNum;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => handleCellClick(dayNum)}
                className={`min-h-[95px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isToday
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-black text-xs px-2 py-0.5 rounded-md ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-300'
                  }`}>
                    {dayNum}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                {/* Event Badges */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[60px]">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate flex items-center justify-between gap-1 ${
                        ev.category === 'Celebration'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : ev.category === 'Holiday'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                      title={`${ev.title}: ${ev.description}`}
                    >
                      <span className="truncate">{ev.title}</span>
                      {activeRole === 'ADMIN' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCalendarEvent(ev.id);
                          }}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Cell Click Event Modal (Admin Only) */}
      {showModal && activeRole === 'ADMIN' && selectedDateStr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in font-sans">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl max-w-md w-full p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">Add Event for {selectedDateStr}</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event / Celebration Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Making Activity / Annual Day"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="Celebration">Celebration (Festival / Activity)</option>
                  <option value="Event">School Event (Sports / Annual Day)</option>
                  <option value="Holiday">School Holiday</option>
                  <option value="Exam">Exam Schedule</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Details for teachers and parents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-lg"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
