'use client';

import React, { useEffect, useState } from 'react';
import { useERP, getLocalDateString } from '../../context/ERPContext';
import { BookOpen, Upload, Send, CheckCircle2, Paperclip, Clock, Filter, Calendar } from 'lucide-react';

export const HomeworkManager: React.FC = () => {
  const { homework, addHomework, classwork, addClasswork, currentTeacher } = useERP();

  const [workType, setWorkType] = useState<'HOMEWORK' | 'CLASSWORK'>('HOMEWORK');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(() => currentTeacher?.assignments[0]?.subject || 'Mathematics');
  const [className, setClassName] = useState(() => currentTeacher?.assignments[0]?.className || 'Class 5');
  const [section, setSection] = useState(() => currentTeacher?.assignments[0]?.section || 'A');
  const [workDate, setWorkDate] = useState(() => getLocalDateString());
  const [dueDate, setDueDate] = useState(() => getLocalDateString());
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const teacherAssignments = currentTeacher?.assignments ?? [];
  const classOptions = Array.from(new Set([
    ...teacherAssignments.map((assignment) => assignment.className).filter(Boolean),
    'Play Group',
    'Nursery',
    'LKG',
    'UKG',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
  ]));
  const sectionOptions = Array.from(new Set([
    ...teacherAssignments.map((assignment) => assignment.section).filter(Boolean),
    'A',
    'B',
    'C',
    'D',
  ]));

  useEffect(() => {
    if (!teacherAssignments.length) {
      return;
    }

    const firstAssignment = teacherAssignments[0];
    setSubject(firstAssignment.subject || 'Mathematics');
    setClassName(firstAssignment.className || 'Class 5');
    setSection(firstAssignment.section || 'A');
  }, [teacherAssignments]);

  // Feed filters
  const [selectedFeedDate, setSelectedFeedDate] = useState(() => getLocalDateString());
  const [showAllDates, setShowAllDates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const teacherName = currentTeacher?.name || 'Mrs. Sharma';

    if (workType === 'HOMEWORK') {
      addHomework({
        title,
        subject,
        className,
        section,
        teacherName,
        dueDate,
        description,
        attachmentName,
        attachmentUrl: attachmentUrl || '#',
        assignedDate: workDate,
      });
    } else {
      addClasswork({
        title,
        subject,
        className,
        section,
        teacherName,
        topicsCovered: title, // Use title or first few lines as topics
        description,
        attachmentName,
        attachmentUrl: attachmentUrl || '#',
        date: workDate,
      });
    }

    setTitle('');
    setDescription('');
    setAttachmentName('');
    setAttachmentUrl('');
  };

  // Combine feed
  const combinedFeed = [
    ...homework.map(h => ({ ...h, type: 'HOMEWORK' as const, dateValue: h.assignedDate })),
    ...classwork.map(c => ({ ...c, type: 'CLASSWORK' as const, dateValue: c.date, dueDate: '' }))
  ];

  // Sort: assigned date descending
  combinedFeed.sort((a, b) => b.dateValue.localeCompare(a.dateValue));

  // Filter by date if showAllDates is false
  const filteredFeed = showAllDates 
    ? combinedFeed 
    : combinedFeed.filter(item => item.dateValue === selectedFeedDate);

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
            Work & Lessons Publishing Hub
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Upload Daily Classwork & Homework
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish daily classwork updates or assign homework worksheets. Parents are notified instantly in real time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Publish Work
            </h3>
            
            {/* Work Type Toggle */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setWorkType('HOMEWORK')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${workType === 'HOMEWORK' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Homework
              </button>
              <button
                type="button"
                onClick={() => setWorkType('CLASSWORK')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${workType === 'CLASSWORK' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Classwork
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                {workType === 'HOMEWORK' ? 'Homework Title *' : 'Classwork Topic *'}
              </label>
              <input
                type="text"
                required
                placeholder={workType === 'HOMEWORK' ? "e.g. Exercise 4.2 Question 1-10" : "e.g. Intro to Algebra Fractions"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Class</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-sans font-bold"
                >
                  {classOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-sans font-bold"
                >
                  {sectionOptions.map((s) => (
                    <option key={s} value={s}>Sec {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {workType === 'HOMEWORK' && (
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Due Submission *</label>
                  <input
                    type="date"
                    required={workType === 'HOMEWORK'}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                {workType === 'HOMEWORK' ? 'Detailed Instructions *' : 'Description / Topics Covered *'}
              </label>
              <textarea
                rows={4}
                required
                placeholder={workType === 'HOMEWORK' ? "Write specific exercise questions and submission instructions..." : "Write textbook pages, key concepts taught, or summary notes..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Attach Notes / Worksheet</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAttachmentName(file.name);
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setAttachmentUrl(event.target.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 file:cursor-pointer"
                />
                {attachmentName && (
                  <div className="text-[10px] text-cyan-300 font-bold bg-slate-800 p-2 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{attachmentName}</span>
                    <button 
                      type="button" 
                      onClick={() => { setAttachmentName(''); setAttachmentUrl(''); }}
                      className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{workType === 'HOMEWORK' ? 'Post Homework & Notify' : 'Post Classwork & Notify'}</span>
            </button>
          </div>
        </form>

        {/* Unified Work Feed */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Classroom Feed (Daily Lesson Log)
            </h3>

            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs">
              <label className="text-slate-400 font-semibold px-1.5 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Date:
              </label>
              <input
                type="date"
                disabled={showAllDates}
                value={selectedFeedDate}
                onChange={(e) => setSelectedFeedDate(e.target.value)}
                className="bg-slate-900 text-white px-2 py-0.5 rounded-lg border border-slate-700 disabled:opacity-50 font-mono text-[11px] focus:outline-none"
              />
              
              <label className="flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAllDates}
                  onChange={(e) => setShowAllDates(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Show All</span>
              </label>
            </div>
          </div>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {filteredFeed.length === 0 ? (
              <p className="text-slate-400 text-xs italic text-center py-12">
                No classwork or homework posted for {showAllDates ? 'any date' : selectedFeedDate}.
              </p>
            ) : (
              filteredFeed.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        item.type === 'HOMEWORK'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-900/50 text-slate-300 border border-slate-800">
                        Class {item.className}-{item.section}
                      </span>
                      <span className="text-xs font-bold text-white">{item.subject}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" /> {item.dateValue}
                      {item.type === 'HOMEWORK' && (
                        <span className="text-amber-400 ml-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due: {item.dueDate}
                        </span>
                      )}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{item.description}</p>

                  {item.attachmentUrl && (item.attachmentUrl.startsWith('data:image/') || item.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)/i)) ? (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 max-w-xs shadow-md bg-slate-950">
                      <img src={item.attachmentUrl} alt="Attached Worksheet" className="w-full h-auto max-h-48 object-cover" />
                      {item.attachmentName && (
                        <div className="p-2 bg-slate-900 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
                          <span className="truncate max-w-[150px]">{item.attachmentName}</span>
                          <a href={item.attachmentUrl} download={item.attachmentName} className="text-cyan-400 font-bold hover:underline shrink-0">Download</a>
                        </div>
                      )}
                    </div>
                  ) : (
                    item.attachmentName && (
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 inline-flex items-center gap-2 text-xs text-cyan-300">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{item.attachmentName}</span>
                        {item.attachmentUrl && item.attachmentUrl !== '#' && (
                          <a href={item.attachmentUrl} download={item.attachmentName} className="ml-2 text-cyan-400 font-bold hover:underline">Download</a>
                        )}
                      </div>
                    )
                  )}

                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-700/40 flex items-center justify-between">
                    <span>Uploaded by: {item.teacherName}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sent to Parents App
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
