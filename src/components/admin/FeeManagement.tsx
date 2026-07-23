'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  CreditCard,
  Search,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Inbox,
  X
} from 'lucide-react';
import { Student } from '../../types';

export const FeeManagement: React.FC = () => {
  const { students, makeFeePayment, sendNotification, setActiveModal, setModalData } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking' | 'Cash'>('UPI');
  const [feeType, setFeeType] = useState<string>('Tuition & Term Fee');

  // 100% Dynamic Calculations from real student state
  const totalExpectedFees = students.reduce((acc, s) => acc + s.fees.totalFee, 0);
  const totalCollectedFees = students.reduce((acc, s) => acc + s.fees.paidAmount, 0);
  const totalPendingFees = students.reduce((acc, s) => acc + s.fees.pendingAmount, 0);

  const defaulterStudents = students.filter((s) => s.fees.pendingAmount > 0);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.includes(searchQuery)
  );

  const handleOpenPaymentModal = (student: Student) => {
    setSelectedStudent(student);
    setPayAmount(student.fees.pendingAmount > 0 ? student.fees.pendingAmount : 5000);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || payAmount <= 0) return;
    makeFeePayment(selectedStudent.id, payAmount, payMethod, feeType);
    setSelectedStudent(null);
  };

  const handleSendReminder = (student: Student) => {
    sendNotification({
      title: `Fee Due Alert: ₹${student.fees.pendingAmount.toLocaleString('en-IN')}`,
      message: `Dear Parent (${student.fatherName}), pending fee balance of ₹${student.fees.pendingAmount.toLocaleString('en-IN')} for ${student.name} (Class ${student.className}-${student.section}) is due. Please clear via Parent App.`,
      category: 'Fee Reminder',
      targetAudience: 'Individual Parents',
      targetStudentId: student.id,
      senderName: 'Accounts Department',
      senderRole: 'ADMIN',
    });
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Fee Accounts & Payment Collection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic ledger tracking expected revenue, payments received, and outstanding dues.
          </p>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Expected Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Expected Revenue</span>
            <h2 className="text-2xl font-black text-white mt-1">
              ₹{totalExpectedFees.toLocaleString('en-IN')}
            </h2>
            <span className="text-[11px] text-blue-400">Sum of admitted student fees</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Fees Collected</span>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">
              ₹{totalCollectedFees.toLocaleString('en-IN')}
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium">Clear Receipts Issued</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Pending Dues</span>
            <h2 className="text-2xl font-black text-amber-300 mt-1">
              ₹{totalPendingFees.toLocaleString('en-IN')}
            </h2>
            <span className="text-[11px] text-amber-400">{defaulterStudents.length} Students Pending</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Student Fee Ledger */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-white">Student Fee Accounts Ledger</h3>
            <p className="text-xs text-slate-400">Record counter payments and issue official receipts</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, father, adm no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full sm:w-60"
            />
          </div>
        </div>

        {students.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-800/40 border border-dashed border-slate-700 text-center space-y-2">
            <Inbox className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="font-bold text-sm text-white">No Student Fee Ledgers Found</h4>
            <p className="text-xs text-slate-400">
              When new student admissions are recorded, their itemized fee structure will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Student & Father Name</th>
                  <th className="py-3 px-3">Class & Section</th>
                  <th className="py-3 px-3">Total Fee</th>
                  <th className="py-3 px-3">Paid Amount</th>
                  <th className="py-3 px-3">Pending Balance</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.photo}
                          alt={stu.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white">{stu.name}</div>
                          <div className="text-[10px] text-slate-400">Father: {stu.fatherName}</div>
                          <div className="text-[10px] text-blue-400 font-mono">{stu.admissionNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      Class {stu.className}-{stu.section}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      ₹{stu.fees.totalFee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      ₹{stu.fees.paidAmount.toLocaleString('en-IN')}
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
                          onClick={() => handleOpenPaymentModal(stu)}
                          className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 text-[11px] font-bold border border-emerald-500/40 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Collect Fee</span>
                        </button>

                        {stu.fees.pendingAmount > 0 && (
                          <button
                            onClick={() => handleSendReminder(stu)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-200 text-[11px] font-semibold border border-amber-500/40 transition-colors flex items-center gap-1"
                            title="Send Fee Reminder to Parent"
                          >
                            <Send className="w-3 h-3" />
                            <span className="hidden sm:inline">Alert</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collect Fee Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">Counter Fee Payment Entry</h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 text-xs space-y-1">
              <div className="font-bold text-white text-sm">{selectedStudent.name}</div>
              <div className="text-slate-400">Class {selectedStudent.className}-{selectedStudent.section} | Father: {selectedStudent.fatherName}</div>
              <div className="text-amber-300 font-bold">Pending Dues: ₹{selectedStudent.fees.pendingAmount.toLocaleString('en-IN')}</div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Fee Particular Type</label>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="Tuition & Term Fee">Tuition & Term Fee</option>
                  <option value="Admission Fee">Admission Fee</option>
                  <option value="Transport Fee">Transport Fee</option>
                  <option value="Books & Kit Fee">Books & Kit Fee</option>
                  <option value="Annual & Activity Charges">Annual & Activity Charges</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Amount Collecting (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-extrabold text-base"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Payment Mode</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Netbanking">Netbanking</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30"
                >
                  Confirm Payment & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
