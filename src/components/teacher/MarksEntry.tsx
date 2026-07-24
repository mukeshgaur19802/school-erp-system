'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Award, Save, CheckCircle2 } from 'lucide-react';

export const MarksEntry: React.FC = () => {
  const { students, addExamMarks } = useERP();

  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [selectedSection, setSelectedSection] = useState('A');
  const [examName, setExamName] = useState('Unit Test 1 (Term 2025-26)');
  const [subject, setSubject] = useState('Mathematics');
  const [maxMarks, setMaxMarks] = useState(50);

  const classStudents = students.filter(
    (s) => s.className === selectedClass && s.section === selectedSection
  );

  const [marksState, setMarksState] = useState<{ [studentId: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    students.forEach((s) => {
      initial[s.id] = 45;
    });
    return initial;
  });

  const handleMarkChange = (studentId: string, val: number) => {
    setMarksState((prev) => ({ ...prev, [studentId]: Math.min(maxMarks, Math.max(0, val)) }));
  };

  const calculateGrade = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const handleSaveMarks = () => {
    const entries = classStudents.map((s) => {
      const score = marksState[s.id] || 0;
      return {
        studentId: s.id,
        examName,
        subject,
        marksObtained: score,
        maxMarks: Number(maxMarks),
        grade: calculateGrade(score, maxMarks),
        remarks: score >= 45 ? 'Outstanding Performance' : 'Good effort',
      };
    });

    addExamMarks(entries);
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              Exam Marks & Grading Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Enter Student Exam Marks
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Recorded marks automatically compute grades and populate parent report cards.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-800 text-white px-2 py-1.5 rounded-xl border border-slate-700"
              >
                {['Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((c) => (
                  <option key={c} value={c}>{c.startsWith('Class') ? c : `Class ${c}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Sec</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full bg-slate-800 text-white px-2 py-1.5 rounded-xl border border-slate-700"
              >
                {['A','B','C','D'].map((s) => (
                  <option key={s} value={s}>Sec {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 text-white px-2 py-1.5 rounded-xl border border-slate-700"
              >
                {['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Max Marks</label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full bg-slate-800 text-white px-2 py-1.5 rounded-xl border border-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">
            Class {selectedClass}-{selectedSection} Marks Entry ({subject})
          </h3>

          <button
            onClick={handleSaveMarks}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Marks</span>
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {[...classStudents].sort((a, b) => a.rollNo - b.rollNo).map((stu) => {
            const score = marksState[stu.id] ?? 45;
            const grade = calculateGrade(score, maxMarks);
            return (
              <div
                key={stu.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 rounded-2xl hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={stu.photo}
                    alt={stu.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{stu.name}</h4>
                    <p className="text-xs text-slate-400">Roll No #{stu.rollNo} • Adm: {stu.admissionNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <label className="text-slate-400">Score:</label>
                    <input
                      type="number"
                      max={maxMarks}
                      min={0}
                      value={score}
                      onChange={(e) => handleMarkChange(stu.id, Number(e.target.value))}
                      className="w-20 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-center focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-slate-400">/ {maxMarks}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-black border ${
                    grade.startsWith('A')
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : grade.startsWith('B')
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    Grade {grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
