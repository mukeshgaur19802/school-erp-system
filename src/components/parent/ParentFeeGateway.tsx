'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  CreditCard,
  IndianRupee,
  Receipt,
  QrCode,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';

export const ParentFeeGateway: React.FC = () => {
  const { currentStudent, makeFeePayment, setActiveModal, setModalData } = useERP();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState(currentStudent?.fees.pendingAmount || 1500);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking'>('UPI');
  const [feeType, setFeeType] = useState('Term 2 Pending Tuition & Transport Fee');

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || payAmount <= 0) return;

    makeFeePayment(currentStudent.id, payAmount, paymentMethod, feeType);
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              Online Fee Payment Portal (Step 5)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Fee Management & Digital Receipts
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Pay pending fees via instant UPI, Credit/Debit cards, or Netbanking. Digital receipts generated automatically.
            </p>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={currentStudent?.fees.pendingAmount === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-xs font-extrabold shadow-xl transition-all transform hover:-translate-y-0.5 ${
              currentStudent?.fees.pendingAmount === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-600/30'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {currentStudent?.fees.pendingAmount === 0
                ? '100% Fees Cleared!'
                : `Pay ₹${currentStudent?.fees.pendingAmount.toLocaleString('en-IN')} Now`}
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">Total Academic Fee</span>
            <div className="text-xl font-black text-white mt-1">
              ₹{currentStudent?.fees.totalFee.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">Total Paid Amount</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              ₹{currentStudent?.fees.paidAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">Current Pending Balance</span>
            <div className="text-xl font-black text-amber-300 mt-1">
              ₹{currentStudent?.fees.pendingAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakup & Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Schedule Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-400" />
            Itemized Fee Schedule Breakdown
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex justify-between">
              <span className="text-slate-300">Admission Fee (One-time)</span>
              <span className="font-semibold text-white">₹{currentStudent?.fees.admissionFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex justify-between">
              <span className="text-slate-300">Tuition Fee (Annual)</span>
              <span className="font-semibold text-white">₹{currentStudent?.fees.tuitionFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex justify-between">
              <span className="text-slate-300">Transport Bus Service Fee</span>
              <span className="font-semibold text-white">₹{currentStudent?.fees.transportFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex justify-between">
              <span className="text-slate-300">Books & Course Material Package</span>
              <span className="font-semibold text-white">₹{currentStudent?.fees.booksFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex justify-between">
              <span className="text-slate-300">Annual Charges & Lab Maintenance</span>
              <span className="font-semibold text-white">₹{currentStudent?.fees.annualFee.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Payment Receipts History */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Official Payment Receipts History
          </h3>

          <div className="space-y-3">
            {currentStudent?.paymentHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No payment receipts found yet.</p>
            ) : (
              currentStudent?.paymentHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition-all text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-300">{rec.receiptNo}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        {rec.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white mt-1">{rec.feeType}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Paid via {rec.method} on {rec.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-white">
                      ₹{rec.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => {
                        setModalData({ student: currentStudent, payment: rec });
                        setActiveModal('FEE_RECEIPT');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 text-xs font-semibold border border-indigo-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Online Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-100 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Secure Online Payment Gateway</h3>
                  <p className="text-xs text-slate-400">256-bit Encrypted Fee Portal</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Paying for Student</label>
                <div className="p-3 rounded-xl bg-slate-800 font-bold text-white">
                  {currentStudent?.name} (Class {currentStudent?.className}-{currentStudent?.section})
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Amount to Pay (₹) *</label>
                <input
                  type="number"
                  required
                  max={currentStudent?.fees.pendingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border flex items-center gap-2 transition-all font-semibold ${
                      paymentMethod === 'UPI'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI / GPay / Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Credit Card')}
                    className={`p-3 rounded-xl border flex items-center gap-2 transition-all font-semibold ${
                      paymentMethod === 'Credit Card'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>
              </div>

              {/* Simulated UPI QR or Card Info */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">UPI ID: school.fee@astraea.upi</p>
                  <p className="text-[10px] text-emerald-400">Scan using any UPI App (GPay, PhonePe, Paytm)</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black shadow-xl shadow-orange-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirm Payment & Generate Receipt (Step 5)</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
