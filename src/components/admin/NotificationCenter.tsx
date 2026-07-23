'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Bell, Send, Users, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../../types';

export const NotificationCenter: React.FC = () => {
  const { notifications, sendNotification } = useERP();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<NotificationItem['category']>('School Holiday');
  const [targetAudience, setTargetAudience] = useState<NotificationItem['targetAudience']>('Everyone');
  const [targetClassSection, setTargetClassSection] = useState('5-A');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    sendNotification({
      title,
      message,
      category,
      targetAudience,
      targetClassSection: targetAudience === 'Selected Classes' ? targetClassSection : undefined,
      senderName: 'Principal & Admin Office',
      senderRole: 'ADMIN',
    });

    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">
            Multi-Channel Broadcast Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Notification & Communication Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch announcements across Web App, SMS, and WhatsApp to Students, Parents, and Teaching Staff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Broadcast Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            Compose Broadcast Announcement
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Notification Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="School Holiday">School Holiday (Receiver: Everyone)</option>
                <option value="Fee Reminder">Fee Reminder (Receiver: Selected Students)</option>
                <option value="Staff Meeting">Staff Meeting (Receiver: Teachers Only)</option>
                <option value="Homework">Homework Notice (Receiver: Parents)</option>
                <option value="Exam Schedule">Exam Schedule (Receiver: Specific Classes)</option>
                <option value="Emergency Alert">Emergency Alert (Receiver: Everyone)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Target Receiver Audience *</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Everyone">Everyone (All Students, Parents & Teachers)</option>
                <option value="Teachers Only">Teachers Only</option>
                <option value="Selected Classes">Selected Classes (e.g. 5-A)</option>
                <option value="Individual Parents">Individual Parents</option>
              </select>
            </div>

            {targetAudience === 'Selected Classes' && (
              <div>
                <label className="block font-medium text-slate-300 mb-1">Class & Section</label>
                <input
                  type="text"
                  placeholder="e.g. 5-A"
                  value={targetClassSection}
                  onChange={(e) => setTargetClassSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-300 mb-1">Announcement Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer Vacation Announcement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Detailed Message *</label>
              <textarea
                rows={4}
                required
                placeholder="Type your official announcement here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement Now</span>
            </button>
          </div>
        </form>

        {/* Right Column: Sent Announcement Feed */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            Sent School Announcements History
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {n.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Audience: {n.targetAudience} {n.targetClassSection ? `(${n.targetClassSection})` : ''}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{n.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>

                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-700/40 flex items-center justify-between">
                  <span>Sent by: {n.senderName} ({n.senderRole})</span>
                  <span className="text-emerald-400 font-semibold">✓ Delivered via App & SMS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
