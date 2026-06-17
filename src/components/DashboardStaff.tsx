/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Employee, AttendanceLog, ProgramEvent, Language, TrainingRecord, PayrollSlip } from '../types';
import { dictionary } from '../data/mockData';
import {
  Clock,
  MapPin,
  Fingerprint,
  PhoneCall,
  User,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FileText,
  Bookmark,
  Award,
  Video,
  Plus,
  FileCheck
} from 'lucide-react';

interface DashboardStaffProps {
  currentLanguage: Language;
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  events: ProgramEvent[];
  submitAttendanceLog: (log: AttendanceLog) => void;
  submitTrainingLog: (employeeId: string, course: TrainingRecord) => void;
  addNewAudit: (action: string, details: string) => void;
  isOffline: boolean;
  addNotificationLog: (msg: string) => void;
  payrollSlips: PayrollSlip[];
}

export default function DashboardStaff({
  currentLanguage,
  employees,
  attendanceLogs,
  events,
  submitAttendanceLog,
  submitTrainingLog,
  addNewAudit,
  isOffline,
  addNotificationLog,
  payrollSlips
}: DashboardStaffProps) {
  const t = dictionary[currentLanguage];

  // Default logged-in staff
  const [selectedStaffId, setSelectedStaffId] = useState<string>('EMP-2025-01'); // Dr. Chala Gemechu
  const [activeSubTab, setActiveSubTab] = useState<'shift' | 'training' | 'schedule'>('shift');

  const [attendStatus, setAttendStatus] = useState<'Out' | 'In'>('Out');
  const [recentLogId, setRecentLogId] = useState('');
  const [recentLogIdState, setRecentLogIdState] = useState(''); // unique to avoid overlap
  const [attendSuccess, setAttendSuccess] = useState('');

  // Course completion CPD form states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseProvider, setCourseProvider] = useState('');
  const [courseStartDate, setCourseStartDate] = useState('2026-06-01');
  const [courseEndDate, setCourseEndDate] = useState('2026-06-04');
  const [courseCpd, setCourseCpd] = useState(10);
  const [courseSuccess, setCourseSuccess] = useState('');

  // Staff Payslip modal trigger
  const [viewedSlip, setViewedSlip] = useState<PayrollSlip | null>(null);

  const activeStaff = employees.find(e => e.id === selectedStaffId) || employees[0];
  const staffAttendance = attendanceLogs.filter(log => log.employeeId === selectedStaffId);
  const staffSlips = (payrollSlips || []).filter(p => p.employeeId === selectedStaffId);

  // Punch attendance (biometrics & GPS sim)
  const handleCheckIn = (method: 'GPS' | 'Fingerprint' | 'Face Recognition') => {
    if (attendStatus === 'In') {
      alert("A shift is already active. Please Punch Out of your current shift before launching a new one.");
      return;
    }

    const checkTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logId = `ATT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLog: AttendanceLog = {
      id: logId,
      employeeId: selectedStaffId,
      employeeName: activeStaff.fullName,
      date: new Date().toISOString().split('T')[0],
      checkIn: checkTimeStr,
      checkOut: null,
      status: 'Present',
      method,
      gpsLocation: { lat: 8.5414, lng: 39.2689 },
      gpsVerified: true,
      overtimeHours: 0
    };

    submitAttendanceLog(newLog);
    setAttendStatus('In');
    setRecentLogId(logId);
    addNewAudit('MEMBER_CHECK_IN', `${activeStaff.fullName} completed checked-in punch using verified biometric ${method}`);
    addNotificationLog(`[SMS Gateway] Punch-In Alert: Employee ${activeStaff.fullName} checked-in securely at ${checkTimeStr} over biometric ${method}.`);

    setAttendSuccess(`Checked In successfully via ${method}!`);
    setTimeout(() => setAttendSuccess(''), 4000);
  };

  const handleCheckOut = () => {
    if (attendStatus === 'Out') {
      alert("No shift is currently active to register checkout.");
      return;
    }

    const checkTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Find active log in list to append checkout
    const logIndex = attendanceLogs.findIndex(log => log.id === recentLogId);
    if (logIndex !== -1) {
      attendanceLogs[logIndex].checkOut = checkTimeStr;
      attendanceLogs[logIndex].overtimeHours = 1.5; // default overtime simulated
    }

    setAttendStatus('Out');
    setRecentLogId('');
    addNewAudit('MEMBER_CHECK_OUT', `${activeStaff.fullName} checked-out shift. Collected 1.5 hours registered overtime.`);
    addNotificationLog(`[SMS Gateway] Punch-Out Alert: Employee ${activeStaff.fullName} punched-out. Logged 1.5hrs overtime.`);
    
    setAttendSuccess(`Checked Out successfully at ${checkTimeStr}! Shift Overtime: 1.5 hours.`);
    setTimeout(() => setAttendSuccess(''), 4000);
  };

  // Submit Training CPD
  const handleTrainingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseProvider) {
      alert("Please specify the course training title & accredited provider.");
      return;
    }

    const newRecord: TrainingRecord = {
      id: `T-${Math.floor(100 + Math.random() * 900)}`,
      title: courseTitle,
      provider: courseProvider,
      startDate: courseStartDate,
      endDate: courseEndDate,
      cpdPoints: Number(courseCpd),
      status: 'Completed',
      certificateUrl: `scanned_cpd_cert_${Math.floor(10 + Math.random() * 90)}.pdf`
    };

    submitTrainingLog(selectedStaffId, newRecord);
    addNewAudit('MEMBER_CPD_SUBMIT', `${activeStaff.fullName} logged certificate for: ${courseTitle}. Added ${courseCpd} CPD credits.`);
    setCourseSuccess(`CPD certificate successfully logged! Received ${courseCpd} points.`);
    
    // reset training values
    setCourseTitle('');
    setCourseProvider('');
    setTimeout(() => setCourseSuccess(''), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 text-slate-100" id="staff-portal-root">
      
      {/* Header Profile section */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <User className="text-emerald-500 w-5 h-5 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">{t.employeePortal}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access secure check-ins, monthly payslips, duty calendar rosters, and submit certified CPD credits.
          </p>
        </div>

        {/* Selected Staff Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono font-medium">Logged-In Staff:</span>
          <select
            value={selectedStaffId}
            onChange={(e) => {
              setSelectedStaffId(e.target.value);
              setAttendStatus('Out');
            }}
            id="switch-logged-staff-select"
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-400 outline-none"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff profile summary header */}
      <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Employee Name & Position</span>
          <p className="text-sm font-extrabold text-white">{activeStaff.fullName}</p>
          <span className="text-[10px] text-emerald-400 font-mono">{activeStaff.id} • {activeStaff.profession}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Department assignment</span>
          <p className="text-xs font-semibold text-slate-200 mt-1">{activeStaff.department}</p>
          <span className="text-[10px] text-slate-400">{activeStaff.position}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Base Remunerative Salary</span>
          <p className="text-xs font-extrabold text-[#111827] text-white mt-1">{activeStaff.salary} ETB / month</p>
          <span className="text-[10px] text-slate-400">Date Hired: {activeStaff.dateOfHire}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Active Shift Status</span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${attendStatus === 'In' ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
            <span className={`text-xs font-bold ${attendStatus === 'In' ? 'text-emerald-400' : 'text-slate-400'}`}>
              {attendStatus === 'In' ? 'ACTIVE ON SHIFT' : 'OFF DUTY'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub tabs inside staff console */}
      <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-850 mt-6 max-w-sm">
        <button
          id="btn-staff-sub-shift"
          onClick={() => setActiveSubTab('shift')}
          className={`flex-1 text-center py-1.5 text-xs font-semibold rounded transition ${
            activeSubTab === 'shift' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Check-In & Slips
        </button>
        <button
          id="btn-staff-sub-training"
          onClick={() => setActiveSubTab('training')}
          className={`flex-1 text-center py-1.5 text-xs font-semibold rounded transition ${
            activeSubTab === 'training' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Logging CPD
        </button>
        <button
          id="btn-staff-sub-schedule"
          onClick={() => setActiveSubTab('schedule')}
          className={`flex-1 text-center py-1.5 text-xs font-semibold rounded transition ${
            activeSubTab === 'schedule' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Duty Calendar
        </button>
      </div>

      <div className="mt-6">

        {/* STAFF SUBTAB 1: BIOMETRICS CHECK-INS AND PAYSLIP HISTORIES */}
        {activeSubTab === 'shift' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Punch console and history */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 block tracking-wider uppercase">Biometric and GPS Punch-In console</h3>
                
                {attendSuccess && (
                  <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-xs">
                    ✔️ {attendSuccess}
                  </div>
                )}

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 text-center space-y-4">
                  <div className="flex justify-center gap-3">
                    <button
                      id="btn-punch-gps"
                      disabled={attendStatus === 'In'}
                      onClick={() => handleCheckIn('GPS')}
                      className="bg-sky-950 hover:bg-sky-900 border border-sky-800 disabled:opacity-40 transition py-3 px-4 rounded-xl text-sky-200 text-xs flex flex-col items-center gap-1.5 flex-1"
                    >
                      <MapPin className="w-5 h-5 text-sky-400 animate-pulse" />
                      {t.gpsAttendance}
                    </button>
                    <button
                      id="btn-punch-fingerprint"
                      disabled={attendStatus === 'In'}
                      onClick={() => handleCheckIn('Fingerprint')}
                      className="bg-purple-950 hover:bg-purple-900 border border-purple-800 disabled:opacity-40 transition py-3 px-4 rounded-xl text-purple-200 text-xs flex flex-col items-center gap-1.5 flex-1"
                    >
                      <Fingerprint className="w-5 h-5 text-purple-400" />
                      {t.fingerprintSim}
                    </button>
                  </div>

                  {attendStatus === 'In' ? (
                    <button
                      id="btn-punch-checkout"
                      onClick={handleCheckOut}
                      className="w-full bg-rose-600 hover:bg-rose-700 transition font-bold py-3.5 rounded-lg text-white text-xs flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" /> Punch Out Shift Duty Now
                    </button>
                  ) : (
                    <div className="text-xs text-slate-500 italic">
                      Verify biometric face or check GPS location bounds to initiate morning shift duty clock.
                    </div>
                  )}
                </div>

                {/* Personal attendance history */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Personal Attendance Registry</span>
                  <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden text-xs divide-y divide-slate-850">
                    {staffAttendance.map(log => (
                      <div key={log.id} className="p-3 flex justify-between items-center bg-slate-950/20">
                        <div>
                          <span className="font-semibold text-slate-200">{log.date}</span>
                          <span className="block text-[10px] text-slate-500">Method used: {log.method}</span>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-950 border border-emerald-900 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            {log.checkIn} - {log.checkOut || 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* FULL WIDTH SECTION: CERTIFIED MONTHLY PAYSLIPS & TRANSFER STATEMENT */}
            <div className="mt-8 border-t border-slate-850 pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Certified Ledger Payslips</h4>
                  <p className="text-[11px] text-slate-500">Official monthly digital payout rosters, tax withholding tokens, and biometric overtime audit records.</p>
                </div>
                <span className="bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px] px-2.5 py-1 rounded">Roster ID: June 2026</span>
              </div>

              {staffSlips.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 border border-slate-850 rounded-xl text-slate-500 text-xs italic">
                  No certified payslips found on system roster for your Employee Profile.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffSlips.map(slip => (
                    <div key={slip.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 hover:border-slate-700 transition relative overflow-hidden flex flex-col justify-between">
                      {/* Status flag */}
                      <span className={`absolute top-0 right-0 text-[8px] font-mono font-bold px-2 py-0.5 rounded-bl block text-white ${
                        slip.status === 'Paid' ? 'bg-emerald-600' :
                        slip.status === 'Approved' ? 'bg-blue-600' :
                        slip.status === 'Under Review' ? 'bg-amber-600' : 'bg-slate-800'
                      }`}>
                        {slip.status.toUpperCase()}
                      </span>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block">LEDGER ID: {slip.id}</span>
                        <h5 className="text-xs font-bold text-white mt-1">{slip.month} Earnings Statement</h5>
                        <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                          <div className="flex justify-between">
                            <span>Base Salary Rate:</span>
                            <span className="font-mono text-slate-200">{slip.basicSalary.toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Biometric Overtime Pay:</span>
                            <span className="font-mono text-emerald-400">+{slip.overtimeAmount.toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regulatory Deductions:</span>
                            <span className="font-mono text-rose-500">-{slip.deductions.toLocaleString()} ETB</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Net take-home</span>
                          <span className="text-sm font-extrabold text-white font-mono">{slip.netSalary.toLocaleString()} ETB</span>
                        </div>
                        <button
                          onClick={() => setViewedSlip(slip)}
                          className="bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 text-[10.5px] py-1 px-2 rounded-lg transition"
                        >
                          View Statement 📄
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HIGH-FIDELITY PRINT-READY DOCUMENT MODAL */}
            {viewedSlip && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in print:bg-white print:absolute print:inset-0">
                <div className="bg-white text-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col justify-between border print:border-0 print:shadow-none print:my-0">
                  
                  {/* Actions Header (hidden on print) */}
                  <div className="bg-slate-950 text-white p-4 flex items-center justify-between gap-4 print:hidden border-b border-slate-850">
                    <div className="flex items-center gap-2">
                      <FileCheck className="text-emerald-400 w-5 h-5 animate-pulse" />
                      <h4 className="font-extrabold text-xs tracking-wider uppercase">Official Remuneration Statement Visualizer</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => window.print()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition"
                      >
                        Print Statement 🖨️
                      </button>
                      <button
                        onClick={() => setViewedSlip(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1.5 px-3 rounded-lg transition"
                      >
                        Close Panel
                      </button>
                    </div>
                  </div>

                  {/* PRINT-OPTIMIZED SLIP CONTENT BODY */}
                  <div className="p-8 space-y-6 text-slate-850 font-sans print:p-0" id="printable-payslip-canvas">
                    
                    {/* Official Banner Header */}
                    <div className="text-center pb-4 border-b-2 border-double border-slate-300">
                      <span className="text-[10px] tracking-widest uppercase font-extrabold text-slate-400 block font-mono">FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA</span>
                      <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">MUSTALI REGIONAL STATE HEALTH BUREAU</h3>
                      <span className="text-[11px] font-bold text-blue-600 block sm:inline">OFFICIAL DIGITAL EARNINGS STATEMENT</span>
                      <span className="text-xs text-slate-500 font-semibold block sm:inline sm:before:content-['•_']">{viewedSlip.month}</span>
                    </div>

                    {/* Metadata particulars split */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] block">EMPLOYEE IDENTITY:</span>
                          <span className="font-extrabold text-slate-900">{viewedSlip.employeeName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] block">OFFICIAL EMPLOYEE ID:</span>
                          <span className="font-mono text-blue-600 font-bold">{viewedSlip.employeeId}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] block">EMPLOYING HEALTH POSITION:</span>
                          <span className="font-bold text-slate-850">{activeStaff.position} ({activeStaff.department})</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-right">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] block">LEDGER PAYSLIP SERIAL:</span>
                          <span className="font-mono text-slate-700 font-semibold">{viewedSlip.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] block">VERIFICATION TIMESTAMP:</span>
                          <span className="font-mono text-slate-500">{new Date(viewedSlip.payslipGeneratedAt).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] block">TRANSFER STATUS:</span>
                          <span className="font-bold text-emerald-600">{viewedSlip.status.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Biometric logs audit checks (very important metrics) */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-150 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                      <div>
                        <span className="block text-slate-400 font-sans uppercase text-[7px] font-extrabold">Active Work Days</span>
                        <span className="font-extrabold text-slate-800">{viewedSlip.actualWorkDays || 20} Days</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-sans uppercase text-[7px] font-extrabold">Absent Deductions</span>
                        <span className="font-extrabold text-slate-800">{viewedSlip.absentDays || 0} Days penalized</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-sans uppercase text-[7px] font-extrabold">Roster Night Overtime</span>
                        <span className="font-extrabold text-slate-800">{viewedSlip.overtimeHoursWorked || 0} Hours approved</span>
                      </div>
                    </div>

                    {/* Financial ledger breakdown (earnings vs deductions) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      
                      {/* Sub-table 1: Gross earnings */}
                      <div className="space-y-2 border-r pr-4 border-dashed border-slate-200 print:border-r-0">
                        <span className="font-bold text-slate-900 border-b pb-1.5 block uppercase tracking-wide text-[9px] text-emerald-600">💸 Remunerative Earnings</span>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Base salary counterpart pay:</span>
                            <span className="font-semibold text-slate-800">{viewedSlip.basicSalary.toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Biometric standard overtime:</span>
                            <span className="font-semibold text-emerald-600">+{viewedSlip.overtimeAmount.toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Housing allowance benefit:</span>
                            <span className="font-semibold text-slate-750">+{viewedSlip.allowanceHousing ? viewedSlip.allowanceHousing.toLocaleString() : Math.floor(viewedSlip.basicSalary * 0.05).toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Transportation match:</span>
                            <span className="font-semibold text-slate-755">+{viewedSlip.allowanceTransport ? viewedSlip.allowanceTransport.toLocaleString() : Math.floor(viewedSlip.basicSalary * 0.04).toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between pb-2 border-t font-extrabold text-slate-900">
                            <span>TOTAL GROSS REMUNERATION:</span>
                            <span>{ (viewedSlip.basicSalary + viewedSlip.overtimeAmount + (viewedSlip.allowanceHousing || Math.floor(viewedSlip.basicSalary * 0.05)) + (viewedSlip.allowanceTransport || Math.floor(viewedSlip.basicSalary * 0.04)) + (viewedSlip.allowanceDanger || 0)).toLocaleString() } ETB</span>
                          </div>
                        </div>
                      </div>

                      {/* Sub-table 2: Withheld deductions */}
                      <div className="space-y-2">
                        <span className="font-bold text-slate-900 border-b pb-1.5 block uppercase tracking-wide text-[9px] text-rose-500">🛑 Required Withholding Deductions</span>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Federal income tax levy:</span>
                            <span className="font-semibold text-slate-800">-{viewedSlip.incomeTax ? viewedSlip.incomeTax.toLocaleString() : Math.floor(viewedSlip.basicSalary * 0.15).toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Standard pension allocation (7%):</span>
                            <span className="font-semibold text-slate-800">-{viewedSlip.pensionEmployee ? viewedSlip.pensionEmployee.toLocaleString() : Math.floor(viewedSlip.basicSalary * 0.07).toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Absence pro-rated penalty:</span>
                            <span className="font-semibold text-rose-500">-{viewedSlip.absentDays ? Math.floor((viewedSlip.basicSalary / 20) * viewedSlip.absentDays).toLocaleString() : 0} ETB</span>
                          </div>
                          <div className="flex justify-between font-extrabold pt-2 border-t text-slate-900">
                            <span>TOTAL REGULATORY DEDUCTIONS:</span>
                            <span>{viewedSlip.deductions.toLocaleString()} ETB</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Sovereign approval seal & Signature box */}
                    <div className="pt-4 border-t-2 border-dashed border-slate-200 mt-4 flex flex-wrap items-center justify-between text-xs gap-4">
                      <div className="bg-slate-50 border p-3 rounded-xl border-dashed">
                        <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block tracking-wide">Net take-home compensation:</span>
                        <span className="text-base font-black text-slate-900 font-mono tracking-tight">{viewedSlip.netSalary.toLocaleString()} ETB</span>
                      </div>

                      <div className="text-right border-l-4 border-emerald-500 pl-4 py-1.5 max-w-xs">
                        <span className="text-[9px] uppercase font-extrabold text-emerald-600 block tracking-wider">🔒 STATE DISBURSEMENT SEALED</span>
                        <p className="text-[10px] font-semibold text-slate-500">Certified by Regional Registry of Health Services. Direct deposit confirmed.</p>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="text-center text-[9px] text-slate-400 font-medium italic pt-2 border-t">
                      This digital cryptographically verified document replaces physical receipt obligations under Federal civil-service pay rosters.
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STAFF SUBTAB 2: LOG ACCREDITED TRAINING CPD */}
        {activeSubTab === 'training' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-slate-950 p-4 border border-indigo-950 rounded-xl text-xs text-slate-300">
              <h4 className="font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Award className="text-indigo-400 w-4 h-4 animate-bounce" />
                Specialized Professional training Certificate Form
              </h4>
              Accredit your CPD points directly inside your facility HRMS archive. Fields with * must be verified.
            </div>

            {courseSuccess && (
              <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-xs">
                ✔️ {courseSuccess}
              </div>
            )}

            <form onSubmit={handleTrainingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Accredited Course / Training Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Pediatric Cardiac Resuscitation"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Accredited Training Provider *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World Health Organization (WHO) Ethiopia Bureau"
                  value={courseProvider}
                  onChange={(e) => setCourseProvider(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={courseStartDate}
                    onChange={(e) => setCourseStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={courseEndDate}
                    onChange={(e) => setCourseEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">CPD Points *</label>
                  <select
                    value={courseCpd}
                    onChange={(e) => setCourseCpd(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                  >
                    <option value={5}>5 Points</option>
                    <option value={10}>10 Points</option>
                    <option value={15}>15 Points</option>
                    <option value={20}>20 Points</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-3 uppercase rounded-lg text-white transition text-xs"
              >
                Accredit CPD Points Log
              </button>
            </form>
          </div>
        )}

        {/* STAFF SUBTAB 3: DUTY SCHEDULES CALENDAR */}
        {activeSubTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Assigned Duty On-Call Calendars</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Calendar list blocks */}
              <div className="lg:col-span-2 space-y-3">
                {events.map(evt => (
                  <div key={evt.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl relative overflow-hidden">
                    <span className="text-[10px] bg-slate-900 border px-2 py-0.5 rounded font-bold uppercase text-slate-300">
                      📅 {evt.type}
                    </span>

                    <h4 className="text-sm font-bold text-white mt-2">{evt.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{evt.description}</p>

                    <div className="mt-3 pt-2.5 border-t border-slate-850 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                      <div>
                        <span>SHIFT START:</span>
                        <p className="text-emerald-400">{new Date(evt.start).toLocaleString()}</p>
                      </div>
                      <div>
                        <span>SHIFT END:</span>
                        <p className="text-slate-300">{new Date(evt.end).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* On call notice box */}
              <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl space-y-3 h-fit">
                <div className="flex items-center gap-1 text-yellow-500 text-xs font-semibold">
                  <AlertCircle className="w-4.5 h-4.5" /> Urgent On-Call Notice
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Medical doctors and accredited emergency midwives must maintain active phone lines on-shift. If an outreach vaccination drive conflicts with emergency huddles, notify coordinators immediately.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
