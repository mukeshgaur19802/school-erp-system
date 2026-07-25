'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { 
  Archive, Users, Search, Calendar, UserX, Clock, ClipboardList
} from 'lucide-react';

export const ArchiveManager: React.FC = () => {
  const { deletedStudents, deletedTeachers } = useERP();
  const [activeSubTab, setActiveSubTab] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter students
  const filteredStudents = (deletedStudents || []).filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.includes(searchQuery)
  );

  // 2. Filter teachers
  const filteredTeachers = (deletedTeachers || []).filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mobile.includes(searchQuery) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Archived Records Register</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Permanently retained history of deleted student and teaching staff profiles.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={activeSubTab === 'STUDENT' ? "Search student, father, class..." : "Search teacher, role, mobile..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => { setActiveSubTab('STUDENT'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'STUDENT'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Archived Students ({(deletedStudents || []).length})</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('TEACHER'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'TEACHER'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Archived Teachers ({(deletedTeachers || []).length})</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-mono bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
          System Log: {activeSubTab === 'STUDENT' ? filteredStudents.length : filteredTeachers.length} entries
        </span>
      </div>

      {/* Directory Content */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl min-h-[300px]">
        {activeSubTab === 'STUDENT' ? (
          filteredStudents.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <UserX className="w-12 h-12 mx-auto opacity-30 text-blue-400" />
              <p className="font-extrabold text-white text-sm">No Student Archives Found</p>
              <p className="text-xs max-w-sm mx-auto text-slate-400">
                Any deleted students are securely archived here for historical lookup.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Parents Info</th>
                    <th className="py-3 px-3">Dues Clearance</th>
                    <th className="py-3 px-3">Date Archived</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-800/10 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.photo || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"}
                            alt={stu.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block">{stu.name}</span>
                            <span className="text-[10px] font-mono text-blue-400">{stu.admissionNo}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-300">
                        Class {stu.className}-{stu.section}
                      </td>
                      <td className="py-3 px-3 text-slate-350">
                        <div className="space-y-0.5">
                          <div>F: {stu.fatherName}</div>
                          <div className="text-[10px] text-slate-400">P: {stu.parentPhone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[10px]">
                          Balance Deleted (₹0)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono flex items-center gap-1.5 mt-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(stu.deletedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredTeachers.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <ClipboardList className="w-12 h-12 mx-auto opacity-30 text-blue-400" />
              <p className="font-extrabold text-white text-sm">No Teacher Archives Found</p>
              <p className="text-xs max-w-sm mx-auto text-slate-400">
                Any deleted teachers are archived here with their roles and assignment histories.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-3">Teacher Name</th>
                    <th className="py-3 px-3">Mobile</th>
                    <th className="py-3 px-3">Former Role</th>
                    <th className="py-3 px-3">Assignments At Deletion</th>
                    <th className="py-3 px-3">Date Archived</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredTeachers.map((tch) => (
                    <tr key={tch.id} className="hover:bg-slate-800/10 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={tch.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"}
                            alt={tch.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block">{tch.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{tch.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-300 font-mono">
                        {tch.mobile}
                      </td>
                      <td className="py-3 px-3 text-slate-350">
                        {tch.role}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {tch.assignments.map((a, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-[9px] text-slate-400">
                              {a.className}-{a.section}: {a.subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono flex items-center gap-1.5 mt-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(tch.deletedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};
