'use client';

import React from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Printer, Receipt, CheckCircle2 } from 'lucide-react';
import { Student, FeePaymentRecord } from '../../types';

export const FeeReceiptModal: React.FC = () => {
  const { modalData, setActiveModal } = useERP();

  if (!modalData || !modalData.student || !modalData.payment) return null;

  const student: Student = modalData.student;
  const payment: FeePaymentRecord = modalData.payment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 text-slate-100 space-y-6 print:shadow-none print:border-none print:w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Official Fee Payment Receipt
          </h3>
          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Sheet */}
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 text-slate-100 print:bg-white print:text-slate-900 print:border-slate-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="bg-white p-1 rounded-lg max-w-[160px] mb-1">
                <img
                  src="/logo.jpg"
                  alt="KIDZ R KIDZ Pre School"
                  className="w-full h-auto object-contain max-h-10"
                />
              </div>
              <h2 className="font-black text-base tracking-tight text-white uppercase print:text-slate-900">
                KIDZ R KIDZ PRE SCHOOL
              </h2>
              <p className="text-[10px] text-slate-400">Official Accounts Receipt</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 block print:text-emerald-700">
                {payment.receiptNo}
              </span>
              <span className="text-[10px] text-slate-400">{payment.date}</span>
            </div>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900 p-3.5 rounded-2xl border border-slate-800 print:bg-slate-50 print:border-slate-300">
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

          {/* Payment Particulars */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs print:bg-emerald-50 print:border-emerald-200">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300 print:text-slate-800">Fee Particular:</span>
              <span className="text-white print:text-slate-900">{payment.feeType}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Mode:</span>
              <span className="font-bold text-emerald-300 print:text-emerald-700">{payment.method}</span>
            </div>
            <div className="pt-2 border-t border-emerald-500/30 flex justify-between font-black text-base">
              <span className="text-white print:text-slate-900">Amount Paid:</span>
              <span className="text-emerald-400 print:text-emerald-700">₹{payment.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Signature */}
          <div className="flex items-center justify-between pt-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorized Payment Receipt</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Accounts Official Signature</span>
              <span className="font-serif italic text-xs text-blue-300 font-bold print:text-slate-900">
                KIDZ R KIDZ Accounts
              </span>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print Payment Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
