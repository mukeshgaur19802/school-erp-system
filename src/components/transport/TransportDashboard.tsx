'use client';

import React from 'react';
import { useERP } from '../../context/ERPContext';
import { Bus, MapPin, Phone, Users, Clock, Radio, ShieldCheck } from 'lucide-react';

export const TransportDashboard: React.FC = () => {
  const { busRoutes, students, addToast } = useERP();

  const handleBroadcastBusDelay = (routeName: string) => {
    addToast('Bus Timing Broadcasted', `Sent live bus arrival timing updates to parents on ${routeName}.`, 'info');
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
            Transport & Fleet Logistics Center
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            School Bus & Route Management
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Assign buses, manage route stops, track transport fee enrollments, and broadcast live bus timings to parents.
          </p>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {busRoutes.map((route) => (
          <div
            key={route.id}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {route.busNumber}
                </span>
                <h3 className="font-bold text-base text-white mt-1">{route.routeName}</h3>
              </div>

              <button
                onClick={() => handleBroadcastBusDelay(route.routeName)}
                className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Broadcast Timings</span>
              </button>
            </div>

            {/* Driver Info */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Assigned Driver:</span>
                <h4 className="font-semibold text-white">{route.driverName}</h4>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>{route.driverPhone}</span>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Enrolled Students</span>
                <span className="font-bold text-white">
                  {route.enrolledStudentsCount ?? route.occupied} / {route.capacity} seats occupied
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${(((route.enrolledStudentsCount ?? route.occupied)) / route.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Route Stops */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Route Stops & Timings:
              </span>
              <div className="space-y-1.5">
                {route.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {stop.stopName}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{stop.timing ?? stop.pickupTime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
