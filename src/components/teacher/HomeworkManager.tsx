'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { BookOpen, Upload, FileText, Send, CheckCircle2, Paperclip, Clock } from 'lucide-react';

export const HomeworkManager: React.FC = () => {
  const { homework, addHomework, currentTeacher } = useERP();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(currentTeacher?.assignments[0]?.subject || 'Mathematics');
  const [className, setClassName] = useState(currentTeacher?.assignments[0]?.className || '5');
  const [section, setSection] = useState(currentTeacher?.assignments[0]?.section || 'A');
  const [dueDate, setDueDate] = useState('2026-07-22');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('Exercise_Worksheet.pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addHomework({
      title,
      subject,
      className,
      section,
      teacherName: currentTeacher?.name || 'Mrs. Sharma',
      dueDate,
      description,
      attachmentName,
      attachmentUrl: '#',
    });

    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
            Homework & Notes Publishing Hub
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Upload Daily Classwork & Homework (Step 4)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Assignments uploaded here automatically dispatch real-time push notification alerts to parents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            Assign Homework Task
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Homework Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Exercise 4.2 Question 1-10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Class</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  {['Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((c) => (
                    <option key={c} value={c}>{c.startsWith('Class') ? c : `Class ${c}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  {['A','B','C','D'].map((s) => (
                    <option key={s} value={s}>Sec {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Due Submission Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Detailed Instructions *</label>
              <textarea
                rows={4}
                required
                placeholder="Write specific exercise questions and submission instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Attach Notes / PDF / Image Worksheet</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Post Homework & Alert Parents</span>
            </button>
          </div>
        </form>

        {/* Existing Homework List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Classroom Homework Feed
          </h3>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {homework.map((hw) => (
              <div
                key={hw.id}
                className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Class {hw.className}-{hw.section}
                    </span>
                    <span className="text-xs font-bold text-white">{hw.subject}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> Due: {hw.dueDate}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{hw.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{hw.description}</p>

                {hw.attachmentName && (
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 inline-flex items-center gap-2 text-xs text-cyan-300">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{hw.attachmentName}</span>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-700/40 flex items-center justify-between">
                  <span>Assigned by: {hw.teacherName} ({hw.assignedDate})</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Sent to Parents App
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
