'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Save, Users, KeyRound, CheckCircle2, Plus, Trash2, Upload } from 'lucide-react';
import { Teacher } from '../../types';
import { compressImage } from '../../utils/imageCompressor';

export const EditTeacherModal: React.FC = () => {
  const { modalData, editTeacher, resetTeacherPassword, setActiveModal } = useERP();
  const teacher: Teacher = modalData;

  if (!teacher) return null;

  const [name, setName] = useState(teacher.name);
  const [mobile, setMobile] = useState(teacher.mobile);
  const [email, setEmail] = useState(teacher.email);
  const [role, setRole] = useState(teacher.role);
  const [avatar, setAvatar] = useState(teacher.avatar || '');

  const [assignments, setAssignments] = useState<
    { className: string; section: string; subject: string; isClassTeacher?: boolean }[]
  >(
    teacher.assignments.length > 0
      ? teacher.assignments
      : [{ className: 'Class 8', section: 'A', subject: 'Mathematics', isClassTeacher: true }]
  );

  const [newPassword, setNewPassword] = useState('');

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    editTeacher(teacher.id, {
      name,
      mobile,
      email,
      role,
      avatar,
      assignments,
    });

    if (newPassword.trim()) {
      resetTeacherPassword(teacher.id, newPassword.trim());
    }

    setActiveModal('NONE');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={avatar || teacher.avatar} alt={name} className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500 shadow-md shrink-0" />
            <div>
              <h2 className="text-lg font-black text-white">Edit Teacher Account & Responsibilities</h2>
              <p className="text-xs text-teal-300">ID: {teacher.id} | Mobile Login: {teacher.mobile}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('NONE')}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Teacher Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mobile Number (Login ID) *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
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

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Dynamic Multiple Class & Subject Assignments */}
          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">
                Class & Subject Responsibilities ({assignments.length})
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

          {/* Photo Update */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="font-bold text-slate-300 text-[11px] block">Update Photo Avatar (Canvas Compression)</span>
            <div className="flex items-center gap-3">
              <img src={avatar || teacher.avatar} alt="Preview" className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
              <label className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Upload New Avatar</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleAvatarFile(e.target.files[0]); }} />
              </label>
            </div>
          </div>

          {/* Admin Password Reset Box */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px]">
              <KeyRound className="w-3.5 h-3.5" />
              Reset Teacher Login Password
            </span>
            <input
              type="text"
              placeholder="Enter new password (leave empty to keep current)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
            <p className="text-[10px] text-slate-400">Current Password: <span className="font-mono text-white font-bold">{teacher.password || 'teach#321'}</span></p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal('NONE')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-lg shadow-teal-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Teacher Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
