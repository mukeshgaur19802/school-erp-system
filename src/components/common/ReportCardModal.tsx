'use client';

import React from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Printer, Award } from 'lucide-react';
import { Student } from '../../types';

export const ReportCardModal: React.FC = () => {
  const { modalData, examMarks, setActiveModal } = useERP();
  const student: Student = modalData;

  if (!student) return null;

  const studentMarks = examMarks.filter((m) => m.studentId === student.id);

  const totalScore = studentMarks.reduce((acc, m) => acc + m.marksObtained, 0);
  const totalMax = studentMarks.reduce((acc, m) => acc + m.maxMarks, 0);
  const aggregatePercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 95;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Academic Progress Evaluation Report Card
          </h3>
          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Report Sheet */}
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 text-slate-100 print:bg-white print:text-slate-900 print:border-slate-300">
          {/* Header */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-800 print:border-slate-300">
            <div className="bg-white p-2 rounded-2xl max-w-[240px] mx-auto">
              <img
                src="/logo.jpg"
                alt="KIDZ R KIDZ Pre School"
                className="w-full h-auto object-contain max-h-16"
              />
            </div>
            <h1 className="font-black text-2xl tracking-tight text-white uppercase print:text-slate-900">
              KIDZ R KIDZ PRE SCHOOL
            </h1>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest print:text-blue-700">
              Academic Progress Evaluation Sheet (2025-2026)
            </p>
          </div>

          {/* Student Profile Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px]">Student Name:</span>
              <span className="font-bold text-white print:text-slate-900">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Father's Name:</span>
              <span className="font-bold text-white print:text-slate-900">{student.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Class & Section:</span>
              <span className="font-bold text-white print:text-slate-900">Class {student.className}-{student.section}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Admission No:</span>
              <span className="font-bold text-white print:text-slate-900">{student.admissionNo}</span>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider print:border-slate-300">
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Evaluation Term</th>
                  <th className="py-2.5 px-3">Marks Obtained</th>
                  <th className="py-2.5 px-3">Max Marks</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                {studentMarks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                      No exam marks recorded yet. Marks entered by teachers will appear here.
                    </td>
                  </tr>
                ) : (
                  studentMarks.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 px-3 font-bold text-white print:text-slate-900">{m.subject}</td>
                      <td className="py-3 px-3 text-slate-300 print:text-slate-700">{m.examName}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-400 print:text-emerald-700">{m.marksObtained}</td>
                      <td className="py-3 px-3 text-slate-300 print:text-slate-700">{m.maxMarks}</td>
                      <td className="py-3 px-3 font-extrabold text-amber-300 print:text-amber-700">Grade {m.grade}</td>
                      <td className="py-3 px-3 text-slate-300 italic text-[11px] print:text-slate-700">"{m.remarks}"</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Overall Performance Box */}
          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:bg-blue-50 print:border-blue-200">
            <div>
              <span className="text-blue-300 font-semibold block print:text-blue-800">Overall Assessment Score</span>
              <div className="text-2xl font-black text-white print:text-blue-950">{aggregatePercent}%</div>
            </div>
            <div>
              <span className="text-blue-300 font-semibold block print:text-blue-800">Result Standing</span>
              <div className="text-lg font-bold text-emerald-400 print:text-emerald-700">EXCELLENT PERFORMANCE (A+)</div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800 print:border-slate-300 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Class Teacher Signature:</span>
              <div className="font-serif italic text-sm text-blue-300 font-bold mt-2 print:text-slate-900">
                Class Incharge
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Principal Signature & Seal:</span>
              <div className="font-serif italic text-sm text-blue-300 font-bold mt-2 print:text-slate-900">
                Director / Principal
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print Progress Report Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
