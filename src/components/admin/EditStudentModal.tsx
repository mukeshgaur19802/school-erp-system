'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Save, UserCheck, Upload, Trash2, MapPin, IndianRupee } from 'lucide-react';
import { Student } from '../../types';
import { compressImage } from '../../utils/imageCompressor';

export const EditStudentModal: React.FC = () => {
  const { modalData, editStudent, setActiveModal } = useERP();
  const student: Student = modalData;

  if (!student) return null;

  const [admissionNo, setAdmissionNo] = useState(student.admissionNo);
  const [name, setName] = useState(student.name);
  const [fatherName, setFatherName] = useState(student.fatherName);
  const [motherName, setMotherName] = useState(student.motherName);
  const [className, setClassName] = useState(student.className);
  const [section, setSection] = useState(student.section);
  const [dob, setDob] = useState(student.dob);
  const [gender, setGender] = useState(student.gender);
  const [placeOfBirth, setPlaceOfBirth] = useState(student.placeOfBirth || '');

  const [fatherQualification, setFatherQualification] = useState(student.fatherQualification || '');
  const [fatherOccupation, setFatherOccupation] = useState(student.fatherOccupation || '');
  const [parentPhone, setParentPhone] = useState(student.parentPhone);
  const [fatherPhone2, setFatherPhone2] = useState(student.fatherPhone2 || '');

  const [motherQualification, setMotherQualification] = useState(student.motherQualification || '');
  const [motherOccupation, setMotherOccupation] = useState(student.motherOccupation || '');
  const [motherPhone2, setMotherPhone2] = useState(student.motherPhone2 || '');

  const [parentEmail, setParentEmail] = useState(student.parentEmail);
  const [currentAddress, setCurrentAddress] = useState(student.currentAddress);
  const [permanentAddress, setPermanentAddress] = useState(student.permanentAddress);
  const [studentPhoto, setStudentPhoto] = useState(student.photo);
  const [fatherPhoto, setFatherPhoto] = useState(student.fatherPhoto || student.parentPhoto);
  const [motherPhoto, setMotherPhoto] = useState(student.motherPhoto || student.parentPhoto);

  const [admissionFee, setAdmissionFee] = useState(student.fees.admissionFee);
  const [tuitionFee, setTuitionFee] = useState(student.fees.tuitionFee);
  const [transportFee, setTransportFee] = useState(student.fees.transportFee);
  const [booksFee, setBooksFee] = useState(student.fees.booksFee);
  const [annualFee, setAnnualFee] = useState(student.fees.annualFee);
  const [paidAmount, setPaidAmount] = useState(student.fees.paidAmount);

  const totalFee = Number(admissionFee) + Number(tuitionFee) + Number(transportFee) + Number(booksFee) + Number(annualFee);
  const pendingAmount = Math.max(0, totalFee - Number(paidAmount));

  const handleStudentFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const compressed = await compressImage(file, 300, 0.7);
    setStudentPhoto(compressed);
  };

  const handleFatherFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const compressed = await compressImage(file, 300, 0.7);
    setFatherPhoto(compressed);
  };

  const handleMotherFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const compressed = await compressImage(file, 300, 0.7);
    setMotherPhoto(compressed);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    editStudent(student.id, {
      admissionNo,
      name,
      fatherName,
      motherName,
      className,
      section,
      dob,
      gender,
      placeOfBirth,
      fatherQualification,
      fatherOccupation,
      fatherPhone2,
      motherQualification,
      motherOccupation,
      motherPhone2,
      parentPhone,
      parentEmail,
      currentAddress,
      permanentAddress,
      photo: studentPhoto,
      parentPhoto: fatherPhoto || motherPhoto || studentPhoto,
      fatherPhoto,
      motherPhoto,
      fees: {
        admissionFee: Number(admissionFee),
        tuitionFee: Number(tuitionFee),
        transportFee: Number(transportFee),
        booksFee: Number(booksFee),
        annualFee: Number(annualFee),
        totalFee,
        paidAmount: Number(paidAmount),
        pendingAmount,
      },
    });

    setActiveModal('NONE');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full p-6 text-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={studentPhoto} alt={name} className="w-10 h-10 rounded-full object-cover border border-blue-500" />
            <div>
              <h2 className="text-lg font-black text-white">View & Edit Student Admission Record</h2>
              <p className="text-xs text-blue-300">ID: {student.id} | Roll No: #{student.rollNo} (Auto Alphabetical)</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-amber-300 mb-1">Admission No (Editable) *</label>
              <input
                type="text"
                required
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-amber-500/50 text-amber-300 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Class</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {['Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {['A', 'B', 'C', 'D'].map((s) => (
                  <option key={s} value={s}>Section {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Place of Birth</label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Father & Mother Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="font-bold text-white uppercase text-[10px] block">Father Information</span>
              <div>
                <label className="text-slate-400 text-[10px]">Father Name</label>
                <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[10px]">Qualification</label>
                  <input type="text" value={fatherQualification} onChange={(e) => setFatherQualification(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px]">Occupation</label>
                  <input type="text" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[10px]">Father Phone 1</label>
                  <input type="text" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px]">Father Phone 2</label>
                  <input type="text" value={fatherPhone2} onChange={(e) => setFatherPhone2(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="font-bold text-white uppercase text-[10px] block">Mother Information</span>
              <div>
                <label className="text-slate-400 text-[10px]">Mother Name</label>
                <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[10px]">Qualification</label>
                  <input type="text" value={motherQualification} onChange={(e) => setMotherQualification(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px]">Occupation</label>
                  <input type="text" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-[10px]">Mother Phone 2</label>
                <input type="text" value={motherPhone2} onChange={(e) => setMotherPhone2(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
              </div>
            </div>
          </div>

          {/* Photos Upload Section */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
            <span className="font-bold text-slate-300 text-[11px] block">Update Student & Parent Photos</span>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div>
                <img src={studentPhoto} alt="Student" className="w-14 h-14 mx-auto rounded-xl object-cover border border-slate-700 mb-1" />
                <label className="px-2 py-1 rounded bg-slate-700 text-white cursor-pointer">
                  Child Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleStudentFile(e.target.files[0]); }} />
                </label>
              </div>
              <div>
                <img src={fatherPhoto} alt="Father" className="w-14 h-14 mx-auto rounded-xl object-cover border border-slate-700 mb-1" />
                <label className="px-2 py-1 rounded bg-slate-700 text-white cursor-pointer">
                  Father Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFatherFile(e.target.files[0]); }} />
                </label>
              </div>
              <div>
                <img src={motherPhoto} alt="Mother" className="w-14 h-14 mx-auto rounded-xl object-cover border border-slate-700 mb-1" />
                <label className="px-2 py-1 rounded bg-slate-700 text-white cursor-pointer">
                  Mother Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleMotherFile(e.target.files[0]); }} />
                </label>
              </div>
            </div>
          </div>

          {/* Address & Emails */}
          <div className="space-y-2">
            <div>
              <label className="block text-slate-300 mb-1">Current Address</label>
              <textarea rows={2} value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Permanent Address</label>
              <textarea rows={2} value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
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
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Record Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
