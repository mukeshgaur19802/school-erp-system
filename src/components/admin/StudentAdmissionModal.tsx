'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { X, UserPlus, Upload, Trash2, Camera, Plus, CheckCircle2, ShieldCheck, Heart, FileText, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { SiblingInfo, EmergencyContactInfo } from '../../types';

interface StudentAdmissionModalProps {
  onClose: () => void;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({ onClose }) => {
  const { students, addStudent, busRoutes } = useERP();

  const [activeFormTab, setActiveFormTab] = useState<'PAGE1' | 'PAGE2' | 'FEES'>('PAGE1');

  // Page 1: Child & Parent Primary Details
  const defaultAdmissionNo = 'KRK-2025-' + String(students.length + 1).padStart(3, '0');
  const [admissionNo, setAdmissionNo] = useState(defaultAdmissionNo);
  const [className, setClassName] = useState('Nursery');
  const [section, setSection] = useState('A');
  const [academicYear, setAcademicYear] = useState('2025-2026');

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('2021-05-15');
  const [placeOfBirth, setPlaceOfBirth] = useState('');

  const [fatherName, setFatherName] = useState('');
  const [fatherQualification, setFatherQualification] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [parentPhone, setParentPhone] = useState(''); // Father Phone 1
  const [fatherPhone2, setFatherPhone2] = useState('');

  const [motherName, setMotherName] = useState('');
  const [motherQualification, setMotherQualification] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [motherPhone1, setMotherPhone1] = useState('');
  const [motherPhone2, setMotherPhone2] = useState('');

  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [sameAsCurrent, setSameAsCurrent] = useState(true);
  const [parentEmail, setParentEmail] = useState('');

  const PHOTO_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  // 3 Photo Uploads (Student, Father, Mother)
  const [studentPhoto, setStudentPhoto] = useState(PHOTO_PLACEHOLDER);
  const [fatherPhoto, setFatherPhoto] = useState(PHOTO_PLACEHOLDER);
  const [motherPhoto, setMotherPhoto] = useState(PHOTO_PLACEHOLDER);

  // Page 2: Siblings, Emergency Contacts & Consents
  const [siblings, setSiblings] = useState<SiblingInfo[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactInfo[]>([
    { name: '', address: '', mobile: '', relation: '' },
    { name: '', address: '', mobile: '', relation: '' },
  ]);
  const [emergencyPermission, setEmergencyPermission] = useState(true);
  const [transportPermission, setTransportPermission] = useState(true);

  // Fee Structure
  const [admissionFee, setAdmissionFee] = useState(5000);
  const [tuitionFee, setTuitionFee] = useState(15000);
  const [annualFee, setAnnualFee] = useState(3000);
  const [booksFee, setBooksFee] = useState(2500);
  const [booksPackage, setBooksPackage] = useState('Full Set (Books + Uniform + Stationary)');

  const [hasTransport, setHasTransport] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(busRoutes[0]?.id || '');
  const [transportFee, setTransportFee] = useState(1200);

  const [initialPaidAmount, setInitialPaidAmount] = useState(5000);

  const effectiveTransportFee = hasTransport ? Number(transportFee) : 0;
  const totalFee = Number(admissionFee) + Number(tuitionFee) + effectiveTransportFee + Number(booksFee) + Number(annualFee);
  const pendingAmount = Math.max(0, totalFee - Number(initialPaidAmount));

  // Photo Handlers (Canvas Compression)
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

  const addSiblingRow = () => {
    setSiblings((prev) => [
      ...prev,
      { name: '', gender: 'M', dob: '', school: '', className: '', isAlumni: false },
    ]);
  };

  const removeSiblingRow = (idx: number) => {
    setSiblings((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSibling = (idx: number, field: keyof SiblingInfo, value: any) => {
    setSiblings((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const updateEmergencyContact = (idx: number, field: keyof EmergencyContactInfo, value: string) => {
    setEmergencyContacts((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !fatherName || !parentPhone) return;

    addStudent({
      customAdmissionNo: admissionNo,
      name,
      fatherName,
      motherName: motherName || 'Not Provided',
      className,
      section,
      rollNo: 1, // Will be automatically sorted & recalculated alphabetically
      academicYear,
      dob,
      gender,
      photo: studentPhoto,
      parentPhoto: fatherPhoto || motherPhoto || studentPhoto,
      fatherPhoto,
      motherPhoto,
      parentPhone,
      parentEmail: parentEmail || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      currentAddress,
      permanentAddress: sameAsCurrent ? currentAddress : permanentAddress,
      admissionDate: new Date().toISOString().split('T')[0],
      booksPackage,
      hasTransport,
      busRouteId: hasTransport ? selectedRouteId : undefined,

      // Official Form Fields
      placeOfBirth,
      fatherQualification,
      fatherOccupation,
      fatherPhone2,
      motherQualification,
      motherOccupation,
      motherPhone2: motherPhone1 || motherPhone2,
      siblings,
      emergencyContacts,
      consents: {
        emergencyPermission,
        transportPermission,
      },

      fees: {
        admissionFee: Number(admissionFee),
        tuitionFee: Number(tuitionFee),
        transportFee: effectiveTransportFee,
        booksFee: Number(booksFee),
        annualFee: Number(annualFee),
        totalFee,
        paidAmount: Number(initialPaidAmount),
        pendingAmount,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full p-6 text-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-auto bg-white rounded p-0.5" />
            <div>
              <h2 className="text-lg font-black text-white">KIDZ R KIDZ Pre School Official Admission Form</h2>
              <p className="text-xs text-slate-400">Complete 2-page admission entry with alphabetical roll numbering</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveFormTab('PAGE1')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeFormTab === 'PAGE1' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Form Page 1: Child & Parents Info
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('PAGE2')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeFormTab === 'PAGE2' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Form Page 2: Siblings & Emergency
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('FEES')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeFormTab === 'FEES' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fees & Transport Config
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* TAB 1: CHILD & PARENT DETAILS */}
          {activeFormTab === 'PAGE1' && (
            <div className="space-y-4 animate-fade-in">
              {/* Class Enrolled & Admission No */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Class Enrolled For *</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  >
                    {['A', 'B', 'C', 'D'].map((s) => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-amber-300 mb-1">Admission Number (Editable) *</label>
                  <input
                    type="text"
                    required
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* 3 Photos Upload Box (Student, Father, Mother) */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px] block">
                  Passport Photos (Drag & Drop or Local Browse)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Student Photo */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                    <span className="text-[11px] font-bold text-white block">Child Photo</span>
                    <img src={studentPhoto} alt="Student" className="w-20 h-20 mx-auto rounded-xl object-cover border border-slate-700" />
                    <label className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Browse</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleStudentFile(e.target.files[0]); }} />
                    </label>
                  </div>

                  {/* Father Photo */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                    <span className="text-[11px] font-bold text-white block">Father Photo</span>
                    <img src={fatherPhoto} alt="Father" className="w-20 h-20 mx-auto rounded-xl object-cover border border-slate-700" />
                    <label className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Browse</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFatherFile(e.target.files[0]); }} />
                    </label>
                  </div>

                  {/* Mother Photo */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                    <span className="text-[11px] font-bold text-white block">Mother Photo</span>
                    <img src={motherPhoto} alt="Mother" className="w-20 h-20 mx-auto rounded-xl object-cover border border-slate-700" />
                    <label className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Browse</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleMotherFile(e.target.files[0]); }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Child Details */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Name of the Child *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Gender (M/F) *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Male">Male (M)</option>
                    <option value="Female">Female (F)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Place of Birth</label>
                  <input
                    type="text"
                    placeholder="City / Hospital"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Parent Email Address</label>
                  <input
                    type="email"
                    placeholder="parents@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Father Details */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                  Father's Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Qualification</label>
                    <input
                      type="text"
                      placeholder="B.Tech / MBA"
                      value={fatherQualification}
                      onChange={(e) => setFatherQualification(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Occupation</label>
                    <input
                      type="text"
                      placeholder="Business / Engineer"
                      value={fatherOccupation}
                      onChange={(e) => setFatherOccupation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Father Phone 1 *</label>
                    <input
                      type="text"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Father Phone 2</label>
                    <input
                      type="text"
                      value={fatherPhone2}
                      onChange={(e) => setFatherPhone2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Details */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                  Mother's Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Qualification</label>
                    <input
                      type="text"
                      placeholder="M.Sc / B.Ed"
                      value={motherQualification}
                      onChange={(e) => setMotherQualification(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Occupation</label>
                    <input
                      type="text"
                      placeholder="Teacher / Homemaker"
                      value={motherOccupation}
                      onChange={(e) => setMotherOccupation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Mother Phone 1</label>
                    <input
                      type="text"
                      value={motherPhone1}
                      onChange={(e) => setMotherPhone1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Mother Phone 2</label>
                    <input
                      type="text"
                      value={motherPhone2}
                      onChange={(e) => setMotherPhone2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Current Residential Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sameAddr"
                    checked={sameAsCurrent}
                    onChange={(e) => setSameAsCurrent(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                  <label htmlFor="sameAddr" className="text-slate-300">Permanent address same as current address</label>
                </div>

                {!sameAsCurrent && (
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Permanent Address</label>
                    <textarea
                      rows={2}
                      value={permanentAddress}
                      onChange={(e) => setPermanentAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PAGE 2 SIBLINGS & EMERGENCY CONTACTS */}
          {activeFormTab === 'PAGE2' && (
            <div className="space-y-6 animate-fade-in">
              {/* Sibling Table */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                    Brothers / Sisters Details ({siblings.length})
                  </span>
                  <button
                    type="button"
                    onClick={addSiblingRow}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Sibling</span>
                  </button>
                </div>

                {siblings.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">No siblings added. Click button above if child has brothers/sisters in school.</p>
                ) : (
                  <div className="space-y-2">
                    {siblings.map((sib, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center text-xs">
                        <input
                          type="text"
                          placeholder="Sibling Name"
                          value={sib.name}
                          onChange={(e) => updateSibling(idx, 'name', e.target.value)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white sm:col-span-2"
                        />
                        <select
                          value={sib.gender}
                          onChange={(e) => updateSibling(idx, 'gender', e.target.value as any)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                        >
                          <option value="M">Male (M)</option>
                          <option value="F">Female (F)</option>
                        </select>
                        <input
                          type="date"
                          value={sib.dob}
                          onChange={(e) => updateSibling(idx, 'dob', e.target.value)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="School Attending & Class"
                          value={sib.school}
                          onChange={(e) => updateSibling(idx, 'school', e.target.value)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-1 text-[10px] text-teal-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sib.isAlumni}
                              onChange={(e) => updateSibling(idx, 'isAlumni', e.target.checked)}
                              className="rounded bg-slate-800 text-teal-500"
                            />
                            KRK Alumni
                          </label>
                          <button
                            type="button"
                            onClick={() => removeSiblingRow(idx)}
                            className="p-1 rounded bg-rose-950/60 text-rose-300 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Emergency Contacts (2 Persons) */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                  Emergency Contacts (If parents cannot be reached)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {emergencyContacts.map((c, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="font-bold text-amber-300 text-[11px] block">Emergency Contact #{idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Contact Person Name"
                        value={c.name}
                        onChange={(e) => updateEmergencyContact(idx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        value={c.mobile}
                        onChange={(e) => updateEmergencyContact(idx, 'mobile', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Relation (e.g. Uncle / Grandfather)"
                        value={c.relation}
                        onChange={(e) => updateEmergencyContact(idx, 'relation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions & Consents */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                  Parental Permissions & Consents
                </span>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emergencyPermission}
                    onChange={(e) => setEmergencyPermission(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-500"
                  />
                  <span className="text-[11px] text-slate-300 leading-snug">
                    <strong>Emergency Permission Consent:</strong> I give consent for emergency measures to be taken in case of medical/surgical emergency with the understanding that parents will be notified immediately.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transportPermission}
                    onChange={(e) => setTransportPermission(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-500"
                  />
                  <span className="text-[11px] text-slate-300 leading-snug">
                    <strong>Transport Permission Consent:</strong> I understand school conveyance rules and give consent for transport during school trips & daily commute.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: FEES & TRANSPORT */}
          {activeFormTab === 'FEES' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Admission Fee (One-Time)</label>
                  <input
                    type="number"
                    value={admissionFee}
                    onChange={(e) => setAdmissionFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tuition Fee (Annual)</label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Annual Charges</label>
                  <input
                    type="number"
                    value={annualFee}
                    onChange={(e) => setAnnualFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* Transport Config */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={hasTransport}
                      onChange={(e) => setHasTransport(e.target.checked)}
                      className="rounded bg-slate-900 text-blue-500"
                    />
                    Opt for School Bus Transport
                  </label>
                </div>

                {hasTransport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Select Bus Route</label>
                      <select
                        value={selectedRouteId}
                        onChange={(e) => setSelectedRouteId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      >
                        {busRoutes.map((r) => (
                          <option key={r.id} value={r.id}>{r.routeNo}: {r.routeName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Transport Fee (Monthly)</label>
                      <input
                        type="number"
                        value={transportFee}
                        onChange={(e) => setTransportFee(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Total Calculation */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">Calculated Total Fee</span>
                  <span className="text-xl font-black text-white font-mono">₹{totalFee.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 text-[10px]">Initial Paid Amount</label>
                  <input
                    type="number"
                    value={initialPaidAmount}
                    onChange={(e) => setInitialPaidAmount(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold w-32"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-[10px] text-amber-300 font-mono">
              * Roll numbers are automatically assigned in alphabetical order for Class {className}-{section}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Complete Admission</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
