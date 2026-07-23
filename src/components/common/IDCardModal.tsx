'use client';

import React from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Printer, QrCode, GraduationCap } from 'lucide-react';
import { Student } from '../../types';

export const IDCardModal: React.FC = () => {
  const { modalData, setActiveModal } = useERP();
  const student: Student = modalData;

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 text-slate-100 space-y-6 print:shadow-none print:border-none print:w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            Official Student ID Card Generator
          </h3>
          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Physical ID Card */}
        <div className="w-full max-w-sm mx-auto rounded-3xl bg-slate-900 border-2 border-blue-500/50 p-6 text-white shadow-2xl space-y-4 relative overflow-hidden print:border-slate-400 print:text-black">
          {/* School Header & Logo */}
          <div className="text-center space-y-1 pb-3 border-b border-blue-500/30">
            <div className="bg-white p-1.5 rounded-xl max-w-[200px] mx-auto mb-1">
              <img
                src="/logo.jpg"
                alt="KIDZ R KIDZ Pre School"
                className="w-full h-auto object-contain max-h-12"
              />
            </div>
            <h2 className="font-black text-sm tracking-tight text-white uppercase">
              KIDZ R KIDZ PRE SCHOOL
            </h2>
            <p className="text-[9px] text-blue-300 font-semibold">Authorized Student Identity Pass</p>
          </div>

          {/* Student Avatar & Identity */}
          <div className="flex flex-col items-center text-center space-y-2">
            <img
              src={student.photo}
              alt={student.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-400 shadow-xl"
            />
            <div>
              <h3 className="font-extrabold text-base text-white">{student.name}</h3>
              <p className="text-xs text-blue-300 font-bold mt-0.5">
                Class {student.className}-{student.section} | Roll No. #{student.rollNo}
              </p>
            </div>
          </div>

          {/* Key Details */}
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-blue-500/20 text-[11px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Admission No:</span>
              <span className="font-mono font-bold text-white">{student.admissionNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Father's Name:</span>
              <span className="font-semibold text-white">{student.fatherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Parent Contact:</span>
              <span className="font-semibold text-white">{student.parentPhone}</span>
            </div>
          </div>

          {/* QR Code Barcode Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-900" />
            </div>

            <div className="text-right">
              <span className="text-[9px] text-slate-400 block">Principal Signature</span>
              <div className="font-serif italic text-xs text-blue-300 font-bold mt-1">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print Student ID Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
