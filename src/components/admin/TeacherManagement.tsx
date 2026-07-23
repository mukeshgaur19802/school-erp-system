'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Users, UserPlus, Phone, Mail, BookOpen, Search, Upload, Eye, Plus, Trash2 } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

export const TeacherManagement: React.FC = () => {
  const { teachers, addTeacher, setActiveModal, setModalData } = useERP();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<'Principal' | 'Vice Principal' | 'Class Teacher' | 'Subject Teacher'>('Class Teacher');

  // Dynamic Multiple Assignments Array
  const [assignments, setAssignments] = useState<
    { className: string; section: string; subject: string; isClassTeacher?: boolean }[]
  >([
    { className: 'Class 8', section: 'A', subject: 'Mathematics', isClassTeacher: true },
  ]);

  // Drag & Drop Photo Upload
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80');
  const [isDragging, setIsDragging] = useState(false);

  const handleAvatarFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const compressed = await compressImage(file, 300, 0.7);
    setAvatar(compressed);
  };

  const addAssignmentRow = () => {
    setAssignments((prev) => [
      ...prev,
      { className: 'Class 7', section: 'B', subject: 'Science', isClassTeacher: false },
    ]);
  };

  const removeAssignmentRow = (index: number) => {
    if (assignments.length <= 1) return;
    setAssignments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAssignmentRow = (index: number, field: string, value: any) => {
    setAssignments((prev) =>
      prev.map((asgn, i) => (i === index ? { ...asgn, [field]: value } : asgn))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;

    addTeacher({
      name,
      mobile,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@kidzrkidz.edu`,
      password,
      role,
      avatar,
      assignments,
    });

    setName('');
    setMobile('');
    setEmail('');
    setPassword('123456');
    setAssignments([{ className: 'Class 8', section: 'A', subject: 'Mathematics', isClassTeacher: true }]);
    setShowAddForm(false);
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mobile.includes(searchQuery) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30">
            Faculty Directory & Role Assignment
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Teacher Management & Unlimited Onboarding
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create teacher accounts using mobile numbers and assign multiple Class & Subject responsibilities.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Create Teacher Account'}</span>
        </button>
      </div>

      {/* Add Teacher Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900 border border-teal-500/30 shadow-2xl space-y-4 animate-slide-in text-xs">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-400" />
            New Faculty Onboarding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Teacher Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mrs. Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mobile Number (Login ID) *</label>
              <input
                type="text"
                required
                placeholder="0000000000 or Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Login Password *</label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Institutional Email</label>
              <input
                type="email"
                placeholder="sharma@kidzrkidz.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Role Title</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option value="Principal">Principal</option>
                <option value="Vice Principal">Vice Principal</option>
                <option value="Class Teacher">Class Teacher</option>
                <option value="Subject Teacher">Subject Teacher</option>
              </select>
            </div>
          </div>

          {/* Dynamic Multiple Class & Subject Assignments */}
          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">
                Class & Subject Teaching Responsibilities ({assignments.length})
              </span>
              <button
                type="button"
                onClick={addAssignmentRow}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Class Subject</span>
              </button>
            </div>

            {assignments.map((asgn, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Class</label>
                  <select
                    value={asgn.className}
                    onChange={(e) => updateAssignmentRow(idx, 'className', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    {['Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Section</label>
                  <select
                    value={asgn.section}
                    onChange={(e) => updateAssignmentRow(idx, 'section', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    {['A','B','C','D'].map((s) => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Subject</label>
                  <input
                    type="text"
                    value={asgn.subject}
                    onChange={(e) => updateAssignmentRow(idx, 'subject', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 sm:pt-0">
                  <label className="flex items-center gap-1.5 text-[11px] text-teal-300 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asgn.isClassTeacher || false}
                      onChange={(e) => updateAssignmentRow(idx, 'isClassTeacher', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-teal-500"
                    />
                    Class Teacher
                  </label>

                  {assignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAssignmentRow(idx)}
                      className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 hover:text-white"
                      title="Remove Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Drag & Drop Photo Upload */}
          <div className="space-y-1.5 pt-2">
            <label className="block font-semibold text-slate-300">Teacher Photo Avatar (Drag & Drop or Hardware Browse)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) handleAvatarFile(e.dataTransfer.files[0]);
              }}
              className={`p-3 rounded-2xl border-2 border-dashed flex items-center gap-4 bg-slate-800/60 ${
                isDragging ? 'border-teal-500 bg-teal-950/30' : 'border-slate-700'
              }`}
            >
              <img src={avatar} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
              <div className="flex-1 space-y-1">
                <span className="text-[11px] text-slate-300 font-medium">Drag & drop photo here or </span>
                <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 text-white text-[11px] font-bold cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Browse File</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleAvatarFile(e.target.files[0]); }} />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-lg shadow-teal-600/30"
            >
              Create Teacher & Assign Responsibilities
            </button>
          </div>
        </form>
      )}

      {/* Faculty Cards Grid */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-base text-white">Active Teaching Faculty ({teachers.length})</h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search teacher or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 w-full sm:w-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition-all space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-600 shadow-md shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {t.role}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1 group-hover:text-teal-300 transition-colors">
                      {t.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <Phone className="w-3 h-3 text-teal-400" />
                      <span>{t.mobile}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setModalData(t);
                    setActiveModal('INSPECT_TEACHER');
                  }}
                  className="p-2 rounded-xl bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-white transition-colors"
                  title="Inspect Today's Work & Schedule"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Assignments */}
              <div className="pt-3 border-t border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Assigned Classes & Subjects ({t.assignments.length}):
                  </span>
                  <button
                    onClick={() => {
                      setModalData(t);
                      setActiveModal('EDIT_TEACHER');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-white text-[10px] font-bold border border-teal-500/30 transition-colors"
                  >
                    Edit / Password
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.assignments.map((asgn, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-medium flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3 text-indigo-400" />
                      {asgn.className}-{asgn.section}: {asgn.subject} {asgn.isClassTeacher ? '(CT)' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
