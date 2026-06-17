/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TenantFacility, Employee, AttendanceLog } from '../types';
import { FileText, Download, Printer, CheckCircle, Table, BarChart2, Calendar, FileSpreadsheet, Building2, Users } from 'lucide-react';

interface ReportsDashboardProps {
  facilities: TenantFacility[];
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  currentLanguage: 'en' | 'om';
  userFacilityId?: string;
}

export default function ReportsDashboard({
  facilities,
  employees,
  attendanceLogs,
  currentLanguage,
  userFacilityId
}: ReportsDashboardProps) {
  const [activeReportTab, setActiveReportTab] = useState<'facilities' | 'staff' | 'attendance'>('facilities');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter sources securely if scoped to active Facility Admin
  const filteredFacilities = useMemo(() => {
    return userFacilityId ? facilities.filter(f => f.id === userFacilityId) : facilities;
  }, [facilities, userFacilityId]);

  const filteredEmployees = useMemo(() => {
    return userFacilityId ? employees.filter(e => e.facilityId === userFacilityId) : employees;
  }, [employees, userFacilityId]);

  const filteredAttendanceLogs = useMemo(() => {
    if (!userFacilityId) return attendanceLogs;
    const staffIds = new Set(filteredEmployees.map(e => e.id));
    return attendanceLogs.filter(log => staffIds.has(log.employeeId));
  }, [attendanceLogs, filteredEmployees, userFacilityId]);

  // 1. Calculations - Facility Report
  const facilityReportRows = useMemo(() => {
    return filteredFacilities.map(fac => {
      const facStaff = filteredEmployees.filter(e => e.facilityId === fac.id);
      return {
        id: fac.id,
        name: fac.name,
        code: fac.code,
        type: fac.type,
        location: `${fac.region}, ${fac.zone}`,
        staffCount: facStaff.length,
        status: fac.status,
        waiting: fac.patientsWaiting || 0,
        estWait: fac.estimatedWaitMinutes || 0
      };
    });
  }, [filteredFacilities, filteredEmployees]);

  // 2. Calculations - Staff Report
  const staffReportRows = useMemo(() => {
    return filteredEmployees.map(emp => {
      const fac = filteredFacilities.find(f => f.id === emp.facilityId);
      return {
        id: emp.id,
        name: emp.fullName,
        gender: emp.gender,
        profession: emp.profession,
        department: emp.department,
        salary: emp.salary,
        status: emp.status,
        facilityName: fac ? fac.name : 'Unassigned',
        dateOfHire: emp.dateOfHire
      };
    });
  }, [filteredEmployees, filteredFacilities]);

  // 3. Calculations - Attendance Report
  const attendanceReportRows = useMemo(() => {
    return filteredAttendanceLogs.map(log => {
      const emp = filteredEmployees.find(e => e.id === log.employeeId);
      const fac = emp ? filteredFacilities.find(f => f.id === emp.facilityId) : null;
      return {
        id: log.id,
        employeeName: log.employeeName,
        profession: emp ? emp.profession : 'N/A',
        facilityName: fac ? fac.name : 'Unknown',
        date: log.date,
        checkIn: log.checkIn,
        checkOut: log.checkOut || 'Active Duty',
        status: log.status,
        method: log.method,
        overtime: log.overtimeHours || 0
      };
    });
  }, [filteredAttendanceLogs, filteredEmployees, filteredFacilities]);

  // 4. CSV EXPORT ENGINE
  const EXPORT_CSV_HEADERS_MAPPINGS = {
    facilities: ['ID', 'Facility Name', 'District Code', 'Type', 'Location / Zone', 'Staff Assigned', 'Patients Boarded', 'Estimated Wait (Min)', 'Registration Status'],
    staff: ['Employee ID', 'Full Name', 'Gender', 'Profession', 'Department', 'Monthly Base Salary (ETB)', 'Work Status', 'Associated Tenant Clinic', 'Date Registered'],
    attendance: ['Log ID', 'Employee Name', 'Profession', 'Clinic Destination', 'Shift Date', 'Clock-In', 'Clock-Out', 'Attendance Code', 'Check-In Mode', 'Overtime (Hours)']
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let dataRows: any[] = [];
    let filename = `MustaliDIRS_${activeReportTab}_Report.csv`;

    if (activeReportTab === 'facilities') {
      headers = EXPORT_CSV_HEADERS_MAPPINGS.facilities;
      dataRows = facilityReportRows.map(f => [
        f.id, f.name, f.code, f.type, f.location, f.staffCount, f.waiting, f.estWait, f.status
      ]);
    } else if (activeReportTab === 'staff') {
      headers = EXPORT_CSV_HEADERS_MAPPINGS.staff;
      dataRows = staffReportRows.map(s => [
        s.id, s.name, s.gender, s.profession, s.department, s.salary, s.status, s.facilityName, s.dateOfHire
      ]);
    } else {
      headers = EXPORT_CSV_HEADERS_MAPPINGS.attendance;
      dataRows = attendanceReportRows.map(a => [
        a.id, a.employeeName, a.profession, a.facilityName, a.date, a.checkIn, a.checkOut, a.status, a.method, a.overtime
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...dataRows.map(row => row.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create a data blob or direct anchor download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Exported ${activeReportTab} roster to Excel successfully.`);
  };

  // 5. PDF PRINT / EXPORT ENGINE
  const handleExportPDF = () => {
    // Elegant system print trigger
    window.print();
    triggerToast("Initiated system-level print layout for PDF output.");
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const t = {
    title: currentLanguage === 'en' ? 'Federal Reports & Analytics' : 'Gabaasa Ol-aanaa fi Haala Hojii',
    subtitle: currentLanguage === 'en' ? 'Compile, filter, and export professional statistics for federal audit oversight' : 'Gabaasota qopheessi, dilli, fi bu’aan hojii bulchiinsaa fi hordoffiif ol-ergi',
    facilitiesTab: currentLanguage === 'en' ? 'Health Facility Reports' : 'Gabaasota Dhaabbilee Fayyaa',
    staffTab: currentLanguage === 'en' ? 'Workforce Statistics' : 'Haala Humna Hojii Ragaa',
    attendanceTab: currentLanguage === 'en' ? 'Shift Punch Metrics' : 'Salphaa Roster Attendance',
    exportExcel: currentLanguage === 'en' ? 'Export Excel (Excel Roster)' : 'Gabaasa Excel Buufadhu',
    exportPDF: currentLanguage === 'en' ? 'Generate PDF / Print' : 'Gabaasa PDF / Print',
    totalWait: currentLanguage === 'en' ? 'Estimated Local Wait Index' : 'Tilmaama Yeroo Eegumsaa',
    statusLabel: currentLanguage === 'en' ? 'Licensing Code Status' : 'Gosa Sifaa Heyyamaa'
  };

  return (
    <div className="space-y-6" id="reports-dashboard-module">
      
      {/* Title */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600 w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase font-mono">{t.title}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Action controls */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {t.exportExcel}
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            {t.exportPDF}
          </button>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2" id="toast-success-reports">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1 select-none">
        <button
          onClick={() => setActiveReportTab('facilities')}
          className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-2 ${
            activeReportTab === 'facilities' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          {t.facilitiesTab}
        </button>

        <button
          onClick={() => setActiveReportTab('staff')}
          className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-2 ${
            activeReportTab === 'staff' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {t.staffTab}
        </button>

        <button
          onClick={() => setActiveReportTab('attendance')}
          className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-2 ${
            activeReportTab === 'attendance' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          {t.attendanceTab}
        </button>
      </div>

      {/* Roster Sheet Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        
        {/* TAB 1: FACILITY REPORTS */}
        {activeReportTab === 'facilities' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold font-mono tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Facility Identity</th>
                  <th className="p-4">District ID</th>
                  <th className="p-4">Facility Type</th>
                  <th className="p-4">Location Zone</th>
                  <th className="p-4 text-center">Assigned Workforce</th>
                  <th className="p-4 text-center">Boarded Patients</th>
                  <th className="p-4 text-center">Wait Index (Min)</th>
                  <th className="p-4">Licensing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {facilityReportRows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{row.name}</td>
                    <td className="p-4 font-mono">{row.code}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono font-bold">{row.type}</span>
                    </td>
                    <td className="p-4 text-slate-500">{row.location}</td>
                    <td className="p-4 text-center font-bold text-blue-600">{row.staffCount} Staff</td>
                    <td className="p-4 text-center font-mono font-bold text-amber-600">{row.waiting}</td>
                    <td className="p-4 text-center font-semibold">{row.estWait || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wider font-mono ${
                        row.status === 'approved' ? 'text-emerald-600' : 'text-amber-500'
                      }`}>
                        ● {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: STAFF REPORTS */}
        {activeReportTab === 'staff' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold font-mono tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Staff ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Specialty / Profession</th>
                  <th className="p-4">Department Unit</th>
                  <th className="p-4 text-right">Base Salary (ETB)</th>
                  <th className="p-4 text-center">Duty Status</th>
                  <th className="p-4">Tenant Station</th>
                  <th className="p-4">Hire Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {staffReportRows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-[10px]">{row.id}</td>
                    <td className="p-4 font-extrabold text-slate-900">{row.name}</td>
                    <td className="p-4 font-semibold text-blue-800">{row.profession}</td>
                    <td className="p-4 text-slate-500">{row.department}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-950">{row.salary.toLocaleString()} ETB</td>
                    <td className="p-4 text-center">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{row.facilityName}</td>
                    <td className="p-4 font-mono text-slate-400">{row.dateOfHire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ATTENDANCE REPORTS */}
        {activeReportTab === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold font-mono tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Employee Name</th>
                  <th className="p-4">Roster Date</th>
                  <th className="p-4">Duty Specialty</th>
                  <th className="p-4">Tenant Station</th>
                  <th className="p-4 text-center">Clock-In</th>
                  <th className="p-4 text-center">Clock-Out</th>
                  <th className="p-4 text-center">Attendance Code</th>
                  <th className="p-4">Capturing Method</th>
                  <th className="p-4 text-right">Overtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {attendanceReportRows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-extrabold text-slate-900">{row.employeeName}</td>
                    <td className="p-4 font-mono">{row.date}</td>
                    <td className="p-4 text-slate-600">{row.profession}</td>
                    <td className="p-4 text-slate-500">{row.facilityName}</td>
                    <td className="p-4 text-center font-mono text-emerald-600 font-bold">{row.checkIn}</td>
                    <td className="p-4 text-center font-mono text-slate-500">{row.checkOut}</td>
                    <td className="p-4 text-center">
                      <span className={`text-[9.5px] font-extrabold font-mono uppercase px-2 py-0.5 rounded-full ${
                        row.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        row.status === 'Late' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[10px]">{row.method}</td>
                    <td className="p-4 text-right font-mono font-bold text-indigo-600">{row.overtime} Hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
