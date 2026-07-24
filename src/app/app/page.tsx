'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import Link from 'next/link';
import { 
  Home, 
  Calendar, 
  Bell, 
  CreditCard, 
  BookMarked, 
  LogOut,
  Smartphone,
  Phone,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Bus,
  QrCode,
  Laptop
} from 'lucide-react';

// Teacher Modules
import { TeacherDashboard } from '../../components/teacher/TeacherDashboard';
import { AttendanceMarker } from '../../components/teacher/AttendanceMarker';
import { HomeworkManager } from '../../components/teacher/HomeworkManager';
import { MarksEntry } from '../../components/teacher/MarksEntry';

// Parent Modules
import { ParentDashboard } from '../../components/parent/ParentDashboard';
import { ParentAcademics } from '../../components/parent/ParentAcademics';
import { ParentFeeGateway } from '../../components/parent/ParentFeeGateway';

// Shared / Transport
import { TransportDashboard } from '../../components/transport/TransportDashboard';
import { SchoolCalendar } from '../../components/common/SchoolCalendar';
import { NotificationCenter } from '../../components/admin/NotificationCenter';

// Modals
import { IDCardModal } from '../../components/common/IDCardModal';
import { ReportCardModal } from '../../components/common/ReportCardModal';
import { FeeReceiptModal } from '../../components/common/FeeReceiptModal';
import { EditStudentModal } from '../../components/admin/EditStudentModal';
import { EditTeacherModal } from '../../components/admin/EditTeacherModal';
import { TeacherDetailModal } from '../../components/admin/TeacherDetailModal';

export default function MobileAppPortal() {
  const { 
    isAuthenticated, 
    activeRole, 
    activeTab, 
    setActiveTab, 
    activeModal, 
    login, 
    logout,
    teachers,
    students,
    selectedStudentId,
    setSelectedStudentId
  } = useERP();

  // Login Form View Tabs
  const [loginTab, setLoginTab] = useState<'TEACHER' | 'PARENT' | 'TRANSPORT'>('TEACHER');

  // Input states
  const [teacherPhone, setTeacherPhone] = useState('0000000000');
  const [teacherPass, setTeacherPass] = useState('teach#321');

  const [parentPhone, setParentPhone] = useState('9876543210');
  const [parentPassword, setParentPassword] = useState('student#123');

  const [transportPhone, setTransportPhone] = useState('8888888888');

  const [errorMsg, setErrorMsg] = useState('');
  
  // Detect if window is loaded for dynamic URL mapping
  const [appUrl, setAppUrl] = useState('https://kidzrkidz.vercel.app/app');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(`${window.location.origin}/app`);
      
      // Auto-populate first student's parent phone for demonstration
      if (students && students.length > 0 && parentPhone === '9876543210') {
        setParentPhone(students[0].parentPhone);
      }
    }
  }, [students]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}&color=13-148-136&bgcolor=255-255-255`;

  // Autologin Quick Demo buttons
  const handleQuickTeacherDemo = () => {
    setErrorMsg('');
    const demoTeacher = teachers.find(t => t.mobile === '0000000000') || teachers[0];
    if (demoTeacher) {
      login('TEACHER', {
        mobile: demoTeacher.mobile,
        name: demoTeacher.name,
        teacherId: demoTeacher.id
      });
    } else {
      login('TEACHER', {
        mobile: '0000000000',
        name: 'Mrs. Pooja Sharma (Demo)',
        teacherId: 'TCH-DEMO-001'
      });
    }
  };

  const handleQuickParentDemo = () => {
    setErrorMsg('');
    const demoStudent = students[0];
    if (demoStudent) {
      setSelectedStudentId(demoStudent.id);
      login('PARENT', {
        mobile: demoStudent.parentPhone || '9876543210',
        name: `Parent of ${demoStudent.name}`
      });
    } else {
      login('PARENT', {
        mobile: '9876543210',
        name: 'Parent App Portal'
      });
    }
  };

  const handleQuickTransportDemo = () => {
    setErrorMsg('');
    login('TRANSPORT', {
      mobile: '8888888888',
      name: 'Driver (Route 5)'
    });
  };

  // Form Submissions
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const match = teachers.find(t => t.mobile.trim() === teacherPhone.trim());
    if (match) {
      if (match.password && match.password !== teacherPass) {
        setErrorMsg('Invalid password. Default is teach#321.');
        return;
      }
      login('TEACHER', {
        mobile: match.mobile,
        name: match.name,
        teacherId: match.id
      });
    } else if (teacherPhone === '0000000000') {
      handleQuickTeacherDemo();
    } else {
      login('TEACHER', {
        mobile: teacherPhone,
        name: `Teacher (${teacherPhone})`
      });
    }
  };

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Find student by parent phone
    const match = students.find(s => s.parentPhone.trim() === parentPhone.trim());
    if (match) {
      const studentPass = match.password || 'student#123';
      if (studentPass !== parentPassword) {
        setErrorMsg('Incorrect password. Default parent password is student#123.');
        return;
      }
      setSelectedStudentId(match.id);
      login('PARENT', {
        mobile: parentPhone,
        name: `Parent of ${match.name}`
      });
    } else {
      setErrorMsg(`No student account registered under phone number: "${parentPhone}".`);
    }
  };

  const handleTransportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    login('TRANSPORT', {
      mobile: transportPhone,
      name: `Driver (${transportPhone})`
    });
  };

  // Inner Component: Renders the App Content itself
  const renderMobileAppContent = () => {
    // 1. Logged in as Admin inside mobile app: Show redirect warning
    if (isAuthenticated && activeRole === 'ADMIN') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Laptop className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-white">Desk Session Active</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are logged in with the **Super Admin** role. Please use the Desktop Console at `/admin` for management operations.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full text-xs font-bold">
            <Link href="/admin" className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center transition-all block">
              Open Admin Console
            </Link>
            <button onClick={logout} className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 transition-all">
              Log Out and Change Account
            </button>
          </div>
        </div>
      );
    }

    // 2. Not Authenticated: Render Mobile App Login Form
    if (!isAuthenticated) {
      return (
        <div className="flex-1 flex flex-col justify-between p-5 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pt-4">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl max-w-[170px] mx-auto border border-slate-800">
              <img src="/logo.jpg" alt="Logo" className="w-full h-auto max-h-12 object-contain" />
            </div>
            <div>
              <h2 className="font-black text-sm text-white uppercase tracking-tight">KIDZ R KIDZ School App</h2>
              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Teacher & Parent Portal</p>
            </div>
          </div>

          {/* Selector pills */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
            <button
              onClick={() => { setLoginTab('TEACHER'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-colors ${loginTab === 'TEACHER' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Teacher
            </button>
            <button
              onClick={() => { setLoginTab('PARENT'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-colors ${loginTab === 'PARENT' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Parent
            </button>
            <button
              onClick={() => { setLoginTab('TRANSPORT'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-colors ${loginTab === 'TRANSPORT' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Transport
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-[10px] text-center font-bold">
              {errorMsg}
            </div>
          )}

          {/* Forms */}
          <div className="flex-1 bg-slate-900/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            {loginTab === 'TEACHER' && (
              <form onSubmit={handleTeacherSubmit} className="space-y-4 text-[11px] flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Teacher Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={teacherPhone}
                        onChange={e => setTeacherPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Access Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={teacherPass}
                        onChange={e => setTeacherPass(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-900/20"
                  >
                    <span>Teacher Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickTeacherDemo}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 font-bold border border-slate-750"
                  >
                    ⚡ Quick Teacher Demo Login
                  </button>
                </div>
              </form>
            )}

            {loginTab === 'PARENT' && (
              <form onSubmit={handleParentSubmit} className="space-y-4 text-[11px] flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Parent Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={parentPhone}
                        onChange={e => setParentPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Portal Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={parentPassword}
                        onChange={e => setParentPassword(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-900/20"
                  >
                    <span>Parent Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickParentDemo}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 font-bold border border-slate-750"
                  >
                    ⚡ Quick Parent Demo Login
                  </button>
                </div>
              </form>
            )}

            {loginTab === 'TRANSPORT' && (
              <form onSubmit={handleTransportSubmit} className="space-y-4 text-[11px] flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Driver Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={transportPhone}
                        onChange={e => setTransportPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-900/20"
                  >
                    <span>Driver Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickTransportDemo}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 font-bold border border-slate-750"
                  >
                    ⚡ Quick Transport Demo Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    }

    // 3. Authenticated: Render Role Dashboard modules inside PWA structure
    const renderActiveAppModule = () => {
      if (activeRole === 'TEACHER') {
        switch (activeTab) {
          case 'attendance':
            return <AttendanceMarker />;
          case 'homework':
            return <HomeworkManager />;
          case 'marks':
            return <MarksEntry />;
          case 'calendar':
            return <SchoolCalendar />;
          case 'dashboard':
          default:
            return <TeacherDashboard />;
        }
      }

      if (activeRole === 'PARENT') {
        switch (activeTab) {
          case 'academics':
            return <ParentAcademics />;
          case 'fees':
            return <ParentFeeGateway />;
          case 'calendar':
            return <SchoolCalendar />;
          case 'notifications':
            return <NotificationCenter />;
          case 'profile':
          case 'dashboard':
          default:
            return <ParentDashboard />;
        }
      }

      if (activeRole === 'TRANSPORT') {
        return <TransportDashboard />;
      }

      return null;
    };

    return (
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* Top Header bar inside app */}
        <header className="p-3 bg-slate-900 border-b border-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg p-0.5 border border-teal-500/20">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold uppercase tracking-wider block w-fit">
                {activeRole === 'PARENT' ? 'Parent App' : activeRole}
              </span>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Scrollable module contents */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {renderActiveAppModule()}
        </main>

        {/* Bottom Tab Bar Navigation */}
        <nav className="p-2.5 bg-slate-900 border-t border-slate-850 grid grid-flow-col justify-stretch text-center shrink-0 select-none">
          {activeRole === 'TEACHER' && (
            <>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <Home className="w-4 h-4" />
                <span className="text-[8px] font-bold">Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('attendance')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'attendance' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <BookMarked className="w-4 h-4" />
                <span className="text-[8px] font-bold">Attendance</span>
              </button>
              <button 
                onClick={() => setActiveTab('homework')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'homework' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <ClipboardListIcon className="w-4 h-4" />
                <span className="text-[8px] font-bold">Homework</span>
              </button>
              <button 
                onClick={() => setActiveTab('marks')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'marks' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <AwardIcon className="w-4 h-4" />
                <span className="text-[8px] font-bold">Grades</span>
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-[8px] font-bold">Events</span>
              </button>
            </>
          )}

          {activeRole === 'PARENT' && (
            <>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'profile' || activeTab === 'dashboard' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <Home className="w-4 h-4" />
                <span className="text-[8px] font-bold">Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab('academics')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'academics' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <BookMarked className="w-4 h-4" />
                <span className="text-[8px] font-bold">Academics</span>
              </button>
              <button 
                onClick={() => setActiveTab('fees')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'fees' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[8px] font-bold">Fees</span>
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-[8px] font-bold">Calendar</span>
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'notifications' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <Bell className="w-4 h-4" />
                <span className="text-[8px] font-bold">Alerts</span>
              </button>
            </>
          )}

          {activeRole === 'TRANSPORT' && (
            <>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <Bus className="w-4 h-4" />
                <span className="text-[8px] font-bold">Fleet Desk</span>
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-teal-400' : 'text-slate-500'}`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-[8px] font-bold">Schedules</span>
              </button>
            </>
          )}
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-center items-center relative overflow-hidden selection:bg-teal-600 selection:text-white">
      {/* Dynamic manifest link to set Mobile Icon */}
      <link rel="manifest" href="/app-manifest.json" />

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Desktop view simulator wrapper */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 md:py-12 flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
        
        {/* Left pane: Displayed ONLY on large screens */}
        <div className="hidden md:flex flex-col max-w-md space-y-6 text-left shrink">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="bg-white p-2 rounded-xl border border-slate-800 shadow-lg">
              <img src="/logo.jpg" alt="Logo" className="h-6 w-auto" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-wider">KIDZ R KIDZ</h1>
              <p className="text-[9px] text-teal-400 font-bold uppercase tracking-widest">Back to portal home</p>
            </div>
          </Link>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-300 uppercase tracking-wider">
              <Smartphone className="w-3 h-3 text-teal-400" />
              <span>Mobile-First Simulator</span>
            </span>
            <h2 className="text-2xl font-black text-white leading-tight">
              Teacher & Parent Mobile App
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We detected that you are browsing from a desktop display. We've rendered a smartphone simulator on the right so you can interact with the app.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 text-xs">
            <div className="bg-white p-1 rounded-xl shrink-0">
              <img src={qrCodeUrl} alt="App QR" className="w-20 h-20" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>Mobile Access</span>
              </span>
              <p className="font-semibold text-white text-[11px]">Scan with your smartphone</p>
              <p className="text-[10px] text-slate-500">Open this portal instantly on your phone with native touch elements.</p>
            </div>
          </div>
        </div>

        {/* Right pane: The PWA Simulator (framed on desktop, full-width on mobile) */}
        <div className="w-full max-w-md md:w-[380px] md:h-[760px] md:rounded-[44px] md:border-[10px] md:border-slate-900 md:shadow-2xl relative bg-slate-950 flex flex-col justify-between overflow-hidden shrink-0 md:ring-4 md:ring-slate-800/40 select-none">
          {/* Virtual Top Notch/Speaker (Simulated ONLY on desktop) */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-b-2xl z-50">
            <div className="w-10 h-1 bg-slate-850 rounded-full mx-auto mt-1" />
          </div>

          {/* Actual Mobile Screen view */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden pt-0 md:pt-4">
            {renderMobileAppContent()}
          </div>

          {/* Virtual Home Bar indicator (Simulated ONLY on desktop) */}
          <div className="hidden md:block py-2 bg-slate-900 shrink-0">
            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto" />
          </div>
        </div>

      </div>

      {/* Global Modals for interactive panels */}
      {activeModal === 'ID_CARD' && <IDCardModal />}
      {activeModal === 'REPORT_CARD' && <ReportCardModal />}
      {activeModal === 'FEE_RECEIPT' && <FeeReceiptModal />}
      {activeModal === 'EDIT_STUDENT' && <EditStudentModal />}
      {activeModal === 'EDIT_TEACHER' && <EditTeacherModal />}
      {activeModal === 'INSPECT_TEACHER' && <TeacherDetailModal />}
    </div>
  );
}

// Inline helper icons for local tabs
function ClipboardListIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <path d="M9 12h6"></path>
      <path d="M9 16h6"></path>
    </svg>
  );
}

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  );
}
