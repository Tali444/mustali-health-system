/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TenantFacility,
  Employee,
  AttendanceLog,
  Equipment,
  NonMedicalAsset,
  PayrollSlip,
  Language,
  TrainingRecord,
} from '../types';
import { dictionary } from '../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Users,
  Briefcase,
  Layers,
  Wrench,
  DollarSign,
  UserPlus,
  TrendingUp,
  FileCheck,
  Calendar,
  Settings,
  BellRing,
  Download,
  AlertOctagon,
  Award,
  Truck,
  Plus,
  RefreshCw,
  Clock
} from 'lucide-react';

interface DashboardFacilityAdminProps {
  currentLanguage: Language;
  facilities: TenantFacility[];
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  equipment: Equipment[];
  assets: NonMedicalAsset[];
  payrollSlips: PayrollSlip[];
  addNewEmployee: (emp: Employee) => void;
  addNewAudit: (action: string, details: string) => void;
  recalculatePayroll: () => void;
  notificationsLog: string[];
  updateFacilityProfile: (facilityId: string, updatedFields: Partial<TenantFacility>) => void;
  updateEmployee: (employeeId: string, updatedFields: Partial<Employee>) => void;
  deleteEmployee: (employeeId: string) => void;
  addEquipmentRecord: (eq: Equipment) => void;
  updateEquipmentRecord: (eqId: string, updatedFields: Partial<Equipment>) => void;
  addAssetRecord: (asset: NonMedicalAsset) => void;
  updateAssetRecord: (assetId: string, updatedFields: Partial<NonMedicalAsset>) => void;
  submitAttendanceLog: (log: AttendanceLog) => void;
  userFacilityId?: string;
  updatePayrollSlip: (slipId: string, updatedFields: Partial<PayrollSlip>) => void;
}

export default function DashboardFacilityAdmin({
  currentLanguage,
  facilities,
  employees,
  attendanceLogs,
  equipment,
  assets,
  payrollSlips,
  addNewEmployee,
  addNewAudit,
  recalculatePayroll,
  notificationsLog,
  updateFacilityProfile,
  updateEmployee,
  deleteEmployee,
  addEquipmentRecord,
  updateEquipmentRecord,
  addAssetRecord,
  updateAssetRecord,
  submitAttendanceLog,
  userFacilityId,
  updatePayrollSlip
}: DashboardFacilityAdminProps) {
  const t = dictionary[currentLanguage];

  // Admin Active Tab Sections
  const [activeTab, setActiveTab] = useState<'info' | 'hrms' | 'attendance' | 'payroll' | 'inventory' | 'analytics'>('info');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(userFacilityId || 'F-101'); // Adama by default

  React.useEffect(() => {
    if (userFacilityId) {
      setSelectedFacilityId(userFacilityId);
    }
  }, [userFacilityId]);

  // Form State: Add Employee
  const [empName, setEmpName] = useState('');
  const [empGender, setEmpGender] = useState<'Male' | 'Female'>('Male');
  const [empPhone, setEmpPhone] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empProfession, setEmpProfession] = useState('Medical Doctor');
  const [empEducation, setEmpEducation] = useState('Doctor of Medicine (MD)');
  const [empDepartment, setEmpDepartment] = useState('Emergency Care Unit');
  const [empPosition, setEmpPosition] = useState('Senior Physician');
  const [empSalary, setEmpSalary] = useState<string>('24000');
  const [addEmpSuccess, setAddEmpSuccess] = useState('');

  // Editing Facility Profile & Patient Queue Stats
  const [isEditingFacility, setIsEditingFacility] = useState(false);
  const [facilityPhone, setFacilityPhone] = useState('');
  const [facilityEmail, setFacilityEmail] = useState('');
  const [facilityWoreda, setFacilityWoreda] = useState('');
  const [facilityKebele, setFacilityKebele] = useState('');
  const [facilityType, setFacilityType] = useState<any>('Health Center');
  const [facilityPatientsWaiting, setFacilityPatientsWaiting] = useState<number>(0);
  const [facilityWaitMinutes, setFacilityWaitMinutes] = useState<number>(0);

  // Manual Attendance Logging
  const [attEmployeeId, setAttEmployeeId] = useState('');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attCheckIn, setAttCheckIn] = useState('08:00');
  const [attCheckOut, setAttCheckOut] = useState('17:00');
  const [attStatus, setAttStatus] = useState<'Present' | 'Late' | 'Absent' | 'Excused'>('Present');
  const [attMethod, setAttMethod] = useState<'GPS' | 'Fingerprint' | 'Face Recognition'>('Fingerprint');
  const [attOvertime, setAttOvertime] = useState('0');
  const [attSuccess, setAttSuccess] = useState('');

  // Core Inventory & Equipment Management form states
  const [showAddEquipmentForm, setShowAddEquipmentForm] = useState(false);
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState('Diagnostic Imaging');
  const [eqSN, setEqSN] = useState('');
  const [eqSupplier, setEqSupplier] = useState('');
  const [eqWarranty, setEqWarranty] = useState('3');
  const [eqStatus, setEqStatus] = useState<'Operational' | 'Under Maintenance' | 'Needs Repair' | 'Disposed'>('Operational');

  // Core Asset Management form states
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<'Furniture' | 'Vehicles' | 'Computers' | 'Buildings' | 'Office Equipment'>('Office Equipment');
  const [assetLocation, setAssetLocation] = useState('');
  const [assetCustodian, setAssetCustodian] = useState('');
  const [assetRegNo, setAssetRegNo] = useState('');
  const [assetStatus, setAssetStatus] = useState<'In Use' | 'Transferred' | 'Under Repair' | 'Retired'>('In Use');

  // Maintenance Log Form state
  const [maintEqId, setMaintEqId] = useState<string | null>(null);
  const [maintDesc, setMaintDesc] = useState('');
  const [maintCost, setMaintCost] = useState('2500');
  const [maintTech, setMaintTech] = useState('Eng. Aster Assefa');

  // Payroll Management Module level States
  const [payrollSubTab, setPayrollSubTab] = useState<'payslips' | 'structures' | 'analytics' | 'rates'>('payslips');
  const [selectedEmpForStructure, setSelectedEmpForStructure] = useState<Employee | null>(null);
  const [structGrade, setStructGrade] = useState('Grade XII');
  const [structBaseSalary, setStructBaseSalary] = useState('');
  const [structHousing, setStructHousing] = useState('');
  const [structTransport, setStructTransport] = useState('');
  const [structDanger, setStructDanger] = useState('');
  const [structPensionRate, setStructPensionRate] = useState('0.07');
  const [structTaxRate, setStructTaxRate] = useState('0.15');
  const [structOvertimeMult, setStructOvertimeMult] = useState('1.25');
  const [structCustomDeducts, setStructCustomDeducts] = useState('0');
  const [structSuccess, setStructSuccess] = useState('');

  // Payslip Modal Interaction States
  const [viewedSlip, setViewedSlip] = useState<PayrollSlip | null>(null);
  const [editSlipId, setEditSlipId] = useState<string | null>(null);
  const [editSlipBasic, setEditSlipBasic] = useState('');
  const [editSlipOvertime, setEditSlipOvertime] = useState('');
  const [editSlipAllowances, setEditSlipAllowances] = useState('');
  const [editSlipDeductions, setEditSlipDeductions] = useState('');
  const [editSlipStatus, setEditSlipStatus] = useState<'Draft' | 'Under Review' | 'Approved' | 'Paid'>('Draft');

  // Query Filter states
  const [payrollSearchQuery, setPayrollSearchQuery] = useState('');

  // Filtering data for the active facility
  const activeFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
  const facilityEmployees = employees.filter(e => e.facilityId === selectedFacilityId);
  const facilityEquips = equipment.filter(eq => eq.facilityId === selectedFacilityId);
  const facilityAssets = assets.filter(a => a.facilityId === selectedFacilityId);
  const facilitySlips = payrollSlips.filter(p => p.facilityId === selectedFacilityId);

  // Initialize editing state when facility changes
  React.useEffect(() => {
    if (activeFacility) {
      setFacilityPhone(activeFacility.phone);
      setFacilityEmail(activeFacility.email);
      setFacilityWoreda(activeFacility.woreda);
      setFacilityKebele(activeFacility.kebele);
      setFacilityType(activeFacility.type);
      setFacilityPatientsWaiting(activeFacility.patientsWaiting);
      setFacilityWaitMinutes(activeFacility.estimatedWaitMinutes);
    }
  }, [selectedFacilityId, facilities]);

  // Form submit: Add Employee
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empPhone || !empSalary) {
      alert("Please fill in the employee's full name, phone number, and base salary.");
      return;
    }

    const newId = `EMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEmp: Employee = {
      id: newId,
      facilityId: selectedFacilityId,
      fullName: empName,
      gender: empGender,
      phone: empPhone,
      email: empEmail || 'unlisted@health.gov.et',
      address: `${activeFacility.woreda}, ${activeFacility.kebele}`,
      profession: empProfession,
      education: empEducation,
      department: empDepartment,
      position: empPosition,
      salary: parseFloat(empSalary),
      status: 'Active',
      dateOfHire: new Date().toISOString().split('T')[0],
      trainingHistory: [],
      attendanceSummary: { present: 0, late: 0, excused: 0, overtimeHours: 0 }
    };

    addNewEmployee(newEmp);
    addNewAudit('HRMS_ADD_EMPLOYEE', `Facility Admin added employee: ${newEmp.fullName} (${newEmp.id}) to ${activeFacility.name}`);
    setAddEmpSuccess(`Employee registered: ${newEmp.fullName} (ID: ${newId})`);
    
    // reset form fields
    setEmpName('');
    setEmpPhone('');
    setEmpEmail('');
    setEmpSalary('24000');

    setTimeout(() => {
      setAddEmpSuccess('');
    }, 4500);
  };

  // Re-calculate payroll trigger
  const runPayrollRecalculation = () => {
    recalculatePayroll();
    addNewAudit('PAYROLL_RECALCULATE', `Recalculated facility base payroll slips based on overtime, leave, and tax schedules.`);
  };

  // Payroll Excel/CSV Exporter
  const handleExportPayrollCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Serial ID,Employee ID,Employee Name,Month,Grade,Base Salary,Actual Work Days,Absent Days,Overtime Hours,Overtime Earned,Allowances,Deductions,Net Take-Home Pay,Status,Processed At\n";
    
    facilitySlips.forEach(slip => {
      const row = [
        slip.id,
        slip.employeeId,
        `"${slip.employeeName}"`,
        slip.month,
        slip.grade || "N/A",
        slip.basicSalary,
        slip.actualWorkDays || 20,
        slip.absentDays || 0,
        slip.overtimeHoursWorked || 0,
        slip.overtimeAmount,
        slip.allowances,
        slip.deductions,
        slip.netSalary,
        slip.status,
        slip.payslipGeneratedAt
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MUSTALI_DIRS_Payroll_${activeFacility.name.replace(/ /g, '_')}_June2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNewAudit('PAYROLL_EXCEL_EXPORT', `Exported monthly bank payroll spreadsheet (.csv) for ${facilitySlips.length} employees in ${activeFacility.name}.`);
  };

  // Save employee's Salary Structure Details
  const handleSaveSalaryStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpForStructure) return;

    const baseSalary = Number(structBaseSalary);
    const housing = Number(structHousing);
    const transport = Number(structTransport);
    const danger = Number(structDanger);
    const pension = Number(structPensionRate);
    const tax = Number(structTaxRate);
    const otMult = Number(structOvertimeMult);
    const customDeduct = Number(structCustomDeducts);

    const salaryStructure = {
      grade: structGrade,
      housingAllowance: housing,
      transportAllowance: transport,
      dangerAllowance: danger,
      pensionRate: pension,
      taxRate: tax,
      hourlyOvertimeMultiplier: otMult,
      customDeductions: customDeduct
    };

    updateEmployee(selectedEmpForStructure.id, {
      salary: baseSalary,
      salaryStructure
    });

    setStructSuccess(`Structure updated successfully for ${selectedEmpForStructure.fullName}! Recalculating...`);
    addNewAudit('SALARY_STRUCTURE_SET', `Set salary structure Grade: ${structGrade}, Base: ${baseSalary} ETB, for employee: ${selectedEmpForStructure.fullName}`);

    // Trigger payroll recalculation immediately to update the slips
    setTimeout(() => {
      recalculatePayroll();
      setStructSuccess('');
      setSelectedEmpForStructure(null);
    }, 1500);
  };

  // Edit / Override specific payslip manually
  const handleSaveSpecificPayslip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlipId) return;

    const basic = Number(editSlipBasic);
    const overtime = Number(editSlipOvertime);
    const allow = Number(editSlipAllowances);
    const deduct = Number(editSlipDeductions);
    const net = basic + overtime + allow - deduct;

    updatePayrollSlip(editSlipId, {
      basicSalary: basic,
      overtimeAmount: overtime,
      allowances: allow,
      deductions: deduct,
      netSalary: net,
      status: editSlipStatus,
      payslipGeneratedAt: new Date().toISOString()
    });

    addNewAudit('PAYSLIP_MANUAL_ADJUST', `Manual adjustments saved on payslip ID: ${editSlipId}. Verified Net Take-Home: ${net} ETB.`);
    setEditSlipId(null);
  };

  // Bulk Status Transitions
  const handleBulkStatusChange = (newStatus: 'Draft' | 'Under Review' | 'Approved' | 'Paid' | 'Processing') => {
    facilitySlips.forEach(slip => {
      updatePayrollSlip(slip.id, { status: newStatus });
    });
    addNewAudit('PAYROLL_BULK_TRANSITION', `Roster slips batch transition to: ${newStatus} for ${facilitySlips.length} employees in ${activeFacility.name}.`);
  };

  // Save edited Facility Profile and patient wait times / patient statistics
  const handleUpdateFacilityProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFacilityProfile(selectedFacilityId, {
      phone: facilityPhone,
      email: facilityEmail,
      woreda: facilityWoreda,
      kebele: facilityKebele,
      type: facilityType,
      patientsWaiting: Number(facilityPatientsWaiting),
      estimatedWaitMinutes: Number(facilityWaitMinutes)
    });
    addNewAudit('FACILITY_PROFILE_UPDATE', `Facility Admin updated coordinates and profile for ${activeFacility.name}`);
    setIsEditingFacility(false);
  };

  // Log custom high-density GPS/Biometric attendance logs
  const handleManualAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attEmployeeId) {
      alert("Please select a staff employee first.");
      return;
    }
    const emp = employees.find(ep => ep.id === attEmployeeId);
    if (!emp) return;

    const newLog: AttendanceLog = {
      id: `ATT-${Date.now()}`,
      employeeId: attEmployeeId,
      employeeName: emp.fullName,
      date: attDate,
      checkIn: attCheckIn,
      checkOut: attCheckOut || null,
      status: attStatus,
      method: attMethod,
      gpsLocation: activeFacility.gps || { lat: 8.52, lng: 39.26 },
      gpsVerified: true,
      overtimeHours: parseFloat(attOvertime) || 0
    };

    submitAttendanceLog(newLog);
    addNewAudit('MANUAL_ATTENDANCE_PUNCH', `Manual shift entry logged by Administrator for ${emp.fullName} on ${attDate}`);
    setAttSuccess(`Attendance record added successfully for ${emp.fullName}`);

    // Update attendance summary in employee state
    const currentSummary = emp.attendanceSummary || { present: 0, late: 0, excused: 0, overtimeHours: 0 };
    updateEmployee(attEmployeeId, {
      attendanceSummary: {
        ...currentSummary,
        present: currentSummary.present + (attStatus === 'Present' || attStatus === 'Late' ? 1 : 0),
        late: currentSummary.late + (attStatus === 'Late' ? 1 : 0),
        excused: currentSummary.excused + (attStatus === 'Excused' ? 1 : 0),
        overtimeHours: currentSummary.overtimeHours + (parseFloat(attOvertime) || 0)
      }
    });

    setTimeout(() => setAttSuccess(''), 4500);
  };

  // Register Clinical Equipment
  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqName || !eqSN) {
      alert("Please enter a device name and serial number.");
      return;
    }

    const newEq: Equipment = {
      id: `EQ-${Date.now()}`,
      facilityId: selectedFacilityId,
      name: eqName,
      category: eqCategory,
      serialNumber: eqSN,
      purchaseDate: new Date().toISOString().split('T')[0],
      supplier: eqSupplier || "Government Procurement Depot",
      warrantyYears: Number(eqWarranty) || 1,
      status: eqStatus,
      maintenanceHistory: [],
      assignmentHistory: []
    };

    addEquipmentRecord(newEq);
    addNewAudit('EQUIPMENT_REGISTER', `Admin registered clinical equipment: ${eqName} (SN: ${eqSN})`);
    
    // reset form
    setEqName('');
    setEqSN('');
    setEqSupplier('');
    setShowAddEquipmentForm(false);
  };

  // Update Equipment Status directly
  const handleUpdateEquipmentStatus = (eqId: string, status: 'Operational' | 'Under Maintenance' | 'Needs Repair' | 'Disposed') => {
    updateEquipmentRecord(eqId, { status });
    addNewAudit('EQUIPMENT_STATUS_UPDATE', `Admin updated equipment standard status to: ${status} for item code ${eqId}`);
  };

  // Register Non-Medical Asset
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetRegNo) {
      alert("Please enter an asset name and registration reference.");
      return;
    }

    const newAsset: NonMedicalAsset = {
      id: `AST-${Date.now()}`,
      facilityId: selectedFacilityId,
      name: assetName,
      category: assetCategory,
      status: assetStatus,
      registrationNo: assetRegNo,
      location: assetLocation || "Administration Block",
      assignedTo: assetCustodian || "General Admin Office",
      maintenanceHistory: []
    };

    addAssetRecord(newAsset);
    addNewAudit('ASSET_REGISTER', `Admin registered corporate asset: ${assetName} (${assetRegNo})`);

    // reset form
    setAssetName('');
    setAssetRegNo('');
    setAssetLocation('');
    setAssetCustodian('');
    setShowAddAssetForm(false);
  };

  // Update Asset Status directly
  const handleUpdateAssetStatus = (assetId: string, status: 'In Use' | 'Transferred' | 'Under Repair' | 'Retired') => {
    updateAssetRecord(assetId, { status });
    addNewAudit('ASSET_STATUS_UPDATE', `Admin updated non-medical asset status to: ${status} for ID ${assetId}`);
  };

  // Save Maintenance Event
  const handleSaveMaintenanceEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintEqId) return;

    const targetEq = equipment.find(eq => eq.id === maintEqId);
    if (!targetEq) return;

    const newMaint = {
      id: `MNT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: maintDesc,
      cost: parseFloat(maintCost) || 0,
      technician: maintTech
    };

    updateEquipmentRecord(maintEqId, {
      maintenanceHistory: [newMaint, ...targetEq.maintenanceHistory]
    });

    addNewAudit('EQUIPMENT_MAINTENANCE', `Logged physical maintenance checkup event for ${targetEq.name}: ${maintDesc}`);
    setMaintEqId(null);
    setMaintDesc('');
  };

  // Recharts calculations:
  // Chart 1: Employees by department
  const deptCountMap: Record<string, number> = {};
  facilityEmployees.forEach(e => {
    deptCountMap[e.department] = (deptCountMap[e.department] || 0) + 1;
  });
  const deptData = Object.keys(deptCountMap).map(key => ({
    name: key,
    Employees: deptCountMap[key]
  }));

  // Chart 2: Payroll distribution
  const payrollTotal = facilitySlips.reduce((sum, item) => sum + item.netSalary, 0);
  const payrollAllowances = facilitySlips.reduce((sum, item) => sum + item.allowances, 0);
  const payrollDeductions = facilitySlips.reduce((sum, item) => sum + item.deductions, 0);
  const financeData = [
    { name: 'Net Paid Salaries', value: payrollTotal },
    { name: 'Allowances Issued', value: payrollAllowances },
    { name: 'Taxes/Social Deductions', value: payrollDeductions }
  ];

  const COLORS = ['#0ea5e9', '#10b981', '#f43f5e', '#a855f7'];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800" id="facility-admin-root">
      
      {/* Top Banner Facility Admin */}
      <div className="bg-[#1e293b] text-white px-6 py-6 rounded-t-2xl flex flex-wrap justify-between items-center gap-4 border-b border-slate-800">
        <div>
          <span className="bg-slate-700/80 font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-slate-600/45 text-cyan-300">
            {t.facilityAdmin}
          </span>
          <h2 className="text-xl font-bold mt-1 tracking-tight">Facility Resource Control Console</h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Supervise localized HRMS files, calculate monthly payroll indexes, audit biometric logs, schedule training CPD points, and monitor inventory life-cycles.
          </p>
        </div>

        {/* Selected Facility Switcher */}
        {userFacilityId ? (
          <div className="bg-blue-900/60 border border-blue-700/50 rounded-xl px-4 py-2 text-xs font-semibold text-blue-300">
            🏥 Authorized Facility: <span className="text-white font-bold">{activeFacility?.name || userFacilityId}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium font-mono">Select Hospital ID:</span>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-cyan-300 outline-none"
            >
              {facilities.filter(f => (f.status || '').toLowerCase() === 'approved').map(fac => (
                <option key={fac.id} value={fac.id}>{fac.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'info' ? 'bg-[#1e293b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Facility Profile
        </button>

        <button
          onClick={() => setActiveTab('hrms')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'hrms' ? 'bg-[#1e293b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> HRM Employee Files
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'attendance' ? 'bg-[#1e293b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" /> Biometric Logs
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'payroll' ? 'bg-[#1e293b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Payroll & CPD
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'inventory' ? 'bg-[#1e293b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" /> Equipment & Assets
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-[#1e293b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Analytics & Exports
        </button>
      </div>

      <div className="p-6">

        {/* TAB 1: FACILITY PROFILE */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Facility Identity & Operational Profile</h3>
                <p className="text-xs text-slate-500">View and manage basic details, geolocation, contact records, and live public line queues.</p>
              </div>
              <button
                onClick={() => setIsEditingFacility(!isEditingFacility)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded shadow transition flex items-center gap-1.5"
              >
                {isEditingFacility ? "Cancel Setup" : "Edit Profile & Patient Stats"}
              </button>
            </div>

            {isEditingFacility ? (
              <form onSubmit={handleUpdateFacilityProfileSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest block">Update Profile Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={facilityPhone}
                      onChange={(e) => setFacilityPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={facilityEmail}
                      onChange={(e) => setFacilityEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Facility Type</label>
                    <select
                      value={facilityType}
                      onChange={(e) => setFacilityType(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs outline-none"
                    >
                      <option value="Regional Hospital">Regional Hospital</option>
                      <option value="General Hospital">General Hospital</option>
                      <option value="Primary Hospital">Primary Hospital</option>
                      <option value="Health Center">Health Center</option>
                      <option value="Health Post">Health Post</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Woreda Boundary</label>
                    <input
                      type="text"
                      value={facilityWoreda}
                      onChange={(e) => setFacilityWoreda(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kebele Location</label>
                    <input
                      type="text"
                      value={facilityKebele}
                      onChange={(e) => setFacilityKebele(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Live Patient Triage Statistics</h4>
                  <p className="text-[11px] text-slate-500">Provide public patients with precise real-time expected queue lengths and estimated wait times.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>Patients in Waiting Lobby</span>
                        <span className="font-mono text-blue-600 font-bold">{facilityPatientsWaiting} Citizens</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={facilityPatientsWaiting}
                        onChange={(e) => setFacilityPatientsWaiting(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFacilityPatientsWaiting(prev => Math.max(0, prev - 10))} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">-10</button>
                        <button type="button" onClick={() => setFacilityPatientsWaiting(prev => Math.max(0, prev - 1))} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">-1</button>
                        <button type="button" onClick={() => setFacilityPatientsWaiting(prev => prev + 1)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">+1</button>
                        <button type="button" onClick={() => setFacilityPatientsWaiting(prev => prev + 10)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">+10</button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>Estimated Waiting Time</span>
                        <span className="font-mono text-purple-600 font-bold">{facilityWaitMinutes} Minutes</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="300"
                        value={facilityWaitMinutes}
                        onChange={(e) => setFacilityWaitMinutes(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFacilityWaitMinutes(prev => Math.max(0, prev - 15))} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">-15m</button>
                        <button type="button" onClick={() => setFacilityWaitMinutes(prev => Math.max(0, prev - 5))} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">-5m</button>
                        <button type="button" onClick={() => setFacilityWaitMinutes(prev => prev + 5)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">+5m</button>
                        <button type="button" onClick={() => setFacilityWaitMinutes(prev => prev + 15)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">+15m</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditingFacility(false)}
                    className="border border-slate-300 text-slate-700 text-xs px-4 py-2 rounded font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2 rounded font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Facility Full Name</span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">{activeFacility.name}</p>
                  <span className="text-[10px] text-slate-500 font-mono">CODE: {activeFacility.code}</span>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Operational Type</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{activeFacility.type}</p>
                  <span className="text-[10px] text-slate-500 font-mono">LICENSE: {activeFacility.licenseNo}</span>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Geographic Boundary & Contact</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{activeFacility.woreda}, {activeFacility.kebele}</p>
                  <span className="text-[10px] text-slate-500 block font-mono">PHONE: {activeFacility.phone}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">EMAIL: {activeFacility.email}</span>
                </div>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-900">
                <Users className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-[10px] uppercase font-semibold text-blue-600">Total Assigned Personnel</span>
                <div className="text-2xl font-black mt-1">{facilityEmployees.length}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-purple-900">
                <Clock className="w-5 h-5 text-purple-600 mb-1" />
                <span className="text-[10px] uppercase font-semibold text-purple-600">Patient Wait Queue</span>
                <div className="text-2xl font-black mt-1">{activeFacility.patientsWaiting} <span className="text-xs font-normal text-purple-500">pat</span></div>
                <span className="text-[10px] text-purple-500 font-mono font-bold block mt-1">Est. delay: {activeFacility.estimatedWaitMinutes}m</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900">
                <Wrench className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] uppercase font-semibold text-emerald-600">Medical Hardware</span>
                <div className="text-2xl font-black mt-1">{facilityEquips.length} <span className="text-xs font-normal text-emerald-500">items</span></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900">
                <Briefcase className="w-5 h-5 text-amber-600 mb-1" />
                <span className="text-[10px] uppercase font-semibold text-amber-600">Corporate Assets</span>
                <div className="text-2xl font-black mt-1">{facilityAssets.length} <span className="text-xs font-normal text-amber-500">assets</span></div>
              </div>
            </div>

            {/* Notification logs panel */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 pb-3 border-b text-slate-900">
                <BellRing className="text-blue-500 w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">SMS, Email, and Push Broadcast Logs</h4>
              </div>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-xs mt-3 h-32 overflow-y-auto space-y-1.5">
                {notificationsLog.length === 0 ? (
                  <p className="text-slate-500 italic">No broadcast logs processed in current user session.</p>
                ) : (
                  notificationsLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-cyan-400">►</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HRMS STAFF DIRECTORY */}
        {activeTab === 'hrms' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Employee list (2/3) */}
              <div className="xl:col-span-2 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Currently Assigned Staff Employees</h3>
                <div className="space-y-3">
                  {facilityEmployees.map(emp => (
                    <div key={emp.id} className="border border-slate-200 rounded-xl p-4 flex flex-wrap justify-between items-start gap-4 hover:bg-slate-50 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 text-base">{emp.fullName}</span>
                          <span className="bg-slate-100 text-slate-600 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold">
                            {emp.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">{emp.position} • {emp.department}</p>
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <p>📞 Phone: {emp.phone} | ✉️ {emp.email}</p>
                          <p>🎓 Education: {emp.education}</p>
                          <p>💼 Base Salary: <span className="font-bold text-slate-800">{emp.salary} ETB</span></p>
                        </div>
                      </div>

                      {/* Training status, quick-action controls */}
                      <div className="flex flex-col items-end gap-3 font-mono text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[9px] text-slate-400 font-bold uppercase">Status:</label>
                          <select
                            value={emp.status}
                            onChange={(e) => {
                              updateEmployee(emp.id, { status: e.target.value as any });
                              addNewAudit('EMPLOYEE_STATUS_CHANGE', `Admin changed ${emp.fullName} professional status to: ${e.target.value}`);
                            }}
                            className="bg-white border border-slate-300 rounded text-[10px] font-semibold p-0.5"
                          >
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Resigned">Resigned</option>
                          </select>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-400 block text-[9px]">CPD COMPLETED</span>
                          <span className="text-slate-800 font-bold">{emp.trainingHistory?.length || 0} Courses</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete employee file for ${emp.fullName} (${emp.id})? This is irreversible.`)) {
                              deleteEmployee(emp.id);
                              addNewAudit('EMPLOYEE_DELETE', `Admin deleted employee file record for ${emp.fullName} (${emp.id})`);
                            }
                          }}
                          className="bg-red-50 hover:bg-red-200 text-red-700 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border border-red-200 transition"
                        >
                          Delete Member
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add employee form (1/3) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 h-fit">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <UserPlus className="text-blue-600 w-4.5 h-4.5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">{t.addEmployee}</h4>
                </div>

                {addEmpSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 text-xs">
                    ✔️ {addEmpSuccess}
                  </div>
                )}

                <form onSubmit={handleAddEmployeeSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Chala Gemechu"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                      <select
                        value={empGender}
                        onChange={(e) => setEmpGender(e.target.value as 'Male' | 'Female')}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Base Salary (ETB) *</label>
                      <input
                        type="number"
                        required
                        value={empSalary}
                        onChange={(e) => setEmpSalary(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+251-912-345678"
                      value={empPhone}
                      onChange={(e) => setEmpPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="doctor.name@health.gov.et"
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Assigned Department</label>
                    <input
                      type="text"
                      value={empDepartment}
                      onChange={(e) => setEmpDepartment(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Position / Profession</label>
                    <input
                      type="text"
                      value={empPosition}
                      onChange={(e) => setEmpPosition(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded text-white text-xs mt-2 transition"
                  >
                    Save Employee
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: BIOMETRIC & GPS ATTENDANCE LOGS */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                  Biometric Face/Scan & Verified GPS Attendance Registry
                </h3>
                <p className="text-xs text-slate-500">Track dynamic digital footprint logs, custom Geofence radius validations, and supervisor hand-punches.</p>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">✓ Verification Radius threshold: &lt;150m</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Main Attendance List */}
              <div className="xl:col-span-2 space-y-3">
                <div className="bg-white border rounded-xl overflow-hidden font-mono text-xs shadow-sm">
                  <div className="bg-slate-100 p-3 border-b grid grid-cols-5 font-bold uppercase text-[10px] tracking-wider text-slate-700">
                    <span>Employee Name</span>
                    <span>Punch Date</span>
                    <span>Check-In / Out</span>
                    <span>Log Method</span>
                    <span>Overtime Calculated</span>
                  </div>

                  <div className="divide-y text-slate-700 max-h-[500px] overflow-y-auto">
                    {attendanceLogs.filter(log => facilityEmployees.some(emp => emp.id === log.employeeId)).length === 0 ? (
                      <div className="p-8 text-center text-slate-400 italic">
                        No check-in logs recorded on server for {activeFacility.name}.
                      </div>
                    ) : (
                      attendanceLogs
                        .filter(log => facilityEmployees.some(emp => emp.id === log.employeeId))
                        .map(log => (
                          <div key={log.id} className="p-3 grid grid-cols-5 items-center hover:bg-slate-50">
                            <div className="font-semibold text-slate-900">{log.employeeName}</div>
                            <div>{log.date}</div>
                            <div className="space-y-1">
                              <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                IN: {log.checkIn}
                              </span>
                              <span className="block text-[10px] text-slate-400">
                                OUT: {log.checkOut || 'Active In-Shift'}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                log.method === 'GPS' ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {log.method} Verification
                              </span>
                              {log.gpsVerified && (
                                <span className="block text-[8px] text-emerald-600 font-semibold">✓ Radius Verified</span>
                              )}
                            </div>
                            <div>
                              <span className="text-slate-800 font-bold">{log.overtimeHours} hours</span>
                              <span className="block text-[8px] text-slate-400">({log.overtimeHours * 125} ETB Allowances)</span>
                            </div>
                          </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Log Manual Shift / Punch Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 h-fit shadow-xs">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <Clock className="text-blue-600 w-4.5 h-4.5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Add Shift Overrides Log</h4>
                </div>

                {attSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 text-xs">
                    ✔️ {attSuccess}
                  </div>
                )}

                <form onSubmit={handleManualAttendanceSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 col-span-2">Select Staff Member *</label>
                    <select
                      required
                      value={attEmployeeId}
                      onChange={(e) => setAttEmployeeId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 outline-none font-medium"
                    >
                      <option value="">-- Choose Assigned Employee --</option>
                      {facilityEmployees.map(e => (
                        <option key={e.id} value={e.id}>{e.fullName} ({e.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Check-in Date *</label>
                      <input
                        type="date"
                        required
                        value={attDate}
                        onChange={(e) => setAttDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Overtime (Hours)</label>
                      <input
                        type="number"
                        min="0"
                        max="12"
                        step="0.5"
                        value={attOvertime}
                        onChange={(e) => setAttOvertime(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Check-in Time *</label>
                      <input
                        type="text"
                        required
                        placeholder="08:00"
                        value={attCheckIn}
                        onChange={(e) => setAttCheckIn(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Check-out Time</label>
                      <input
                        type="text"
                        placeholder="17:00"
                        value={attCheckOut}
                        onChange={(e) => setAttCheckOut(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Status Code *</label>
                      <select
                        value={attStatus}
                        onChange={(e) => setAttStatus(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Auth Pathway *</label>
                      <select
                        value={attMethod}
                        onChange={(e) => setAttMethod(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded p-2 outline-none"
                      >
                        <option value="Fingerprint">Biometric Pass</option>
                        <option value="GPS">Verified GPS</option>
                        <option value="Face Recognition">Facial Portal</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[10px] font-medium text-slate-400 italic">Note: Hand-punch logs will automatically bypass the remote radius checker checking geofences.</p>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2.5 px-4 rounded text-white text-xs mt-1 transition"
                  >
                    Submit Overrides Log
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ENTERPRISE PAYROLL & REMUNERATION PORTAL */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            
            {/* Header Module Navigator */}
            <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="bg-blue-600 text-white text-[10px] tracking-wider uppercase font-extrabold px-2.5 py-1 rounded-md">REMUNERATION MANAGER</span>
                <h3 className="text-base font-extrabold text-white mt-1.5">{t.monthlyPayroll}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Manage employee compensation grades, adjust allowances, calculate biometric overtime, review GPS logs, and approve monthly payouts.
                </p>
              </div>

              {/* Sub-tab Navigation controls */}
              <div className="flex bg-slate-900 border border-slate-700 p-1 rounded-xl text-xs font-semibold gap-1">
                <button
                  onClick={() => setPayrollSubTab('payslips')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${payrollSubTab === 'payslips' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Roster & Processor
                </button>
                <button
                  onClick={() => setPayrollSubTab('structures')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${payrollSubTab === 'structures' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Compensation Structures
                </button>
                <button
                  onClick={() => setPayrollSubTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${payrollSubTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Analytics & Allocation
                </button>
                <button
                  onClick={() => setPayrollSubTab('rates')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${payrollSubTab === 'rates' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  System Rates
                </button>
              </div>
            </div>

            {/* SUB-SECTION 1: PAYSLIPS & APPROVAL PROCESSOR */}
            {payrollSubTab === 'payslips' && (
              <div className="space-y-6">
                
                {/* Roster Controls block */}
                <div className="bg-white border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64 text-xs">
                      <input
                        type="text"
                        placeholder="Search employee slips..."
                        value={payrollSearchQuery}
                        onChange={(e) => setPayrollSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg pl-8 pr-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    {payrollSearchQuery && (
                      <button onClick={() => setPayrollSearchQuery('')} className="text-xs text-rose-500 font-semibold hover:underline">Clear</button>
                    )}
                  </div>

                  {/* Operational buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={runPayrollRecalculation}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg border transition flex items-center gap-1.5"
                      title="Read biometric attendance logs and apply structural salary rules"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                      Biometric Recalculate
                    </button>
                    <button
                      onClick={handleExportPayrollCSV}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Excel Export
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('Approved')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition"
                    >
                      Seal All Approved
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('Paid')}
                      className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition"
                    >
                      Issue Bank Payouts
                    </button>
                  </div>
                </div>

                {/* Manual Payslip Override Row form */}
                {editSlipId && (
                  <form onSubmit={handleSaveSpecificPayslip} className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl space-y-4 animate-fade-in text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                      <h4 className="font-extrabold text-blue-900">✏️ Manual Payslip Adjustment: {facilitySlips.find(s => s.id === editSlipId)?.employeeName}</h4>
                      <button type="button" onClick={() => setEditSlipId(null)} className="text-rose-500 font-semibold hover:underline">Cancel Adjust</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Base Salary (ETB)</label>
                        <input
                          type="number"
                          required
                          value={editSlipBasic}
                          onChange={(e) => setEditSlipBasic(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Overtime Pay (ETB)</label>
                        <input
                          type="number"
                          required
                          value={editSlipOvertime}
                          onChange={(e) => setEditSlipOvertime(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none font-semibold text-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Allowances (ETB)</label>
                        <input
                          type="number"
                          required
                          value={editSlipAllowances}
                          onChange={(e) => setEditSlipAllowances(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none font-semibold text-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Tax & Deductions (ETB)</label>
                        <input
                          type="number"
                          required
                          value={editSlipDeductions}
                          onChange={(e) => setEditSlipDeductions(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none font-semibold text-rose-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Payment Status</label>
                        <select
                          value={editSlipStatus}
                          onChange={(e) => setEditSlipStatus(e.target.value as any)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none font-semibold"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Paid">Issued / Paid</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-mono text-slate-500">
                        Resulting Take-Home Net: <span className="font-bold text-slate-900 border bg-white px-2 py-0.5 rounded">{Number(editSlipBasic) + Number(editSlipOvertime) + Number(editSlipAllowances) - Number(editSlipDeductions)} ETB</span>
                      </span>
                      <button type="submit" className="bg-blue-600 text-white font-extrabold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
                        Override Payslip Record
                      </button>
                    </div>
                  </form>
                )}

                {/* Payslips grid view */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilitySlips
                    .filter(slip => slip.employeeName.toLowerCase().includes(payrollSearchQuery.toLowerCase()))
                    .map(slip => (
                      <div key={slip.id} className="border border-slate-200 bg-white shadow-xs rounded-xl p-5 hover:shadow transition relative overflow-hidden flex flex-col justify-between">
                        {/* Status tag */}
                        <div className="absolute top-0 right-0">
                          <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-bl block text-white ${
                            slip.status === 'Paid' ? 'bg-emerald-500' :
                            slip.status === 'Approved' ? 'bg-blue-600' :
                            slip.status === 'Under Review' ? 'bg-amber-500' : 'bg-slate-400'
                          }`}>
                            {slip.status.toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block">SERIAL: {slip.id}</span>
                          <h4 className="text-sm font-extrabold text-slate-900 mt-1">{slip.employeeName}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{slip.grade || "Base"} • {slip.month}</span>

                          {/* Detail indicators */}
                          <div className="grid grid-cols-3 gap-2 border bg-slate-50 border-slate-100 rounded-lg p-2 mt-3 text-center text-[10px] font-mono">
                            <div>
                              <span className="block text-slate-400 font-sans uppercase text-[7px] font-bold">Punch Attendance</span>
                              <span className="font-extrabold text-slate-700">{slip.actualWorkDays || 20} / {slip.targetWorkDays || 20} days</span>
                            </div>
                            <div>
                              <span className="block text-slate-400 font-sans uppercase text-[7px] font-bold">Absents Penalized</span>
                              <span className={`font-extrabold ${slip.absentDays ? 'text-rose-500' : 'text-slate-500'}`}>{slip.absentDays || 0} days</span>
                            </div>
                            <div>
                              <span className="block text-slate-400 font-sans uppercase text-[7px] font-bold">Duty Overtime</span>
                              <span className={`font-extrabold ${slip.overtimeHoursWorked ? 'text-emerald-500' : 'text-slate-500'}`}>{slip.overtimeHoursWorked || 0} Hours</span>
                            </div>
                          </div>

                          {/* Ledger details */}
                          <div className="mt-4 space-y-1.5 text-xs border-t py-3 border-dashed border-slate-200">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Base Salary Grade Level:</span>
                              <span className="font-semibold text-slate-800">{slip.basicSalary.toLocaleString()} ETB</span>
                            </div>
                            <div className="flex justify-between text-emerald-600">
                              <span>Overtime Amount ({slip.overtimeHoursWorked || 0}h):</span>
                              <span className="font-semibold">+{slip.overtimeAmount.toLocaleString()} ETB</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                              <span>Total Custom Allowances:</span>
                              <span className="font-semibold">+{slip.allowances.toLocaleString()} ETB</span>
                            </div>
                            <div className="flex justify-between text-rose-500">
                              <span>Tax, Pension & Reductions:</span>
                              <span className="font-semibold">-{slip.deductions.toLocaleString()} ETB</span>
                            </div>
                          </div>
                        </div>

                        {/* Summary panel & actions */}
                        <div className="mt-4 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wide">Net Take-Home Pay</span>
                            <span className="text-base font-black text-slate-900">{slip.netSalary.toLocaleString()} ETB</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditSlipId(slip.id);
                                setEditSlipBasic(String(slip.basicSalary));
                                setEditSlipOvertime(String(slip.overtimeAmount));
                                setEditSlipAllowances(String(slip.allowances));
                                setEditSlipDeductions(String(slip.deductions));
                                setEditSlipStatus(slip.status);
                              }}
                              className="text-slate-600 hover:text-blue-600 hover:bg-slate-200 border bg-white p-1.5 rounded-lg transition"
                              title="Manually adjust earnings/deductions of this slip"
                            >
                              ⚙️
                            </button>
                            <button
                              onClick={() => setViewedSlip(slip)}
                              className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] py-1.5 px-2.5 rounded-lg transition flex items-center gap-1"
                            >
                              Document PaySlip 📄
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {facilitySlips.filter(slip => slip.employeeName.toLowerCase().includes(payrollSearchQuery.toLowerCase())).length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center p-8 bg-slate-50 border rounded-xl text-slate-400 text-xs">No payroll slips found matching your parameters.</div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-SECTION 2: COMPENSATION STRUCTURES / SALARY GRADES */}
            {payrollSubTab === 'structures' && (
              <div className="space-y-6">
                
                {/* Search / Structure Overview description */}
                <div className="bg-white border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Employee Compensation Matrix</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Configure individual salary structure definitions, pension rates, housing allowances, and duty multipliers.</p>
                  </div>
                  <div className="relative text-xs w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search active staff..."
                      value={payrollSearchQuery}
                      onChange={(e) => setPayrollSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg pl-8 pr-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Users className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Structure Form Editor modal card */}
                {selectedEmpForStructure && (
                  <form onSubmit={handleSaveSalaryStructure} className="bg-slate-900 text-slate-100 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fade-in text-xs shadow-xl">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-sm font-extrabold text-blue-400">💼 Configure Salary Structure & Allowances</h4>
                        <span className="text-[10px] text-slate-400">Staff Member: {selectedEmpForStructure.fullName} ({selectedEmpForStructure.profession})</span>
                      </div>
                      <button type="button" onClick={() => setSelectedEmpForStructure(null)} className="text-rose-400 font-semibold hover:underline">Cancel</button>
                    </div>

                    {structSuccess && (
                      <div className="bg-emerald-500/20 border border-emerald-500 p-3 rounded-lg text-emerald-300 font-bold font-mono">
                        {structSuccess}
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Base Pay Grade *</label>
                        <select
                          value={structGrade}
                          onChange={(e) => setStructGrade(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none"
                        >
                          <option value="Grade IX">Grade IX</option>
                          <option value="Grade X">Grade X</option>
                          <option value="Grade XI">Grade XI</option>
                          <option value="Grade XII">Grade XII</option>
                          <option value="Grade XIII">Grade XIII</option>
                          <option value="Grade XIV">Grade XIV</option>
                          <option value="Grade XV">Grade XV</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Base Monthly Salary (ETB) *</label>
                        <input
                          type="number"
                          required
                          value={structBaseSalary}
                          onChange={(e) => setStructBaseSalary(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Housing Allowance (ETB)</label>
                        <input
                          type="number"
                          required
                          value={structHousing}
                          onChange={(e) => setStructHousing(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Transport Allowance (ETB)</label>
                        <input
                          type="number"
                          required
                          value={structTransport}
                          onChange={(e) => setStructTransport(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Hazard / Danger Pay (ETB)</label>
                        <input
                          type="number"
                          required
                          value={structDanger}
                          onChange={(e) => setStructDanger(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Pension Rate (Employee %)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={structPensionRate}
                          onChange={(e) => setStructPensionRate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Income Tax Rate %</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={structTaxRate}
                          onChange={(e) => setStructTaxRate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Overtime Multiplier *</label>
                        <input
                          type="number"
                          step="0.05"
                          required
                          value={structOvertimeMult}
                          onChange={(e) => setStructOvertimeMult(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Loan / Cash Deductions</label>
                        <input
                          type="number"
                          required
                          value={structCustomDeducts}
                          onChange={(e) => setStructCustomDeducts(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none font-mono text-rose-400"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow">
                        Save Employee Salary Structure
                      </button>
                    </div>
                  </form>
                )}

                {/* Staff Roster Structure Table list */}
                <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b font-extrabold text-slate-700">
                          <th className="p-3">Staff Member</th>
                          <th className="p-3">Position & Dept</th>
                          <th className="p-3">Compensation Grade</th>
                          <th className="p-3">Base Salary (ETB)</th>
                          <th className="p-3">Housing / Transport Alw.</th>
                          <th className="p-3">Danger/Hazard Duty</th>
                          <th className="p-3">Deductions Profile</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-600">
                        {facilityEmployees
                          .filter(emp => emp.fullName.toLowerCase().includes(payrollSearchQuery.toLowerCase()))
                          .map(emp => {
                            const struct = emp.salaryStructure;
                            return (
                              <tr key={emp.id} className="hover:bg-slate-50 transition">
                                <td className="p-3 font-bold text-slate-900">
                                  {emp.fullName}
                                  <span className="block text-[9px] text-slate-400 font-mono">{emp.id}</span>
                                </td>
                                <td className="p-3">
                                  {emp.position}
                                  <span className="block text-[10px] text-slate-400 font-semibold">{emp.department}</span>
                                </td>
                                <td className="p-3 font-mono font-bold text-blue-600">{struct?.grade || "Standard XIV"}</td>
                                <td className="p-3 font-mono text-slate-900 font-extrabold">{emp.salary.toLocaleString()} ETB</td>
                                <td className="p-3 font-mono">
                                  +{struct?.housingAllowance !== undefined ? struct.housingAllowance : Math.floor(emp.salary * 0.05)} / 
                                  +{struct?.transportAllowance !== undefined ? struct.transportAllowance : Math.floor(emp.salary * 0.04)} ETB
                                </td>
                                <td className="p-3 font-mono text-emerald-600">
                                  +{struct?.dangerAllowance !== undefined ? struct.dangerAllowance : (emp.profession.toLowerCase().includes('doctor') || emp.profession.toLowerCase().includes('nurse') ? Math.floor(emp.salary * 0.08) : 0)} ETB
                                </td>
                                <td className="p-3 font-mono text-rose-500">
                                  Pension: {Math.floor((struct?.pensionRate !== undefined ? struct.pensionRate : 0.07)*100)}% • 
                                  Tax: {Math.floor((struct?.taxRate !== undefined ? struct.taxRate : 0.15)*100)}%
                                </td>
                                <td className="p-3">
                                  <button
                                    onClick={() => {
                                      setSelectedEmpForStructure(emp);
                                      setStructGrade(struct?.grade || 'Grade XII');
                                      setStructBaseSalary(String(emp.salary));
                                      setStructHousing(String(struct?.housingAllowance !== undefined ? struct.housingAllowance : Math.floor(emp.salary * 0.05)));
                                      setStructTransport(String(struct?.transportAllowance !== undefined ? struct.transportAllowance : Math.floor(emp.salary * 0.04)));
                                      setStructDanger(String(struct?.dangerAllowance !== undefined ? struct.dangerAllowance : (emp.profession.toLowerCase().includes('doctor') || emp.profession.toLowerCase().includes('nurse') ? Math.floor(emp.salary * 0.08) : 0)));
                                      setStructPensionRate(String(struct?.pensionRate !== undefined ? struct.pensionRate : 0.07));
                                      setStructTaxRate(String(struct?.taxRate !== undefined ? struct.taxRate : 0.15));
                                      setStructOvertimeMult(String(struct?.hourlyOvertimeMultiplier !== undefined ? struct.hourlyOvertimeMultiplier : 1.25));
                                      setStructCustomDeducts(String(struct?.customDeductions !== undefined ? struct.customDeductions : 0));
                                    }}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1 px-2.5 rounded text-[10.5px] transition"
                                  >
                                    Adjust Structure ⚙️
                                  </button>
                                </td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 3: REAL-TIME PAYROLL ANALYTICS */}
            {payrollSubTab === 'analytics' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Visual statistics metric panels */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Facility Gross Payroll</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1 font-mono">
                      {(facilitySlips.reduce((sum, item) => sum + item.basicSalary + item.overtimeAmount + item.allowances, 0)).toLocaleString()} ETB
                    </h3>
                    <span className="text-[9px] text-slate-400">Sum of Base Salary + OTs + Allowances</span>
                  </div>

                  <div className="bg-white border rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Net Pay Disbursed</span>
                    <h3 className="text-lg font-black text-blue-600 mt-1 font-mono">
                      {payrollTotal.toLocaleString()} ETB
                    </h3>
                    <span className="text-[9px] text-emerald-500 font-semibold">100% Scoped to June 2026</span>
                  </div>

                  <div className="bg-white border rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Handled Allowances</span>
                    <h3 className="text-lg font-black text-blue-400 mt-1 font-mono">
                      {payrollAllowances.toLocaleString()} ETB
                    </h3>
                    <span className="text-[9px] text-slate-400">Housing, Transport, Danger Sums</span>
                  </div>

                  <div className="bg-white border rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Withheld Taxes & Pensions</span>
                    <h3 className="text-lg font-black text-rose-500 mt-1 font-mono">
                      {payrollDeductions.toLocaleString()} ETB
                    </h3>
                    <span className="text-[9px] text-slate-400">Federal Tax + Retirement Contributions</span>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart 1: Department-wise expenditures */}
                  <div className="bg-white p-5 border rounded-xl shadow-xs">
                    <h4 className="text-xs font-bold uppercase text-slate-900 mb-4 tracking-wide">Department-wise Salary Expenditure Breakdown</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={(() => {
                            const departmentStats: {[key: string]: number} = {};
                            facilitySlips.forEach(slip => {
                              const emp = employees.find(e => e.id === slip.employeeId);
                              const dept = emp ? emp.department : "Other";
                              departmentStats[dept] = (departmentStats[dept] || 0) + slip.netSalary;
                            });
                            return Object.keys(departmentStats).map(dept => ({
                              department: dept,
                              expenditure: departmentStats[dept]
                            }));
                          })()}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="department" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} unit=" ETB" />
                          <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(val) => [`${val.toLocaleString()} ETB`, 'Net Expenditure']} />
                          <Bar dataKey="expenditure" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={25} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Fund distribution split */}
                  <div className="bg-white p-5 border rounded-xl shadow-xs">
                    <h4 className="text-xs font-bold uppercase text-slate-900 mb-4 tracking-wide">June 2026 Fund Allocation Breakdown</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Core Basic Salary', value: facilitySlips.reduce((sum, s) => sum + s.basicSalary, 0) },
                              { name: 'Biometric Overtime Benefits', value: facilitySlips.reduce((sum, s) => sum + s.overtimeAmount, 0) },
                              { name: 'Allowances', value: facilitySlips.reduce((sum, s) => sum + s.allowances, 0) },
                              { name: 'Withheld Deductions', value: facilitySlips.reduce((sum, s) => sum + s.deductions, 0) }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            <Cell fill="#2563eb" />
                            <Cell fill="#10b981" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#f43f5e" />
                          </Pie>
                          <Tooltip formatter={(val) => [`${val.toLocaleString()} ETB`, 'Allocation']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 4: SYSTEM RATE DEFAULT TARGET VARIABLES */}
            {payrollSubTab === 'rates' && (
              <div className="bg-white border rounded-xl p-6 shadow-xs animate-fade-in text-xs max-w-2xl">
                <h4 className="text-sm font-extrabold text-slate-900 mb-2">Configure Default Institution Payroll Factors</h4>
                <p className="text-slate-500 mb-4">Set baseline parameters used when onboarding new staff or generating dynamic roster payslips if custom structures are undefined.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Government default Pension Rate (%)</label>
                      <input type="text" readOnly value="7.00% (Ethiopian Federal Standard)" className="w-full bg-slate-50 border p-2 rounded outline-none font-semibold text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Employer Contribution Match (%)</label>
                      <input type="text" readOnly value="11.00% (Counterpart Matching)" className="w-full bg-slate-50 border p-2 rounded outline-none font-semibold text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Standard Income Tax Levy (%)</label>
                      <input type="text" readOnly value="15.00% (Flat Bracket)" className="w-full bg-slate-50 border p-2 rounded outline-none font-semibold text-slate-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border bg-slate-50/50 p-3 rounded-lg border-dashed">
                      <span className="font-bold text-slate-700 block mb-1">Overtime Base Policy Default:</span>
                      <p className="text-slate-500 text-[10.5px]">Standard OT uses a **1.25x** multiplier on hourly salary (derived as Base Salary / 160). Medical Doctors on active trauma night shifts are automatically elevated to **1.50x** or **2.00x** when structure multipliers are engaged.</p>
                    </div>
                    <div className="border bg-slate-50/50 p-3 rounded-lg border-dashed">
                      <span className="font-bold text-slate-700 block mb-1">Unapproved Absence Deductions Policy:</span>
                      <p className="text-slate-500 text-[10.5px]">Every documented biometric absence subtracts pro-rated basic salary amounts (calculated as Basic Salary / 20 working days). Unpaid approved leaves are deducted at a **1.20x** penalty factor.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HIGH-FIDELITY INDIVIDUAL PAYSLIP DOCUMENT MODAL (PRINT OPTIMIZED) */}
            {viewedSlip && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in print:bg-white print:absolute print:inset-0">
                <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col justify-between border print:border-0 print:shadow-none print:my-0">
                  
                  {/* Actions Header (hidden on print) */}
                  <div className="bg-slate-900 text-white p-4 flex items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-2">
                      <FileCheck className="text-emerald-400 w-5 h-5 animate-pulse" />
                      <h4 className="font-extrabold text-sm text-white">Official Remuneration Statement Visualizer</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => window.print()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition"
                      >
                        Print/Export PDF 🖨️
                      </button>
                      <button
                        onClick={() => setViewedSlip(null)}
                        className="bg-slate-700 hover:bg-slate-650 text-white text-xs py-1.5 px-3 rounded-lg transition"
                      >
                        Close Panel
                      </button>
                    </div>
                  </div>

                  {/* PRINT-OPTIMIZED SLIP CONTENT BODY */}
                  <div className="p-8 space-y-6 text-slate-800 font-sans print:p-0" id="printable-payslip-canvas">
                    
                    {/* Official Banner Header */}
                    <div className="text-center pb-4 border-b-2 border-double border-slate-300">
                      <span className="text-[10px] tracking-widest uppercase font-extrabold text-slate-400 block font-mono">FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA</span>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">MUSTALI REGIONAL STATE HEALTH BUREAU</h3>
                      <span className="text-[12px] font-bold text-blue-600 block sm:inline">OFFICIAL DIGITAL EARNINGS STATEMENT</span>
                      <span className="text-xs text-slate-500 font-semibold block sm:inline sm:before:content-['•_']">{viewedSlip.month}</span>
                    </div>

                    {/* Metadata particulars split */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] tracking-wider block">EMPLOYEE IDENTITY:</span>
                          <span className="font-extrabold text-slate-900">{viewedSlip.employeeName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] tracking-wider block">OFFICIAL EMPLOYEE ID:</span>
                          <span className="font-mono text-blue-600 font-bold text-[10.5px]">{viewedSlip.employeeId}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] tracking-wider block">EMPLOYING HEALTH TENANT:</span>
                          <span className="font-bold text-slate-800">{activeFacility.name} — ({activeFacility.type})</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-right">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] tracking-wider block">FEDERAL LICENSE REG:</span>
                          <span className="font-mono text-slate-700 font-semibold">{activeFacility.licenseNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] tracking-wider block">LEDGER PAYSLIP SERIAL:</span>
                          <span className="font-mono text-slate-700 font-semibold">{viewedSlip.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[8px] tracking-wider block">VERIFICATION TIMESTAMP:</span>
                          <span className="font-mono text-slate-500">{new Date(viewedSlip.payslipGeneratedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Biometric logs audit checks (very important metrics) */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
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
                      <div className="space-y-2 border-r pr-4 border-dashed border-slate-200">
                        <span className="font-bold text-slate-900 border-b pb-1.5 block uppercase tracking-wide text-[9px] text-emerald-600">💸 Remunerative Earnings</span>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Base salary counterpart pay:</span>
                            <span className="font-semibold text-slate-800">{viewedSlip.basicSalary.toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Biometric standard overtime benefit:</span>
                            <span className="font-semibold text-emerald-600">+{viewedSlip.overtimeAmount.toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Housing allowance benefit:</span>
                            <span className="font-semibold text-slate-700">+{viewedSlip.allowanceHousing ? viewedSlip.allowanceHousing.toLocaleString() : Math.floor(viewedSlip.basicSalary * 0.05).toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Transportation / Commute match:</span>
                            <span className="font-semibold text-slate-700">+{viewedSlip.allowanceTransport ? viewedSlip.allowanceTransport.toLocaleString() : Math.floor(viewedSlip.basicSalary * 0.04).toLocaleString()} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Professional Danger duty allowance:</span>
                            <span className="font-semibold text-slate-700">+{viewedSlip.allowanceDanger ? viewedSlip.allowanceDanger.toLocaleString() : 0} ETB</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t font-extrabold text-slate-900">
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
                            <td className="font-semibold text-slate-800">-{viewedSlip.pensionEmployee ? viewedSlip.pensionEmployee.toLocaleString() : Math.floor(viewedSlip.basicSalary * 0.07).toLocaleString()} ETB</td>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Absence penalization checks:</span>
                            <span className="font-semibold text-rose-500">-{viewedSlip.absentDays ? Math.floor((viewedSlip.basicSalary / 20) * viewedSlip.absentDays).toLocaleString() : 0} ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Leave adjust deductions:</span>
                            <span className="font-semibold text-rose-500">-{viewedSlip.leaveDeductions ? viewedSlip.leaveDeductions.toLocaleString() : 0} ETB</span>
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
                        <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block tracking-wide">Take-Home Compensation net pay:</span>
                        <span className="text-lg font-black text-slate-900 font-mono tracking-tight">{viewedSlip.netSalary.toLocaleString()} ETB</span>
                      </div>

                      {/* Seal detail */}
                      <div className="text-right border-l-4 border-emerald-500 pl-4 py-1.5 max-w-xs">
                        <span className="text-[9px] uppercase font-extrabold text-emerald-600 block tracking-wider">🔒 STATE DISBURSEMENT SEALED</span>
                        <p className="text-[10.5px] font-semibold text-slate-600">Approved by: Administration Coordinator, MUSTALI DIRS. Direct deposit initiated successfully.</p>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="text-center text-[9px] text-slate-400 font-medium italic pt-2 border-t">
                      This is a certified digital document reflecting authorized biometric clock-in logs and institutional accounting entries. For disputes, contact the regional MUSTALI HRMS Bureau.
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 5: REPAIR LOGS & ASSET REGISTERS */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Medical Equipment catalog */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-1.5">
                  <Wrench className="text-purple-600 w-4.5 h-4.5" />
                  <h3 className="text-sm font-bold uppercase text-slate-900 tracking-tight">Clinical & Surgical Equipment Asset Registry</h3>
                </div>
                <button
                  onClick={() => setShowAddEquipmentForm(!showAddEquipmentForm)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-2.5 rounded shadow transition"
                >
                  {showAddEquipmentForm ? "Cancel Add" : "+ Register Medical Device"}
                </button>
              </div>

              {showAddEquipmentForm && (
                <form onSubmit={handleSaveEquipment} className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Equipment / Device Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Centrifuge 5424 R"
                      value={eqName}
                      onChange={(e) => setEqName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Functional Category *</label>
                    <select
                      value={eqCategory}
                      onChange={(e) => setEqCategory(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none font-medium"
                    >
                      <option value="Diagnostic Imaging">Diagnostic Imaging</option>
                      <option value="Surgical Instrumentation">Surgical Instrumentation</option>
                      <option value="Laboratory Hardware">Laboratory Hardware</option>
                      <option value="Life Support Systems">Life Support Systems</option>
                      <option value="Sterilization Units">Sterilization Units</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Serial Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SN-998-32-AA"
                      value={eqSN}
                      onChange={(e) => setEqSN(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Procured Supplier</label>
                    <input
                      type="text"
                      placeholder="e.g. Siemens Healthcare"
                      value={eqSupplier}
                      onChange={(e) => setEqSupplier(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Warranty Period (Years)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="3"
                      value={eqWarranty}
                      onChange={(e) => setEqWarranty(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Initial Status</label>
                    <select
                      value={eqStatus}
                      onChange={(e) => setEqStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none"
                    >
                      <option value="Operational">Operational</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                      <option value="Needs Repair">Needs Repair</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 flex justify-end gap-1 pt-1">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-1.5 rounded transition"
                    >
                      Confirm Register Device
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facilityEquips.length === 0 ? (
                  <p className="text-xs text-slate-400 italic col-span-2 text-center p-6 border rounded-xl">No active medical devices listed on the local register.</p>
                ) : (
                  facilityEquips.map(eq => (
                    <div key={eq.id} className="border border-slate-200 p-4 rounded-xl hover:shadow transition relative">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                            {eq.category}
                          </span>
                          <h4 className="font-extrabold text-[#111827] text-sm mt-1">{eq.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono font-bold">SN: {eq.serialNumber}</p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <select
                            value={eq.status}
                            onChange={(e) => handleUpdateEquipmentStatus(eq.id, e.target.value as any)}
                            className="bg-white border rounded text-[10px] font-bold p-0.5"
                          >
                            <option value="Operational">Operational</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                            <option value="Needs Repair">Needs Repair</option>
                            <option value="Disposed">Disposed</option>
                          </select>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-extrabold uppercase ${
                            eq.status === 'Operational' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {eq.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 mt-4 pt-3 border-t border-dashed gap-2 text-[10px] font-mono text-slate-500">
                        <div>
                          <span>SUPPLIER DESK:</span>
                          <p className="font-semibold text-slate-700">{eq.supplier}</p>
                        </div>
                        <div>
                          <span>WARRANTY END:</span>
                          <p className="font-semibold text-slate-700">June {(new Date(eq.purchaseDate || Date.now()).getFullYear() + (eq.warrantyYears || 3))}</p>
                        </div>
                      </div>

                      {/* Maintenance logs list */}
                      {eq.maintenanceHistory && eq.maintenanceHistory.length > 0 && (
                        <div className="mt-3 bg-slate-50 p-3 rounded-lg border text-[11px] max-h-28 overflow-y-auto space-y-1.5">
                          <span className="text-purple-700 font-bold block uppercase text-[9px]">Maintenance History ({eq.maintenanceHistory.length})</span>
                          {eq.maintenanceHistory.map((m, idx) => (
                            <div key={idx} className="border-b border-slate-200/60 pb-1 last:border-0">
                              <p className="text-slate-800 font-medium">{m.description}</p>
                              <p className="text-slate-500 font-mono text-[9px] mt-0.5">Date: {m.date} • Cost: {m.cost} ETB • Eng: {m.technician}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Inline Maintenance logging form */}
                      <div className="mt-3 pt-2 border-t">
                        {maintEqId === eq.id ? (
                          <form onSubmit={handleSaveMaintenanceEntry} className="bg-purple-50 p-3 rounded-lg border border-purple-200 space-y-2 text-xs">
                            <h5 className="font-bold text-purple-900 text-[10px] uppercase">Add Engineering Maintenance Action</h5>
                            <div>
                              <input
                                type="text"
                                required
                                placeholder="Describe inspection of hardware status..."
                                value={maintDesc}
                                onChange={(e) => setMaintDesc(e.target.value)}
                                className="w-full bg-white border rounded p-1 text-xs outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                placeholder="Cost (ETB)"
                                value={maintCost}
                                onChange={(e) => setMaintCost(e.target.value)}
                                className="w-full bg-white border rounded p-1 text-xs outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Engineer Name"
                                value={maintTech}
                                onChange={(e) => setMaintTech(e.target.value)}
                                className="w-full bg-white border rounded p-1 text-xs outline-none"
                              />
                            </div>
                            <div className="flex justify-end gap-1">
                              <button type="button" onClick={() => setMaintEqId(null)} className="text-[10px] px-2 py-0.5">Cancel</button>
                              <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-[10px] px-3 py-0.5 rounded">Save Log</button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => {
                              setMaintEqId(eq.id);
                              setMaintDesc('');
                            }}
                            className="bg-slate-100 font-bold hover:bg-slate-200 text-slate-700 font-semibold text-[10px] px-2.5 py-1 rounded w-full text-center transition"
                          >
                            + Log Engineering Service Event
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Non-Medical Assets */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="text-blue-600 w-4.5 h-4.5" />
                  <h3 className="text-sm font-bold uppercase text-slate-900 tracking-tight">Non-Medical Institutional Asset Log</h3>
                </div>
                <button
                  onClick={() => setShowAddAssetForm(!showAddAssetForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1 px-2.5 rounded shadow transition"
                >
                  {showAddAssetForm ? "Cancel Add" : "+ Register Custodian Asset"}
                </button>
              </div>

              {showAddAssetForm && (
                <form onSubmit={handleSaveAsset} className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Corporate Asset Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Administration Fleet Vehicle"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Category Type *</label>
                    <select
                      value={assetCategory}
                      onChange={(e) => setAssetCategory(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none font-medium"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Computers">Computers</option>
                      <option value="Buildings">Buildings</option>
                      <option value="Office Equipment">Office Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Government Reg No / Tag *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RE-TAG-2201"
                      value={assetRegNo}
                      onChange={(e) => setAssetRegNo(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Physical Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Logistics Depot"
                      value={assetLocation}
                      onChange={(e) => setAssetLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Assigned Custodian (Staff / Office)</label>
                    <input
                      type="text"
                      placeholder="e.g. Head of General Services"
                      value={assetCustodian}
                      onChange={(e) => setAssetCustodian(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status Code</label>
                    <select
                      value={assetStatus}
                      onChange={(e) => setAssetStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 outline-none"
                    >
                      <option value="In Use">In Use</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Under Repair">Under Repair</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 flex justify-end gap-1 pt-1">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded transition"
                    >
                      Confirm Register Asset
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facilityAssets.length === 0 ? (
                  <p className="text-xs text-slate-400 italic col-span-2 text-center p-6 border rounded-xl">No assets listed under spatial tag {activeFacility.name}.</p>
                ) : (
                  facilityAssets.map(asset => (
                    <div key={asset.id} className="border border-slate-200 p-4 rounded-xl hover:shadow transition bg-slate-50/20 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded font-mono uppercase">
                            {asset.category}
                          </span>
                          <h4 className="font-extrabold text-[#111827] text-sm mt-1">{asset.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono font-bold">{asset.registrationNo}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1.5">
                          <select
                            value={asset.status}
                            onChange={(e) => handleUpdateAssetStatus(asset.id, e.target.value as any)}
                            className="bg-white border text-[10px] font-bold p-0.5 rounded-md"
                          >
                            <option value="In Use">In Use</option>
                            <option value="Transferred">Transferred</option>
                            <option value="Under Repair">Under Repair</option>
                            <option value="Retired">Retired</option>
                          </select>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-extrabold uppercase font-mono">
                            {asset.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-[11px] space-y-1">
                        <p className="text-slate-600">📍 Location Area: <span className="text-slate-800 font-semibold">{asset.location || 'Adama Regional Depot'}</span></p>
                        <p className="text-slate-600">👤 Custodial Staff: <span className="text-slate-800 font-semibold">{asset.assignedTo || 'General Services Division'}</span></p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: REPORTS & CHARTS EXPORTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart 1: Personnel department allocation */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">Personnel Allocation By Department</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="Employees" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Payroll budget distribution */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">Financial Allocation Breakdown</h4>
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {financeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Simulated file compilers */}
            <div className="border border-slate-200 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Compiled Reporting Logs and Exports
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Export verified biometric logs, training logs and medical inventory history directly into Excel format sheets or print secure government PDFs.
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  id="btn-export-pdf"
                  onClick={() => {
                    alert("Compiling requested information into secure PDF file format with Digital crypt signature...");
                    addNewAudit('COMPILER_PDF_EXPORT', `Exported certified PDF document for facility ID: ${selectedFacilityId}`);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 transition text-white py-2 px-4 rounded font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Compile PDF Report
                </button>
                <button
                  id="btn-export-excel"
                  onClick={() => {
                    alert("Generating and compiling .xlsx Spreadsheet tracking assets and medical hardware profiles...");
                    addNewAudit('COMPILER_EXCEL_EXPORT', `Exported inventory .xlsx record sheets for facility ID: ${selectedFacilityId}`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 transition text-white py-2 px-4 rounded font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Excel Spreadsheet
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
