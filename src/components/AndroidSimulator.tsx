import React, { useState } from 'react';
import { TenantFacility, Employee, AttendanceLog } from '../types';
import { Shield, MapPin, Fingerprint, Syringe, WifiOff, RefreshCw, AlertTriangle, UserCheck, Smartphone, Wifi } from 'lucide-react';

interface AndroidSimulatorProps {
  facilities: TenantFacility[];
  employees: Employee[];
  isOffline: boolean;
  onAttendanceLog: (log: AttendanceLog) => void;
  onOutbreakReport: (outbreak: { diseaseName: string; locationWoreda: string; cases: number }) => void;
  onVaccineAdminister: (campaignId: string, doses: number) => void;
  onOfflineSync: () => void;
  syncQueueLength: number;
}

export default function AndroidSimulator({
  facilities,
  employees,
  isOffline,
  onAttendanceLog,
  onOutbreakReport,
  onVaccineAdminister,
  onOfflineSync,
  syncQueueLength
}: AndroidSimulatorProps) {
  const [phoneApp, setPhoneApp] = useState<'punch' | 'outbreak' | 'vaccine' | 'sync'>('punch');

  // App 1: Biometric Punch states
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || 'EMP-01');
  const [punchMethod, setPunchMethod] = useState<'GPS' | 'Fingerprint' | 'Face Recognition'>('Fingerprint');
  const [punchSuccess, setPunchSuccess] = useState('');

  // App 2: Outbreak states
  const [diseaseName, setDiseaseName] = useState('Amoebic Dysentery');
  const [locationWoreda, setLocationWoreda] = useState('Babile Woreda');
  const [cases, setCases] = useState(12);
  const [outbreakSuccess, setOutbreakSuccess] = useState('');

  // App 3: Vaccine states
  const [campaignId, setCampaignId] = useState('POLIO-OUTREACH-2026');
  const [doses, setDoses] = useState(45);
  const [vaccineSuccess, setVaccineSuccess] = useState('');

  const handlePunch = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];
    
    const newLog: AttendanceLog = {
      id: `ATT-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      date: new Date().toISOString().split('T')[0],
      checkIn: new Date().toLocaleTimeString(),
      checkOut: null,
      status: 'Present',
      method: punchMethod,
      gpsLocation: { lat: 9.032, lng: 38.745 },
      gpsVerified: true,
      overtimeHours: 0
    };

    onAttendanceLog(newLog);
    setPunchSuccess(`Check-in verified via ${punchMethod} biometric matching!`);
    setTimeout(() => setPunchSuccess(''), 3000);
  };

  const handleOutbreakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOutbreakReport({
      diseaseName,
      locationWoreda,
      cases: Number(cases) || 1
    });
    setOutbreakSuccess('Epidemic outbreak alert transmitted to central registry.');
    setTimeout(() => setOutbreakSuccess(''), 3000);
  };

  const handleVaccineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVaccineAdminister(campaignId, Number(doses) || 1);
    setVaccineSuccess(`Successfully tracked ${doses} campaign outreach doses.`);
    setTimeout(() => setVaccineSuccess(''), 3000);
  };

  return (
    <div className="w-80 h-[560px] bg-slate-900 border-[10px] border-slate-950 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col font-sans mb-6">
      
      {/* Speaker and Camera Notch Mock */}
      <div className="absolute top-0 inset-x-0 h-4 bg-slate-950 flex items-center justify-center z-20">
        <div className="w-16 h-3 bg-slate-900 rounded-full flex gap-1.5 items-center justify-center px-1">
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Android Status Bar */}
      <div className="bg-slate-950 h-5 px-6 pt-1.5 flex justify-between select-none text-[8.5px] font-mono text-slate-400 z-10 font-bold">
        <span>MUSTALI CLIENT v2.4</span>
        <div className="flex items-center gap-1.5">
          {isOffline ? (
            <div className="flex items-center gap-1 text-rose-400">
              <WifiOff className="w-2.5 h-2.5" />
              <span>CACHING</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-2.5 h-2.5" />
              <span>STABLE</span>
            </div>
          )}
          <span>17:15 UTC</span>
        </div>
      </div>

      {/* Screen Area */}
      <div className="flex-1 bg-slate-950 p-4 pt-3 flex flex-col justify-between overflow-hidden">
        
        {/* Active Application Area */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
          
          {phoneApp === 'punch' && (
            <form onSubmit={handlePunch} className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">M-Biometrics</span>
                <h4 className="text-white text-xs font-bold uppercase mt-0.5">Staff Shift Check-in</h4>
              </div>

              {punchSuccess ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-900 rounded-xl text-center space-y-2">
                  <div className="w-8 h-8 bg-emerald-900 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Fingerprint className="w-4 h-4 animate-ping" />
                  </div>
                  <p className="text-[10px] text-emerald-300 font-medium leading-normal">{punchSuccess}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Select Employee ID</label>
                    <select
                      value={selectedEmpId}
                      onChange={(e) => setSelectedEmpId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-[11px] font-medium focus:outline-none"
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Matching Method</label>
                    <select
                      value={punchMethod}
                      onChange={(e) => setPunchMethod(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-[11px] font-medium focus:outline-none"
                    >
                      <option value="Fingerprint">☝ Biometric Fingerprint</option>
                      <option value="Face Recognition">📸 Biometric Facial Match</option>
                      <option value="GPS">📍 Geolocation Verification</option>
                    </select>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                    <MapPin className="text-sky-400 w-4 h-4 shrink-0" />
                    <div className="text-[9.5px] text-slate-400 leading-normal">
                      <span>Mock Geofence Area: Babile Clinic</span>
                      <span className="block text-[8px] text-sky-500 font-mono mt-0.5 font-bold">ACCURACY MATCH: 0.8 meters</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Fingerprint className="w-4 h-4" /> Match & Punch Shift
                  </button>
                </>
              )}
            </form>
          )}

          {phoneApp === 'outbreak' && (
            <form onSubmit={handleOutbreakSubmit} className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-orange-400 uppercase font-bold tracking-wider">M-Epidemic Gateway</span>
                <h4 className="text-white text-xs font-bold uppercase mt-0.5">Hotspot Alert Dispatch</h4>
              </div>

              {outbreakSuccess ? (
                <div className="p-3 bg-orange-950/80 border border-orange-900 rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 bg-orange-900/60 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-orange-300 font-medium leading-normal">{outbreakSuccess}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Etiology Disease *</label>
                    <select
                      value={diseaseName}
                      onChange={(e) => setDiseaseName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-[11px] font-medium focus:outline-none font-sans"
                    >
                      <option value="Amoebic Dysentery">Amoebic Dysentery</option>
                      <option value="Malaria Hazard">Malaria Hazard</option>
                      <option value="Acute Cholera Alert">Acute Cholera Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Target Woreda Location</label>
                    <input
                      type="text"
                      required
                      value={locationWoreda}
                      onChange={(e) => setLocationWoreda(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-[11px] font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Symptomatic Cases count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={cases}
                      onChange={(e) => setCases(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-[11px] font-medium focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <AlertTriangle className="w-4 h-4 animate-bounce" /> Dispatch Warning File
                  </button>
                </>
              )}
            </form>
          )}

          {phoneApp === 'vaccine' && (
            <form onSubmit={handleVaccineSubmit} className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">M-Immunizations Ledger</span>
                <h4 className="text-white text-xs font-bold uppercase mt-0.5">Track Campaign Outreaches</h4>
              </div>

              {vaccineSuccess ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-900 rounded-xl text-center space-y-2">
                  <div className="w-8 h-8 bg-emerald-900 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Syringe className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-emerald-300 font-medium leading-normal">{vaccineSuccess}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Campaign Campaign Code</label>
                    <input
                      type="text"
                      required
                      value={campaignId}
                      onChange={(e) => setCampaignId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-2.5 py-1.5 text-[11px] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Doses Administered</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={doses}
                      onChange={(e) => setDoses(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-[10px] py-[6px] text-[11px] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Syringe className="w-4 h-4 animate-pulse" /> Post Outreach Dose Ledger
                  </button>
                </>
              )}
            </form>
          )}

          {phoneApp === 'sync' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-yellow-500 uppercase font-bold tracking-wider">M-Buffer Synchronization</span>
                <h4 className="text-white text-xs font-bold uppercase mt-0.5">Decoupled SQLite Sockets</h4>
              </div>

              <div className="bg-slate-900 p-4 border border-slate-850 rounded-2xl text-[10px] leading-relaxed space-y-2 text-slate-400">
                <div>NETWORK: <span className={isOffline ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{isOffline ? 'OFFLINE GATED' : 'ONLINE STABLE'}</span></div>
                <div>LOCAL BUFFER QUEUE: <span className="text-sky-400 font-bold font-mono">{syncQueueLength} files pending</span></div>
                <div className="pt-2 border-t border-slate-800 font-sans text-slate-505">
                  When offline is enabled, the mobile applet stores attendance, outbreaks, and vaccine doses locally. Restoring the link triggers temporal merge-conflict resolution rules.
                </div>
              </div>

              <button
                type="button"
                onClick={onOfflineSync}
                className={`w-full font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-1.5 border ${
                  isOffline
                    ? 'bg-emerald-950 border-emerald-900 text-emerald-400'
                    : 'bg-rose-950 border-rose-900 text-rose-400'
                }`}
              >
                <RefreshCw className="w-4 h-4 shrink-0 animate-spin" /> {isOffline ? 'ESTABLISH CLOUD SOCKETS' : 'DECOUPLE NETWORK TO TEST OUTAGE'}
              </button>
            </div>
          )}

        </div>

        {/* Smartphone Compact Navigation Bar at Bottom */}
        <div className="h-12 bg-slate-950/80 rounded-2xl flex justify-around items-center px-2 select-none shrink-0 border-t border-slate-850">
          <button
            onClick={() => setPhoneApp('punch')}
            className={`flex flex-col items-center justify-center w-12 h-10 transition ${
              phoneApp === 'punch' ? 'text-blue-500 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span className="text-[7.5px] uppercase mt-1">Biomet</span>
          </button>

          <button
            onClick={() => setPhoneApp('outbreak')}
            className={`flex flex-col items-center justify-center w-12 h-10 transition ${
              phoneApp === 'outbreak' ? 'text-orange-500 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[7.5px] uppercase mt-1">Alert</span>
          </button>

          <button
            onClick={() => setPhoneApp('vaccine')}
            className={`flex flex-col items-center justify-center w-12 h-10 transition ${
              phoneApp === 'vaccine' ? 'text-emerald-500 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Syringe className="w-4 h-4" />
            <span className="text-[7.5px] uppercase mt-1">Immune</span>
          </button>

          <button
            onClick={() => setPhoneApp('sync')}
            className={`flex flex-col items-center justify-center w-12 h-10 transition ${
              phoneApp === 'sync' ? 'text-yellow-500 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-[7.5px] uppercase mt-1">Sync</span>
          </button>
        </div>

      </div>

      {/* Android System Bar Navigation */}
      <div className="h-6 bg-slate-950 flex justify-center items-center shrink-0">
        <div className="w-24 h-1 bg-slate-800 rounded-full" />
      </div>

    </div>
  );
}
