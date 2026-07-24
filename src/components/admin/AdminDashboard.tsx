'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Users,
  GraduationCap,
  IndianRupee,
  Clock,
  UserPlus,
  BellRing,
  Bus,
  Search,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { StudentAdmissionModal } from './StudentAdmissionModal';

export const AdminDashboard: React.FC = () => {
  const { 
    students, 
    teachers, 
    setActiveTab, 
    setActiveModal, 
    setModalData,
    cloudSyncStatus,
    cloudErrorMsg,
    resetAllData
  } = useERP();
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showReceivedFeesModal, setShowReceivedFeesModal] = useState(false);
  const [showPendingDuesModal, setShowPendingDuesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardListMode, setDashboardListMode] = useState<'STUDENTS' | 'TEACHERS'>('STUDENTS');

  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;

  const totalCollectedFees = students.reduce((acc, s) => acc + s.fees.paidAmount, 0);
  const totalPendingFees = students.reduce((acc, s) => acc + s.fees.pendingAmount, 0);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const classCompare = a.className.localeCompare(b.className, undefined, { numeric: true });
    if (classCompare !== 0) return classCompare;
    const sectionCompare = a.section.localeCompare(b.section);
    if (sectionCompare !== 0) return sectionCompare;
    return a.rollNo - b.rollNo;
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mobile.includes(searchQuery) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignments.some(
        (a) =>
          a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.className.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-2xl border border-blue-500/30 shrink-0">
            <img
              src="/logo.jpg"
              alt="KIDZ R KIDZ"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              KIDZ R KIDZ Admin Command Center
            </h1>
            <p className="text-xs text-blue-300 font-semibold mt-0.5">
              Manage student admissions, faculty accounts, fee ledgers, and parent alerts.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${
                cloudSyncStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' :
                cloudSyncStatus === 'SYNCING' ? 'bg-amber-400 animate-pulse' :
                cloudSyncStatus === 'ERROR' ? 'bg-rose-500' : 'bg-slate-500'
              }`} />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {cloudSyncStatus === 'CONNECTED' && 'Cloud Sync Active'}
                {cloudSyncStatus === 'SYNCING' && 'Syncing with Cloud...'}
                {cloudSyncStatus === 'ERROR' && `Sync Offline (${cloudErrorMsg})`}
                {cloudSyncStatus === 'LOCAL_ONLY' && 'Local Mode (Cloud Offline)'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAdmissionModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Student Admission</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Create Teacher</span>
          </button>

        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Admissions */}
        <div 
          onClick={() => {
            setDashboardListMode('STUDENTS');
            setSearchQuery('');
          }}
          className={`p-5 rounded-2xl border shadow-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
            dashboardListMode === 'STUDENTS'
              ? 'border-blue-500/60 bg-blue-950/20 shadow-blue-950/20'
              : 'border-slate-800 bg-slate-900 hover:border-blue-500/40 hover:bg-slate-850/60'
          }`}
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Admissions</span>
            <h2 className="text-2xl font-black text-white mt-1">{totalStudentsCount}</h2>
            <span className="text-[11px] text-blue-400 font-medium">Fresh Register</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Total Teachers */}
        <div 
          onClick={() => {
            setDashboardListMode('TEACHERS');
            setSearchQuery('');
          }}
          className={`p-5 rounded-2xl border shadow-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
            dashboardListMode === 'TEACHERS'
              ? 'border-teal-500/60 bg-teal-950/20 shadow-teal-950/20'
              : 'border-slate-800 bg-slate-900 hover:border-teal-500/40 hover:bg-slate-850/60'
          }`}
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Teaching Staff</span>
            <h2 className="text-2xl font-black text-white mt-1">{totalTeachersCount}</h2>
            <span className="text-[11px] text-teal-400 font-medium">Faculty Registered</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Fee Collection */}
        <div 
          onClick={() => setShowReceivedFeesModal(true)}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between cursor-pointer hover:border-emerald-500/50 hover:bg-slate-850/60 transition-all duration-200"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Collected Fee</span>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">₹{totalCollectedFees.toLocaleString('en-IN')}</h2>
            <span className="text-[11px] text-emerald-400 font-medium hover:underline">View Transactions Ledger →</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Fee */}
        <div 
          onClick={() => setShowPendingDuesModal(true)}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between cursor-pointer hover:border-amber-500/50 hover:bg-slate-850/60 transition-all duration-200"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Pending Dues</span>
            <h2 className="text-2xl font-black text-amber-300 mt-1">₹{totalPendingFees.toLocaleString('en-IN')}</h2>
            <span className="text-[11px] text-amber-400 font-medium hover:underline">View Defaulters List →</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section: Student Register & Feature Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student or Teacher Register */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white">
                {dashboardListMode === 'STUDENTS' ? 'Student Directory & Admissions Register' : 'Teaching Staff Directory'}
              </h3>
              <p className="text-xs text-slate-400">
                {dashboardListMode === 'STUDENTS'
                  ? 'Full profile records including Father & Mother names, photos and fee status'
                  : 'Full teaching faculty records with mobile logins, subjects and class responsibilities'}
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={dashboardListMode === 'STUDENTS' ? 'Search student or father...' : 'Search teacher, class, or subject...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border text-xs text-white placeholder-slate-400 focus:outline-none w-full sm:w-56 transition-colors ${
                  dashboardListMode === 'STUDENTS' ? 'border-slate-700 focus:border-blue-500' : 'border-slate-700 focus:border-teal-500'
                }`}
              />
            </div>
          </div>

          {dashboardListMode === 'STUDENTS' ? (
            sortedStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">No matching student admission records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto animate-fade-in">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-400 font-bold">
                      <th className="py-3 px-3">Adm No / Student</th>
                      <th className="py-3 px-3">Class</th>
                      <th className="py-3 px-3">Roll No</th>
                      <th className="py-3 px-3">Total Fee</th>
                      <th className="py-3 px-3">Pending Due</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {sortedStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={stu.photo}
                              alt={stu.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
                            />
                            <div>
                            <div 
                              onClick={() => {
                                setModalData(stu);
                                setActiveModal('EDIT_STUDENT');
                              }}
                              className="cursor-pointer group text-left"
                              title="Click to view full student details"
                            >
                              <span className="font-bold text-white block group-hover:underline group-hover:text-blue-400 transition-colors">{stu.name}</span>
                              <span className="text-[10px] font-mono text-blue-400">{stu.admissionNo}</span>
                            </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-300">
                          Class {stu.className}-{stu.section}
                        </td>
                        <td className="py-3 px-3 text-slate-300">#{stu.rollNo}</td>
                        <td className="py-3 px-3 font-semibold text-white">
                          ₹{stu.fees.totalFee.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          {stu.fees.pendingAmount > 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              ₹{stu.fees.pendingAmount.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              Clear
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setModalData(stu);
                                setActiveModal('EDIT_STUDENT');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[11px] font-bold border border-amber-500/30 transition-colors"
                              title="View & Edit Full Student Profile"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setModalData(stu);
                                setActiveModal('ID_CARD');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 text-[11px] font-semibold border border-blue-500/40 transition-colors"
                            >
                              ID Card
                            </button>
                            <button
                              onClick={() => {
                                setModalData(stu);
                                setActiveModal('REPORT_CARD');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-600/30 hover:bg-teal-600 text-teal-200 text-[11px] font-semibold border border-teal-500/40 transition-colors"
                            >
                              Report
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            filteredTeachers.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">No matching teacher records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto animate-fade-in font-sans">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-400 font-bold">
                      <th className="py-3 px-3">Teacher</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Class & Subjects</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {filteredTeachers.map((tch) => (
                      <tr key={tch.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={tch.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"}
                              alt={tch.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
                            />
                            <div>
                            <div 
                              onClick={() => {
                                setModalData(tch);
                                setActiveModal('INSPECT_TEACHER');
                              }}
                              className="cursor-pointer group text-left"
                              title="Click to view teacher assignments & profile"
                            >
                              <span className="font-bold text-white block group-hover:underline group-hover:text-teal-400 transition-colors">{tch.name}</span>
                              <span className="text-[10px] font-mono text-teal-400">{tch.mobile}</span>
                            </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-350">
                          {tch.role}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {tch.assignments.map((asgn, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700/80 text-[10px] text-teal-300 font-semibold"
                              >
                                {asgn.className}-{asgn.section}: {asgn.subject}{asgn.isClassTeacher && ' (Class Teacher 🏆)'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setModalData(tch);
                                setActiveModal('EDIT_TEACHER');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white text-[11px] font-bold border border-teal-500/30 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setModalData(tch);
                                setActiveModal('INSPECT_TEACHER');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* Right Column: Shortcuts */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-bold text-base text-white">Administration Modules</h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('teachers')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-teal-400" />
                  <div>
                    <h4 className="font-semibold text-white">Teacher Roles & Assignments</h4>
                    <p className="text-[10px] text-slate-400">Principal, Class & Subject Teachers</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-4 h-4 text-amber-400" />
                  <div>
                    <h4 className="font-semibold text-white">Fee Management & Defaulters</h4>
                    <p className="text-[10px] text-slate-400">Admission, Tuition, Transport & Books</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <BellRing className="w-4 h-4 text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-white">Broadcast Notifications</h4>
                    <p className="text-[10px] text-slate-400">To Students, Teachers & Parents</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('transport')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <Bus className="w-4 h-4 text-indigo-400" />
                  <div>
                    <h4 className="font-semibold text-white">Transport Operations</h4>
                    <p className="text-[10px] text-slate-400">Bus routes, stops & timings</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  <div>
                    <h4 className="font-semibold text-white">Reports & Analytics</h4>
                    <p className="text-[10px] text-slate-400">Academic & fee summaries</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Student Admission Modal */}
      {showAdmissionModal && (
        <StudentAdmissionModal onClose={() => setShowAdmissionModal(false)} />
      )}

      {/* Received Fees Ledger Modal */}
      {showReceivedFeesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-slate-100 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div>
                <h3 className="text-lg font-black text-white">Received Fees Transactions Ledger</h3>
                <p className="text-xs text-slate-400">List of all fee receipt payments collected from parents</p>
              </div>
              <button 
                onClick={() => setShowReceivedFeesModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold font-mono"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              {(() => {
                // Collect payments
                const payments = students.flatMap(s => 
                  (s.paymentHistory || []).map(p => ({
                    ...p,
                    studentName: s.name,
                    admissionNo: s.admissionNo,
                    className: s.className,
                    section: s.section
                  }))
                ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                if (payments.length === 0) {
                  return (
                    <p className="text-slate-400 italic text-center py-10 text-xs">No fee payments have been received or logged yet.</p>
                  );
                }
                
                return (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400 font-bold">
                        <th className="py-2.5 px-2">Date</th>
                        <th className="py-2.5 px-2">Student</th>
                        <th className="py-2.5 px-2">Receipt No</th>
                        <th className="py-2.5 px-2">Method</th>
                        <th className="py-2.5 px-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {payments.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2 px-2 text-slate-400 font-mono">{p.date}</td>
                          <td className="py-2 px-2">
                            <div className="font-bold text-white">{p.studentName}</div>
                            <div className="text-[10px] text-slate-400">Class {p.className}-{p.section}</div>
                          </td>
                          <td className="py-2 px-2 font-mono text-[10px] text-blue-400">{p.receiptNo}</td>
                          <td className="py-2 px-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {p.method}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-emerald-400">₹{p.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
            
            <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button 
                onClick={() => setShowReceivedFeesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Dues Defaulters Modal */}
      {showPendingDuesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-slate-100 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div>
                <h3 className="text-lg font-black text-white">Pending Fee Dues & Defaulters</h3>
                <p className="text-xs text-slate-400">List of students with unpaid fees balance</p>
              </div>
              <button 
                onClick={() => setShowPendingDuesModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold font-mono"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              {(() => {
                const defaulters = students
                  .filter(s => s.fees.pendingAmount > 0)
                  .sort((a, b) => b.fees.pendingAmount - a.fees.pendingAmount);
                
                if (defaulters.length === 0) {
                  return (
                    <p className="text-slate-400 italic text-center py-10 text-xs">Congratulations! All student accounts have zero pending dues.</p>
                  );
                }
                
                return (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400 font-bold">
                        <th className="py-2.5 px-2">Student Name</th>
                        <th className="py-2.5 px-2">Class</th>
                        <th className="py-2.5 px-2">Parent Phone</th>
                        <th className="py-2.5 px-2 text-right">Pending Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {defaulters.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/30">
                          <td className="py-2 px-2">
                            <div className="font-bold text-white">{s.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{s.admissionNo}</div>
                          </td>
                          <td className="py-2 px-2 text-slate-350">Class {s.className}-{s.section}</td>
                          <td className="py-2 px-2 font-mono text-[10px] text-slate-400">{s.parentPhone}</td>
                          <td className="py-2 px-2 text-right font-bold text-amber-400 font-mono">₹{s.fees.pendingAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
            
            <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button 
                onClick={() => setShowPendingDuesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
