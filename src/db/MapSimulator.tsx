/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { staffRouteHistories, dictionary } from '../data/mockData';
import { StaffRouteHistory, Language } from '../types';
import { Map, Navigation, Activity, Radio, Play, Pause, Compass, CheckCircle } from 'lucide-react';

interface MapSimulatorProps {
  currentLanguage: Language;
}

export default function MapSimulator({ currentLanguage }: MapSimulatorProps) {
  const t = dictionary[currentLanguage];
  const [selectedStaff, setSelectedStaff] = useState<string>(staffRouteHistories[0].employeeId);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const activeStaffHistory = staffRouteHistories.find(s => s.employeeId === selectedStaff) || staffRouteHistories[0];
  const currentCoord = activeStaffHistory.coordinates[stepIndex] || activeStaffHistory.coordinates[0];

  // Map simulation timer to simulate movement along the route
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStepIndex(prev => (prev + 1) % activeStaffHistory.coordinates.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeStaffHistory]);

  const togglePlayback = () => setIsPlaying(!isPlaying);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100" id="map-simulator-panel">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Map className="text-emerald-400 w-5 h-5" />
            {t.liveMapTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{t.staffLiveLoc}</p>
        </div>

        {/* Staff selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {staffRouteHistories.map(staff => (
            <button
              key={staff.employeeId}
              id={`select-staff-map-${staff.employeeId}`}
              onClick={() => {
                setSelectedStaff(staff.employeeId);
                setStepIndex(0);
              }}
              className={`px-3 py-1 text-xs rounded transition-all font-medium ${
                selectedStaff === staff.employeeId
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {staff.employeeName}
            </button>
          ))}
        </div>
      </div>

      {/* Grid container map + telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Simulated Map UI (2/3 width) */}
        <div className="lg:col-span-2 bg-slate-950 relative h-80 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {/* Visual Grid Layer */}
          <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }} />

          {/* Graphical Compass Overlay */}
          <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 p-2 rounded-full shadow flex items-center justify-center">
            <Compass className="w-5 h-5 text-slate-400 animate-spin-slow" />
          </div>

          {/* Active Facility Anchors represented visually on map */}
          {/* Adama General */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-blue-600 rounded-full relative border border-white" />
            <span className="text-[9px] text-blue-300 font-semibold mt-1 bg-slate-950/80 px-1 py-0.5 rounded border border-blue-900/40">
              Adama Gen
            </span>
          </div>

          {/* Bishoftu Primary */}
          <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full relative border border-white" />
            <span className="text-[9px] text-blue-300 font-semibold mt-1 bg-slate-950/80 px-1 py-0.5 rounded border border-blue-900/40">
              Bishoftu Hosp
            </span>
          </div>

          {/* Jimma General */}
          <div className="absolute bottom-1/4 left-1/6 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full relative border border-white" />
            <span className="text-[9px] text-blue-300 font-semibold mt-1 bg-slate-950/80 px-1 py-0.5 rounded border border-blue-900/40">
              Jimma Spec
            </span>
          </div>

          {/* Route Trail Line drawing connections based on coordinates list */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw active line */}
            <polyline
              points="100,100 180,140 280,200 400,240"
              fill="none"
              stroke="#047857"
              strokeWidth="2.5"
              strokeDasharray="4"
              className="animate-dash"
              id="polyline-staff-route"
            />
          </svg>

          {/* Dynamic Traveling Staff Node */}
          {/* Calculated based on coordinates step index mapping */}
          <div
            className="absolute transition-all duration-1000 ease-in-out flex flex-col items-center"
            style={{
              top: `${140 + stepIndex * 40}px`,
              left: `${180 + stepIndex * 60}px`
            }}
            id="simulated-staff-marker"
          >
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute" />
            <div className="w-4 h-4 bg-emerald-400 rounded-full relative border-2 border-white shadow-lg flex items-center justify-center">
              <Navigation className="w-2.5 h-2.5 text-slate-950 transform rotate-45" />
            </div>
            
            <div className="bg-slate-900/90 border border-emerald-500 px-2 py-1 rounded shadow-md mt-1.5 flex flex-col items-center">
              <span className="text-[9px] font-bold text-white whitespace-nowrap">
                {activeStaffHistory.employeeName}
              </span>
              <span className="text-[8px] text-emerald-300 font-mono">
                {currentCoord.time} (Active)
              </span>
            </div>
          </div>

          {/* GIS Controls Overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-3 shadow">
            <button
              id="btn-play-pause-map"
              onClick={togglePlayback}
              className="text-slate-300 hover:text-white p-1 bg-slate-800 rounded hover:bg-slate-750 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-slate-400">GPS ACCURACY: ±3.0 METERS</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Feed (1/3 width) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider mb-2">
              <Radio className="w-4 h-4 animate-bounce" />
              Active Field Telemetry
            </div>
            
            <div className="space-y-3 mt-4 text-xs">
              <div className="border-b border-slate-850 pb-2">
                <span className="text-slate-400 block text-[10px]">{t.trackRouteHistory}</span>
                <span className="font-semibold text-slate-200">{activeStaffHistory.activeDutyLocation}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-slate-850 pb-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT LONGITUDE</span>
                  <span className="font-mono font-medium text-slate-200">{currentCoord.lng}° E</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT LATITUDE</span>
                  <span className="font-mono font-medium text-slate-200">{currentCoord.lat}° N</span>
                </div>
              </div>

              <div className="border-b border-slate-850 pb-2">
                <span className="text-slate-400 block text-[10px]">REPORTED TIMESTAMP</span>
                <span className="font-mono font-semibold text-white">{currentCoord.time}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] mb-1.5">ROUTE LOG POINTS</span>
                <div className="space-y-1 font-mono text-[9px] max-h-24 overflow-y-auto pr-1">
                  {activeStaffHistory.coordinates.map((c, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-1 rounded ${
                        idx === stepIndex ? 'bg-emerald-950/50 text-emerald-300 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      <span>Checkpoint {idx+1} ({c.time})</span>
                      <span>{c.lat.toFixed(4)}, {c.lng.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850 mt-4 flex items-center gap-1.5 text-[9px] text-slate-500 font-mono leading-none">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>GEO-RADIAL PERIMETER VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
