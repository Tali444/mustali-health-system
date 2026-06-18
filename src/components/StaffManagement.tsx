import React, { useState } from 'react';
import {
  User,
  Users,
  UserPlus,
  Search,
  CheckCircle,
  AlertCircle,
  QrCode,
  MapPin,
  Calendar,
  Lock,
  Award,
  IdCard,
  TrendingUp,
  MapPinOff,
  Briefcase,
  FileText,
  Clock,
  Plus,
  Trash2,
  ThumbsUp,
  Sliders,
  DollarSign,
  Phone,
  Mail,
  Home,
  Check,
  X,
  Printer
} from 'lucide-react';
import { Employee, TenantFacility, AttendanceLog, TrainingRecord, LeaveRequest, PerformanceEvaluation, Language, UserRole } from '../types';

interface StaffManagementProps {
  currentLanguage: Language;
  facilities: TenantFacility[];
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  addNewEmployee: (newEmp: Employee) => void;
  updateEmployee: (id: string, updatedFields: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  submitAttendanceLog: (log: AttendanceLog) => void;
  addNewAudit: (action: string, details: string) => void;
  activeRole: UserRole;
  userFacilityId?: string;
}

export default function StaffManagement({
  currentLanguage,
  facilities,
  employees,
  attendanceLogs,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
  submitAttendanceLog,
  addNewAudit,
  activeRole,
  userFacilityId
}: StaffManagementProps) {
  // Navigation tabs of Module
  // 'directory' | 'id_badges' | 'attendance' | 'leaves' | 'trainings' | 'evaluations'
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'id_badges' | 'attendance' | 'leaves' | 'trainings' | 'evaluations'>('directory');

  // Directory filter selection
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(userFacilityId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [directorySelectedEmpId, setDirectorySelectedEmpId] = useState<string>(employees[0]?.id || '');

  React.useEffect(() => {
    if (userFacilityId) {
      setSelectedFacilityId(userFacilityId);
      setFormFacilityId(userFacilityId);
    }
  }, [userFacilityId]);

  // Form states for creating structured Employee
  const [formName, setFormName] = useState('');
  const [formFacilityId, setFormFacilityId] = useState(userFacilityId || facilities[0]?.id || '');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formProfession, setFormProfession] = useState('Medical Doctor');
  const [formSystemRole, setFormSystemRole] = useState<'Doctor' | 'HR Officer' | 'Store Keeper' | 'Staff'>('Staff');
  const [formEducation, setFormEducation] = useState('MD in General Medicine');
  const [formDepartment, setFormDepartment] = useState('Emergency & General Medicine');
  const [formPosition, setFormPosition] = useState('Consultant Doctor');
  const [formSalary, setFormSalary] = useState('');
  const [formDateOfHire, setFormDateOfHire] = useState(new Date().toISOString().split('T')[0]);

  // Form validation responses
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Attendance states
  const [clockInEmpId, setClockInEmpId] = useState<string>(employees[0]?.id || '');
  const [simLat, setSimLat] = useState<string>('8.5414');
  const [simLng, setSimLng] = useState<string>('39.2689');
  const [selectedLogFilter, setSelectedLogFilter] = useState<string>('All');
  const [manualLogEmpId, setManualLogEmpId] = useState<string>(employees[0]?.id || '');
  const [manualLogDate, setManualLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [manualLogStatus, setManualLogStatus] = useState<'Present' | 'Late' | 'Absent' | 'Excused'>('Present');

  // Leave desks
  const [leaveEmpId, setLeaveEmpId] = useState<string>(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<'Sick Leave' | 'Annual Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Study Leave' | 'Compassionate Leave'>('Annual Leave');
  const [leaveStart, setLeaveStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [leaveEnd, setLeaveEnd] = useState<string>(new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState<string>('');
  
  // CPD Training states
  const [trainingEmpId, setTrainingEmpId] = useState<string>(employees[0]?.id || '');
  const [trainingTitle, setTrainingTitle] = useState<string>('');
  const [trainingProvider, setTrainingProvider] = useState<string>('');
  const [trainingCPD, setTrainingCPD] = useState<string>('5');
  const [trainingStatus, setTrainingStatus] = useState<'Completed' | 'Upcoming' | 'In Progress'>('Completed');

  // Appraisal Performance evaluations states
  const [evalEmpId, setEvalEmpId] = useState<string>(employees[0]?.id || '');
  const [evalName, setEvalName] = useState<string>('Dr. Solomon Beyene');
  const [evalPeriod, setEvalPeriod] = useState<string>('Annual 2026');
  const [scoreClinical, setScoreClinical] = useState<number>(4);
  const [scorePunctuality, setScorePunctuality] = useState<number>(5);
  const [scoreAffection, setScoreAffection] = useState<number>(4);
  const [scoreTeamwork, setScoreTeamwork] = useState<number>(4);
  const [scoreCompliance, setScoreCompliance] = useState<number>(5);
  const [evalFeedback, setEvalFeedback] = useState<string>('');
  const [evalRecs, setEvalRecs] = useState<string>('');

  // Localized string dictionary (Afaan Oromoo & English)
  const langDict = {
    en: {
      modTitle: "Regulatory Staff & HRMS Workspace",
      modSubtitle: "Credentialing directory, electronic physical badging, leave authority control, continuous clinical training and reviews.",
      tabDirectory: "Roster Registry",
      tabBadging: "ID Badge Desk",
      tabAttendance: "GPS Attendance",
      tabLeaves: "Leaves Control",
      tabTrainings: "Clinical CPD",
      tabEvaluations: "Evaluations",
      btnRegisterStaff: "Credential New Health Employee",
      btnDetails: "Employee File",
      colId: "Employee ID",
      colName: "Full Name",
      colRole: "Profession / Dep.",
      colFacility: "Assigned Facility",
      colStatus: "Status",
      lblRegForm: "Federal Clinical Professional Register",
      lblFacility: "Assign Healthcare Facility",
      lblName: "Clinical Professional Name",
      lblGender: "Gender Identity",
      lblPhone: "Contact Cell",
      lblEmail: "Professional Email",
      lblAddress: "Residential Address",
      lblProfession: "Health Board Profession",
      lblEducation: "Highest Academic Degree",
      lblDepartment: "Clinical Department",
      lblPosition: "Official Staff Position",
      lblSalary: "Gross Monthly Salary (ETB)",
      lblHireDate: "Official Date of Appointment",
      lblGenerateId: "Assign ID Card Keys",
      msgRegSuccess: "Staff member credentialed successfully. Generating official tracking coordinates...",
      badgeTemplateTitle: "NATIONAL HEALTH REPOSITORY",
      badgeCert: "FEDERAL CLINICAL SERVICE LICENSED",
      btnCheckIn: "Clock In via simulated GPS",
      btnCheckOut: "Clock Out via simulated GPS",
      lblDistance: "Est. distance inside hospital perimeter: ",
      badgeStatusVerified: "Perimeter Safe",
      badgeStatusBreach: "Out of Bounds"
    },
    om: {
      modTitle: "Galmee fi Bulchiinsa Ogeeyyii Fayyaa",
      modSubtitle: "Eeyyama ogeeyyii, waraqaa eenyummaa koodii qabu, bulchiinsa fasallaa, leenjii guddina ogummaa, fi madaallii hojii.",
      tabDirectory: "Galmee Waliigalaa",
      tabBadging: "Waraqaa Eenyummaa",
      tabAttendance: "Hordoffii GPS",
      tabLeaves: "Fasallaa & Eeyyama",
      tabTrainings: "Leenjii CPD",
      tabEvaluations: "Madaallii Hojii",
      btnRegisterStaff: "Ogeessa Fayyaa Haaraa Galmeessi",
      btnDetails: "Fayilii Ogeessaa",
      colId: "ID Ogeessaa",
      colName: "Maqaa Guutuu",
      colRole: "Ogummaa / Kutaa",
      colFacility: "Dhaabbata Ramadame",
      colStatus: "Sadarkaa",
      lblRegForm: "Unka Galmee Ogeessaa Haaraa",
      lblFacility: "Keellaa Fayyaa Ramadame",
      lblName: "Maqaa Ogeessaa",
      lblGender: "Saala",
      lblPhone: "Lakka Bilbilaa",
      lblEmail: "Iymeili",
      lblAddress: "Address Eessummeessa",
      lblProfession: "Ogummaa Fayyaa",
      lblEducation: "Sadarkaa Barnootaa Olaanaa",
      lblDepartment: "Kutaa Yaalaa Hojii",
      lblPosition: "Gahee Hojii Official",
      lblSalary: "Mindaa Ji'aa (ETB)",
      lblHireDate: "Guyyaa Hojii Jalqabe",
      lblGenerateId: "Koodii Eenyummaa Uumi",
      msgRegSuccess: "Ogeessi fayyaa guutummatti koodiidhan galmeefameera. Lakkoofsi eenyummaa uumameera.",
      badgeTemplateTitle: "GALMEE FAYYAA BIYYOOLIESSAA",
      badgeCert: "OGEESSA FAYYAA EEYYAMAMEESTI",
      btnCheckIn: "GPSn Hojii Jalqabi (Clock In)",
      btnCheckOut: "GPSn Hojii Xumuri (Clock Out)",
      lblDistance: "Fageenya dhaabbaticharraa qabu: ",
      badgeStatusVerified: "Keessatti Argama",
      badgeStatusBreach: "Dhaabbatidhaa Alatti"
    }
  };

  const t = langDict[currentLanguage] || langDict.en;

  // Active directory list filtering
  const filteredEmployees = employees.filter(emp => {
    const matchesFacility = selectedFacilityId === 'all' || emp.facilityId === selectedFacilityId;
    const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFacility && matchesSearch;
  });

  const selectedEmployee = employees.find(e => e.id === directorySelectedEmpId) || employees[0];

  // Helper function to generate high-fidelity, deterministic, professional Employee IDs
  const handleRegisterEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formEmail.trim() || !formSalary) {
      setErrorMsg("Please complete all employee credentialing identifiers.");
      setSuccessMsg('');
      return;
    }

    const nextId = `EMP-OR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEmp: Employee = {
      id: nextId,
      facilityId: formFacilityId,
      fullName: formName,
      gender: formGender,
      phone: formPhone,
      email: formEmail,
      address: formAddress || "Oromia, Ethiopia",
      profession: formProfession,
      education: formEducation,
      department: formDepartment,
      position: formPosition,
      salary: parseFloat(formSalary) || 12000,
      status: 'Active',
      dateOfHire: formDateOfHire,
      trainingHistory: [],
      leaveRequests: [],
      performanceEvaluations: [],
      attendanceSummary: {
        present: 0,
        late: 0,
        excused: 0,
        overtimeHours: 0
      },
      systemRole: formSystemRole
    };

    addNewEmployee(newEmp);
    addNewAudit('STAFF_REGISTRATION', `Credentialed clinical staff: ${formName} (${formProfession}) with system role ${formSystemRole} under ID: ${nextId}. Associated with Facility: ${formFacilityId}`);
    
    // Reset Form Input
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormSalary('');
    setFormSystemRole('Staff');
    
    setSuccessMsg(`${t.msgRegSuccess} Key card assigned: ${nextId}`);
    setErrorMsg('');
    setDirectorySelectedEmpId(nextId);

    // Timeout alert clearing
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Simulating check-in / check-out matching with active facility location coordinates
  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  };

  const handleSimulatedGPSClock = (type: 'ClockIn' | 'ClockOut') => {
    const staff = employees.find(e => e.id === clockInEmpId);
    if (!staff) {
      setErrorMsg("Please register or select a valid clinical staff member.");
      return;
    }

    const facility = facilities.find(f => f.id === staff.facilityId);
    const facilityLat = facility?.gps?.lat || 8.5414;
    const facilityLng = facility?.gps?.lng || 39.2689;

    const currentLat = parseFloat(simLat) || 8.5414;
    const currentLng = parseFloat(simLng) || 39.2689;

    const distanceMeters = getHaversineDistance(facilityLat, facilityLng, currentLat, currentLng);
    const inPerimeter = distanceMeters <= 500; // 500 meters is allowance perimeter

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];

    if (type === 'ClockIn') {
      const isLateStr = parseInt(nowStr.split(':')[0]) >= 9; // Late if checked in after 9 AM
      const newLog: AttendanceLog = {
        id: `ATT-${Date.now()}`,
        employeeId: staff.id,
        employeeName: staff.fullName,
        date: todayStr,
        checkIn: nowStr,
        checkOut: null,
        status: isLateStr ? 'Late' : 'Present',
        method: 'GPS',
        gpsLocation: { lat: currentLat, lng: currentLng },
        gpsVerified: inPerimeter,
        overtimeHours: 0
      };

      submitAttendanceLog(newLog);
      addNewAudit('ATTENDANCE_GPS_CHECKIN', `Staff CLOCK-IN success: ${staff.fullName} (${staff.id}). Latitude: ${currentLat}, Longitude: ${currentLng}. Distance to Clinic: ${distanceMeters.toFixed(1)}m. Verified: ${inPerimeter ? "IN" : "OUT"}`);
      setSuccessMsg(`GPS check-in verified successfully for ${staff.fullName}. Checked in at ${nowStr}. Distance: ${distanceMeters.toFixed(1)}m.`);
    } else {
      // Find current active check-in for today
      const existingLogs = attendanceLogs.filter(log => log.employeeId === staff.id && log.date === todayStr);
      let updatedLog: AttendanceLog;
      if (existingLogs.length > 0) {
        const matchingLog = existingLogs[0];
        updatedLog = {
          ...matchingLog,
          checkOut: nowStr,
          gpsVerified: inPerimeter && matchingLog.gpsVerified
        };
        submitAttendanceLog(updatedLog);
      } else {
        // Force log creation if no prior check-in
        updatedLog = {
          id: `ATT-${Date.now()}`,
          employeeId: staff.id,
          employeeName: staff.fullName,
          date: todayStr,
          checkIn: '08:00:00',
          checkOut: nowStr,
          status: 'Present',
          method: 'GPS',
          gpsLocation: { lat: currentLat, lng: currentLng },
          gpsVerified: inPerimeter,
          overtimeHours: 1
        };
        submitAttendanceLog(updatedLog);
      }

      addNewAudit('ATTENDANCE_GPS_CHECKOUT', `Staff CLOCK-OUT registered: ${staff.fullName}. Out-time Recorded: ${nowStr}. Verified Perimeter: ${inPerimeter ? 'Secure' : 'Breached'}`);
      setSuccessMsg(`GPS check-out registered for ${staff.fullName} at ${nowStr}. Check-out location recorded: ${currentLat}, ${currentLng}.`);
    }

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Handle leave submission and update
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = employees.find(emp => emp.id === leaveEmpId);
    if (!staff) return;

    const newReq: LeaveRequest = {
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      leaveType: leaveType,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason || "Regulatory general physical health recovery",
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };

    const updatedLeaveHistory = staff.leaveRequests ? [...staff.leaveRequests, newReq] : [newReq];
    updateEmployee(staff.id, { leaveRequests: updatedLeaveHistory });
    addNewAudit('LEAVE_APPLY', `Staff leave request applied: ${staff.fullName} (${leaveType}) for ${leaveStart} to ${leaveEnd}`);
    
    setSuccessMsg(`Leave request filed for ${staff.fullName}. Awaiting Board/Admin verification.`);
    setLeaveReason('');
    
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  const handleUpdateLeaveStatus = (staffId: string, requestId: string, finalStatus: 'Approved' | 'Rejected') => {
    const staff = employees.find(emp => emp.id === staffId);
    if (!staff || !staff.leaveRequests) return;

    const updatedRequests = staff.leaveRequests.map(r => {
      if (r.id === requestId) {
        return { ...r, status: finalStatus, approvedOrRejectedBy: 'Administration Officer' };
      }
      return r;
    });

    const currentStaffStatus = finalStatus === 'Approved' ? 'On Leave' : 'Active';
    updateEmployee(staffId, { 
      leaveRequests: updatedRequests,
      status: currentStaffStatus as any
    });

    addNewAudit('LEAVE_ACTION', `Leave request ${requestId} for ${staff.fullName} was ${finalStatus}. Staff status set: '${currentStaffStatus}'`);
    setSuccessMsg(`Employee ${staff.fullName}'s leave request was ${finalStatus}. Workforce state synced.`);
  };

  // Submit continuous development clinical training
  const handleAddTrainingRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingTitle.trim() || !trainingProvider.trim()) {
      setErrorMsg("Please specify both Course Title and Certifying Authority.");
      return;
    }

    const staff = employees.find(emp => emp.id === trainingEmpId);
    if (!staff) return;

    const newTraining: TrainingRecord = {
      id: `TRN-${Math.floor(10000 + Math.random() * 90000)}`,
      title: trainingTitle,
      provider: trainingProvider,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week duration placeholder
      cpdPoints: parseInt(trainingCPD) || 5,
      status: trainingStatus,
      certificateUrl: `https://oromia.health.gov.et/certificates/verify?id=CPD-${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedTrainings = staff.trainingHistory ? [...staff.trainingHistory, newTraining] : [newTraining];
    updateEmployee(staff.id, { trainingHistory: updatedTrainings });
    addNewAudit('TRAINING_RECORD_ADD', `Coded CPD credentials for ${staff.fullName}: ${trainingTitle} (${trainingCPD} Points, ${trainingStatus})`);

    setSuccessMsg(`Successfully appended clinical training record to ${staff.fullName}'s verified dossier.`);
    setTrainingTitle('');
    setTrainingProvider('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Submit high-fidelity performance evaluation matrix
  const handleAddEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = employees.find(emp => emp.id === evalEmpId);
    if (!staff) return;

    const overall = parseFloat(((scoreClinical + scorePunctuality + scoreAffection + scoreTeamwork + scoreCompliance) / 5).toFixed(2));
    const newEval: PerformanceEvaluation = {
      id: `EVAL-${Math.floor(1000 + Math.random() * 9000)}`,
      evaluationDate: new Date().toISOString().split('T')[0],
      evaluatorName: evalName,
      period: evalPeriod,
      scores: {
        clinicalProficiency: scoreClinical,
        punctualityAttendance: scorePunctuality,
        patientCareAffection: scoreAffection,
        collaborationTeamwork: scoreTeamwork,
        complianceDocumentation: scoreCompliance
      },
      overallScore: overall,
      feedback: evalFeedback || "Demonstrates professional healthcare standards.",
      recommendations: evalRecs || "Maintain high diligence in clinical services."
    };

    const updatedEvals = staff.performanceEvaluations ? [...staff.performanceEvaluations, newEval] : [newEval];
    updateEmployee(staff.id, { performanceEvaluations: updatedEvals });
    addNewAudit('PERFORMANCE_EVALUATION_WRITE', `Composed clinical review appraisal for: ${staff.fullName}. Period: ${evalPeriod}. Overall score: ${overall}/5.0`);

    setSuccessMsg(`Performance evaluation saved & locked for ${staff.fullName}. Overall Board Index: ${overall}/5.0`);
    setEvalFeedback('');
    setEvalRecs('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  if (activeRole !== 'super_admin' && activeRole !== 'facility_admin') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl mx-auto my-12 text-center space-y-6 shadow-sm border-t-4 border-t-amber-500 animate-fade-in" id="staff-restricted-view">
        <div className="bg-amber-50 text-amber-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-8 h-8 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {currentLanguage === 'om' ? 'Galli Deeggarsaa Ittisa' : 'Access Restricted: Administrative HR Portal'}
          </h2>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            {currentLanguage === 'om' ? 'Kutaa galmee hordoffii ogeeyyii fayyaa' : 'Staff Management & Credentialing Workspace'}
          </p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          {currentLanguage === 'om'
            ? "Bu'uura qajeelfama federaalaa MUSTALI DIRS tiin, kutan kun qofa qooda fudhattoota bulchiinsaa fi Abbootii Taayitaa ol'aanoof eeyyamameera. Maaloo portal keessa gubbaarra jiru fayyadamanii roolii keessan jijjiiraa."
            : 'Under the national healthcare directive, view and access to the Staff Credentialing Ledger and Clinical Workspaces is restricted to authorized Facility Coordinators and Super Administrative Auditors only.'}
        </p>
        
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-w-sm mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span>Current Identity Role:</span>
            <span className="font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold uppercase">{activeRole}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Required Credentials:</span>
            <span className="text-blue-700 font-semibold">Facility Admin or Super Admin</span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-slate-400">
            {currentLanguage === 'om' ? 'Bira dabarsee saphutoota dabalataa ilaaluuf switcher gubba fayyadama.' : 'Please use the Role Switcher in the top portal bar to switch context to audit or manage.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="staff-management-container" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
      
      {/* Title block with localized descriptors */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl text-white shadow-xs">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.modTitle}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{t.modSubtitle}</p>
          </div>
        </div>

        {/* Local Sub-Navigation Bar */}
        <div id="staff-workspace-subtabs" className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200/60 max-w-full">
          <button
            id="st-btn-directory"
            onClick={() => setActiveSubTab('directory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'directory' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            📋 {t.tabDirectory}
          </button>
          <button
            id="st-btn-id_badges"
            onClick={() => {
              setActiveSubTab('id_badges');
              if (selectedEmployee) {
                setClockInEmpId(selectedEmployee.id);
                setLeaveEmpId(selectedEmployee.id);
                setTrainingEmpId(selectedEmployee.id);
                setEvalEmpId(selectedEmployee.id);
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'id_badges' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🪪 {t.tabBadging}
          </button>
          <button
            id="st-btn-attendance"
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'attendance' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ⏱️ {t.tabAttendance}
          </button>
          <button
            id="st-btn-leaves"
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'leaves' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🍁 {t.tabLeaves}
          </button>
          <button
            id="st-btn-trainings"
            onClick={() => setActiveSubTab('trainings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'trainings' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🎓 {t.tabTrainings}
          </button>
          <button
            id="st-btn-evaluations"
            onClick={() => setActiveSubTab('evaluations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'evaluations' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            📈 {t.tabEvaluations}
          </button>
        </div>
      </div>

      {/* Message Notifications Bar */}
      {successMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in" id="staff-success-alert">
          <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in" id="staff-error-alert">
          <AlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}


      {/* =========================================================================
                                      TAB 1: STAFF DIRECTORY
         ========================================================================= */}
      {activeSubTab === 'directory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="view-staff-directory">
          
          {/* Main Staff Registry Master List */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Healthcare Staff Ledger</h3>
              
              <div className="flex items-center gap-2">
                {/* Facility quick filter selector */}
                {userFacilityId ? (
                  <span className="bg-blue-100 border border-blue-200 text-blue-700 rounded-lg px-2.5 py-1 text-xs font-semibold select-none">
                    🏥 {facilities.find(f => f.id === userFacilityId)?.name || userFacilityId}
                  </span>
                ) : (
                  <select
                    id="dir-facility-filter"
                    value={selectedFacilityId}
                    onChange={(e) => setSelectedFacilityId(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                  >
                    <option value="all">🏥 All Facilities</option>
                    {facilities.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                )}

                <div className="relative">
                  <Search className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-slate-450" />
                  <input
                    id="dir-search"
                    type="text"
                    placeholder="Search name, role, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1 text-xs focus:outline-none w-40"
                  />
                </div>
              </div>
            </div>

            {/* Structured Table Ledger */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">{t.colId}</th>
                    <th className="px-4 py-3">{t.colName}</th>
                    <th className="px-4 py-3">{t.colRole}</th>
                    <th className="px-4 py-3">{t.colFacility}</th>
                    <th className="px-4 py-3">{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map(emp => {
                    const assignedClin = facilities.find(f => f.id === emp.facilityId);
                    return (
                      <tr 
                        key={emp.id}
                        onClick={() => {
                          setDirectorySelectedEmpId(emp.id);
                          setClockInEmpId(emp.id);
                          setLeaveEmpId(emp.id);
                          setTrainingEmpId(emp.id);
                          setEvalEmpId(emp.id);
                        }}
                        className={`cursor-pointer transition hover:bg-blue-50/20 ${emp.id === directorySelectedEmpId ? 'bg-blue-50/50' : ''}`}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">{emp.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{emp.fullName}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold">{emp.profession}</p>
                          <p className="text-[10px] text-slate-400">{emp.department}</p>
                        </td>
                        <td className="px-4 py-3 truncate max-w-[120px] font-medium text-slate-500">
                          {assignedClin ? assignedClin.name : "Oromia Health"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                            : emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border border-amber-150'
                            : 'bg-rose-50 text-rose-700 border border-rose-150'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-450 italic">No registered clinical staff found matching context.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Profile File Breakdown / Active Dossier of Selected Employee */}
            {selectedEmployee && (
              <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-4" id="staff-dossier-panel">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center font-bold text-blue-400 text-sm">
                      {selectedEmployee.fullName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        {selectedEmployee.fullName}
                        <span className="text-[10px] font-mono font-normal text-slate-400">({selectedEmployee.id})</span>
                      </h4>
                      <p className="text-xs text-slate-300 font-medium">{selectedEmployee.position} • {selectedEmployee.profession}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveSubTab('id_badges')}
                      className="bg-blue-600 hover:bg-blue-700 transition px-3 py-1 text-[10px] rounded-lg font-bold flex items-center gap-1.5 text-white"
                    >
                      <IdCard className="w-3.5 h-3.5" /> ID PASS
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to de-register employee ${selectedEmployee.fullName}? This cannot be undone.`)) {
                          deleteEmployee(selectedEmployee.id);
                          addNewAudit('EMPLOYEE_DELETE', `Revoked credentials and deleted employee ledger item: ${selectedEmployee.fullName} (${selectedEmployee.id})`);
                        }
                      }}
                      className="bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-400 transition px-2.5 py-1 text-[10px] rounded-md font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Department</span>
                    <p className="font-bold text-white mt-1">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Salary Rating</span>
                    <p className="font-bold text-emerald-400 mt-1">{selectedEmployee.salary.toLocaleString()} ETB</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Date of Hire</span>
                    <p className="font-bold text-slate-200 mt-1">{selectedEmployee.dateOfHire}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Qualifications</span>
                    <p className="font-bold text-slate-200 mt-1 truncate" title={selectedEmployee.education}>{selectedEmployee.education}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs border-t border-slate-900">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Contact: {selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Email: {selectedEmployee.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Registration Sidebar Panel Forms */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between" id="credentialing-form-panel">
            <form onSubmit={handleRegisterEmployee} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
                <UserPlus className="text-blue-600 w-4 h-4" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.lblRegForm}</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblFacility} *</label>
                {userFacilityId ? (
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold select-none">
                    🏥 {facilities.find(f => f.id === userFacilityId)?.name || userFacilityId}
                  </div>
                ) : (
                  <select
                    id="reg-facility"
                    value={formFacilityId}
                    onChange={(e) => setFormFacilityId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  >
                    {facilities.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblName} *</label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Dr. Solomon Beyene"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblGender}</label>
                  <select
                    id="reg-gender"
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblPhone} *</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="+251-912-3456"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">System Access Role</label>
                  <select
                    id="reg-system-role"
                    value={formSystemRole}
                    onChange={(e) => setFormSystemRole(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none text-slate-700 font-semibold"
                  >
                    <option value="Doctor">Doctor (Staff Role)</option>
                    <option value="HR Officer">HR Officer (Facility Admin Role)</option>
                    <option value="Store Keeper">Store Keeper (Staff Role)</option>
                    <option value="Staff">Staff (Staff Role)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblProfession}</label>
                  <select
                    id="reg-profession"
                    value={formProfession}
                    onChange={(e) => setFormProfession(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none text-slate-700"
                  >
                    <option value="Medical Doctor">Medical Doctor</option>
                    <option value="Nurse">Licensed Nurse</option>
                    <option value="Health Officer">Health Officer</option>
                    <option value="Biomedical Technician">Biomedical Equipment Technician</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="HR Administrator">Administrative Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Clinical / Admin Department</label>
                  <select
                    id="reg-department"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none text-slate-700"
                  >
                    <option value="Emergency & General Medicine">Emergency Clinic</option>
                    <option value="Critical Care & ICU">Critical Care & ICU</option>
                    <option value="Pediatrics & Neonatal Care">Pediatrics Clinic</option>
                    <option value="Inpatient Ward">Inpatient Ward</option>
                    <option value="Facility Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblSalary} *</label>
                  <input
                    id="reg-salary"
                    type="number"
                    required
                    placeholder="ETB Mindaa"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblHireDate}</label>
                  <input
                    id="reg-hiredate"
                    type="date"
                    value={formDateOfHire}
                    onChange={(e) => setFormDateOfHire(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblEmail} *</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="name@oromia.health.gov.et"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">{t.lblEducation}</label>
                <input
                  id="reg-education"
                  type="text"
                  placeholder="e.g. Doctor of Medicine (MD)"
                  value={formEducation}
                  onChange={(e) => setFormEducation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <button
                id="btn-submit-employee-form"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
              >
                💾 {t.btnRegisterStaff}
              </button>
            </form>
          </div>
        </div>
      )}


      {/* =========================================================================
                                      TAB 2: EMPLOYEE ID BADGING
         ========================================================================= */}
      {activeSubTab === 'id_badges' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="view-id-badge-generator">
          
          {/* Badge Selection & Meta Sidebar */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <IdCard className="text-blue-600 w-4 h-4" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Badge Office Station</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Select Licensed Employee</label>
                <select
                  id="badge-emp-select"
                  value={directorySelectedEmpId}
                  onChange={(e) => {
                    setDirectorySelectedEmpId(e.target.value);
                    setClockInEmpId(e.target.value);
                    setLeaveEmpId(e.target.value);
                    setTrainingEmpId(e.target.value);
                    setEvalEmpId(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none text-slate-700 font-bold"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                  ))}
                </select>
              </div>

              {selectedEmployee && (
                <div className="bg-white p-4.5 rounded-xl border border-slate-150 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400">Dossier Licensure</span>
                    <p className="font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> BOARD REGISTERED
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400">Card Status ID</span>
                    <p className="font-mono font-extrabold text-blue-600">{selectedEmployee.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400">Security Access Level</span>
                    <p className="font-semibold text-slate-700">
                      {selectedEmployee.department === 'Critical Care & ICU' ? 'Level 4 (ICU, Wards)' : 'Level 2 (Outpatient, Diagnostics)'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => window.print()}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print ID Badge Card
            </button>
          </div>

          {/* High Fidelity Badge Render Canvas */}
          <div className="lg:col-span-2 flex justify-center items-center p-6 bg-slate-100 rounded-2xl border border-slate-250 min-h-[450px]">
            {selectedEmployee ? (
              <div 
                id="printable-id-card-element"
                className="w-[280px] h-[440px] bg-white rounded-2xl border border-slate-350 shadow-md flex flex-col justify-between overflow-hidden relative"
              >
                {/* Visual Header Banner of Badge */}
                <div className="bg-slate-900 p-4 text-center border-b-4 border-blue-600 text-white relative">
                  <div className="absolute top-2 right-2 bg-blue-500/10 border border-blue-500/20 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-blue-400">
                    OR
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-white select-none">{t.badgeTemplateTitle}</h4>
                  <p className="text-[8px] text-slate-400 font-semibold select-none">OROMIA HEALTH BUREAU</p>
                </div>

                {/* Badge Center Body: Avatar & Major Details */}
                <div className="flex-1 flex flex-col justify-center items-center p-4 space-y-4">
                  {/* Photo Space placeholder with initials */}
                  <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-slate-200 flex items-center justify-center text-slate-700 shadow-inner font-black text-xl tracking-tight relative">
                    {selectedEmployee.fullName.split(' ').map(n=>n[0]).join('')}
                    {/* Security Hologram circle overlap */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500/20 rounded-full border border-blue-400/30 backdrop-blur-3xs" />
                  </div>

                  <div className="text-center space-y-1">
                    <h5 className="font-black text-slate-900 text-base leading-tight">{selectedEmployee.fullName}</h5>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{selectedEmployee.position}</p>
                    <p className="text-[10px] text-slate-450 font-medium">{selectedEmployee.profession}</p>
                  </div>

                  {/* Operational Clinic code indicator */}
                  <div className="bg-slate-50 border border-slate-150 rounded-lg px-3 py-1 font-mono text-[9px] text-center font-extrabold text-slate-600">
                    Facility Ref: {facilities.find(f => f.id === selectedEmployee.facilityId)?.id || "MOH-01"}
                  </div>
                </div>

                {/* Barcode & Key Generator Segment */}
                <div className="bg-slate-50 border-t border-slate-150 p-4.5 text-center flex flex-col items-center space-y-2">
                  {/* Simulated barcode bars */}
                  <div className="w-full h-8 flex justify-between items-stretch select-none" title="RFID Code Generated">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`bg-slate-900`}
                        style={{ width: `${Math.random() < 0.4 ? '1px' : Math.random() < 0.7 ? '2px' : '4px'}` }}
                      />
                    ))}
                  </div>
                  <div className="flex w-full justify-between items-center text-[8px] font-mono font-bold text-slate-500">
                    <span>* {selectedEmployee.id} *</span>
                    <span className="text-slate-400">Exp: Dec 31, 2027</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <IdCard className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">No Employee selected for Badge assignment.</p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* =========================================================================
                                      TAB 3: ATTENDANCE & GPS CHECK-IN/OUT
         ========================================================================= */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6 animate-fade-in" id="view-attendance-perimeter-verification">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Staff clock-in GPS Simulator */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <MapPin className="text-cyan-400 w-5 h-5 animate-pulse" />
                <div>
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">Perimeter GPS Simulator</h3>
                  <p className="text-[10px] text-slate-400">Staff coordinate clock-in dispatcher</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Active Staff</label>
                <select
                  id="gps-emp-select"
                  value={clockInEmpId}
                  onChange={(e) => setClockInEmpId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 font-bold"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>

              {/* Coordinates modifier */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 mb-1">Simulated Latitude</label>
                  <input
                    id="gps-lat"
                    type="number"
                    step="any"
                    value={simLat}
                    onChange={(e) => setSimLat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg p-1.5 text-center text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 mb-1">Simulated Longitude</label>
                  <input
                    id="gps-lng"
                    type="number"
                    step="any"
                    value={simLng}
                    onChange={(e) => setSimLng(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg p-1.5 text-center text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Autodetect / Snap coordinates buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Snap coordinates exactly at Facility GPS to simulate clean in-bounds
                    const staff = employees.find(e => e.id === clockInEmpId);
                    const facility = facilities.find(f => f.id === staff?.facilityId);
                    if (facility) {
                      setSimLat(facility.gps.lat.toString());
                      setSimLng(facility.gps.lng.toString());
                      addNewAudit('SNAP_GPS_IN_BOUNDS', `Snapped coordinates to active Facility: ${facility.name} (${facility.gps.lat}, ${facility.gps.lng})`);
                    }
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition"
                >
                  🎯 Snap Inside Clinic
                </button>
                <button
                  onClick={() => {
                    // Out of bounds simulation (Addis Ababa or remote coordinates)
                    setSimLat("9.0227");
                    setSimLng("38.7460");
                    addNewAudit('SNAP_GPS_OUT_BOUNDS', `Snapped coordinates Out of perimeter range (Addis coordinates)`);
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 text-rose-400 border border-slate-700 py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition"
                >
                  🏔️ Snap Outside Perimeter
                </button>
              </div>

              {/* Dynamic distance calculation message preview */}
              {clockInEmpId && (
                (() => {
                  const staff = employees.find(e => e.id === clockInEmpId);
                  const facility = facilities.find(f => f.id === staff?.facilityId);
                  if (facility) {
                    const dist = getHaversineDistance(
                      facility.gps.lat,
                      facility.gps.lng,
                      parseFloat(simLat) || 8.5414,
                      parseFloat(simLng) || 39.2689
                    );
                    const isOk = dist <= 500;
                    return (
                      <div className={`p-4 rounded-xl border text-xs ${isOk ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border-rose-800 text-rose-200'}`}>
                        <p className="font-bold flex items-center gap-1.5">
                          {isOk ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <MapPinOff className="w-4 h-4 text-rose-450" />}
                          {isOk ? "Perimeter Verification Good" : "Perimeter Verification Broken"}
                        </p>
                        <p className="text-[10px] text-slate-300 mt-1 select-none">
                          {t.lblDistance} <span className="font-mono font-bold text-white">{dist.toFixed(1)}m</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()
              )}

              {/* Active dispatch actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleSimulatedGPSClock('ClockIn')}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold text-xs py-2 px-3 rounded-lg text-center transition cursor-pointer"
                >
                  {t.btnCheckIn}
                </button>
                <button
                  onClick={() => handleSimulatedGPSClock('ClockOut')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg text-center transition cursor-pointer"
                >
                  {t.btnCheckOut}
                </button>
              </div>
            </div>

            {/* Attendance Ledger logs and admin controls */}
            <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance Registry Logs</h3>
                
                {/* Filter and reset */}
                <div className="flex gap-2">
                  <select
                    id="attn-log-filter"
                    value={selectedLogFilter}
                    onChange={(e) => setSelectedLogFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-md px-2 py-0.5 text-xs text-slate-650"
                  >
                    <option value="All">All Logs</option>
                    <option value="Late">Late Entries</option>
                    <option value="GPS_Breached">GPS Breaches</option>
                  </select>
                </div>
              </div>

              {/* Table rendering logs */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-[350px] overflow-y-auto">
                <table className="min-w-full text-xs text-left text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider sticky top-0 uppercase">
                    <tr>
                      <th className="px-3 py-2.5">Date</th>
                      <th className="px-3 py-2.5">Staff Name</th>
                      <th className="px-3 py-2.5">In / Out</th>
                      <th className="px-3 py-2.5">Method</th>
                      <th className="px-3 py-2.5">GPS Auth</th>
                      <th className="px-3 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {attendanceLogs
                      .filter(log => {
                        const matchesSearch = log.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
                        if (!matchesSearch) return false;
                        if (selectedLogFilter === 'Late') return log.status === 'Late';
                        if (selectedLogFilter === 'GPS_Breached') return log.gpsVerified === false;
                        return true;
                      })
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 font-mono font-bold text-slate-600">{log.date}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-900">{log.employeeName}</td>
                          <td className="px-3 py-2.5 font-semibold text-slate-700">
                            CheckIn: {log.checkIn} <br />
                            CheckOut: {log.checkOut || '--:--'}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="px-1.5 py-0.5 roundedbg bg-slate-100 text-slate-600 font-mono text-[9px] uppercase">{log.method}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`px-1.5 py-0.5 rounded-sm font-semibold select-none text-[9px] ${
                              log.gpsVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800 animate-pulse'
                            }`}>
                              {log.gpsVerified ? 'Verified OK' : 'GPS Breach'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              log.status === 'Present' ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'Late' ? 'bg-amber-100 text-amber-800 font-black'
                              : 'bg-rose-100 text-rose-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Manual Exception Entry Panel */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100" id="manual-audit-logs">
            <h4 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">Manual Admin Attendance Overrides</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Staff Member</label>
                <select
                  id="manual-emp"
                  value={manualLogEmpId}
                  onChange={(e) => setManualLogEmpId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Date Logged</label>
                <input
                  id="manual-date"
                  type="date"
                  value={manualLogDate}
                  onChange={(e) => setManualLogDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Status Override Override</label>
                <select
                  id="manual-stat"
                  value={manualLogStatus}
                  onChange={(e) => setManualLogStatus(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late (Under Review)</option>
                  <option value="Excused">Excused Leave</option>
                  <option value="Absent font-bold">Unexcused Absent</option>
                </select>
              </div>
              <button
                onClick={() => {
                  const staff = employees.find(e => e.id === manualLogEmpId);
                  if (!staff) return;
                  const newLog: AttendanceLog = {
                    id: `ATT-MAN-${Date.now()}`,
                    employeeId: staff.id,
                    employeeName: staff.fullName,
                    date: manualLogDate,
                    checkIn: '08:30:00',
                    checkOut: '17:30:00',
                    status: manualLogStatus,
                    method: 'Fingerprint',
                    gpsLocation: { lat: 0, lng: 0 },
                    gpsVerified: true,
                    overtimeHours: 0
                  };
                  submitAttendanceLog(newLog);
                  addNewAudit('ATTENDANCE_MANUAL_OVERRIDE', `Manual override set: ${staff.fullName} marked as '${manualLogStatus}' for ${manualLogDate}`);
                  setSuccessMsg(`Attendance Override set successfully for ${staff.fullName}`);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition"
              >
                Apply Admin Override
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =========================================================================
                                      TAB 4: LEAVE REQUESTS CONTROL
         ========================================================================= */}
      {activeSubTab === 'leaves' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="view-hrm-leaves-maternity-annual">
          
          {/* Submit Leave request */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <Calendar className="text-blue-600 w-4 h-4" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-extrabold">Request Leave Passage</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Select Clinical Applicant</label>
                <select
                  id="leave-emp"
                  value={leaveEmpId}
                  onChange={(e) => setLeaveEmpId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Leave Type</label>
                <select
                  id="leave-type-select"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Medical Leave</option>
                  <option value="Maternity Leave">Maternity Rest Passage</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Study Leave">Academic Study Special Leave</option>
                  <option value="Compassionate Leave">Family Compassionate Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Start Date</label>
                  <input
                    id="leave-start"
                    type="date"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-none text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">End Date</label>
                  <input
                    id="leave-end"
                    type="date"
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-none text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Reason & Remarks</label>
                <textarea
                  id="leave-reason"
                  rows={3}
                  required
                  placeholder="State clinical logic/reason for annual leave, medical reasons or study programs..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <button
                id="btn-apply-leave-submit"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition shadow-3xs cursor-pointer"
              >
                Submit Clinical Leave File
              </button>
            </form>
          </div>

          {/* Leave approvals workspace ledger */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Verified Active Leave Board</h3>
            
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {employees.flatMap(emp => 
                (emp.leaveRequests || []).map(req => ({
                  ...req,
                  empName: emp.fullName,
                  empId: emp.id,
                  empDep: emp.department
                }))
              ).map((req) => (
                <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-3xs hover:border-slate-350 transition">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        {req.empName}
                        <span className="font-mono text-[9px] font-normal text-slate-400">({req.empId})</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{req.empDep}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                      : req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-150 animate-pulse'
                      : 'bg-amber-50 text-amber-700 border border-amber-150'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-[10px]">
                    <div>
                      <span className="text-slate-400 font-medium block">Type</span>
                      <span className="font-bold text-slate-700">{req.leaveType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Duration</span>
                      <span className="font-bold text-slate-700">{req.startDate} to {req.endDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Applied On</span>
                      <span className="font-bold text-slate-700">{req.appliedAt}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-650 italic">Reason: "{req.reason}"</p>

                  {/* Operational approval buttons */}
                  {req.status === 'Pending' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-100 flex-wrap justify-end">
                      <button
                        onClick={() => handleUpdateLeaveStatus(req.empId, req.id, 'Rejected')}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-600 font-bold text-[10px] px-3 py-1 rounded-md transition"
                      >
                        ✕ Decline passage
                      </button>
                      <button
                        onClick={() => handleUpdateLeaveStatus(req.empId, req.id, 'Approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-1 rounded-md transition"
                      >
                        ✓ Approve Leave
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {employees.flatMap(e => e.leaveRequests || []).length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">No leave requests currently logged in the workspace.</div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* =========================================================================
                                      TAB 5: CLINICAL CPD TRAINING RECORDS
         ========================================================================= */}
      {activeSubTab === 'trainings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="view-clinical-cpd-certificates">
          
          {/* Append Training Log Forms */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <form onSubmit={handleAddTrainingRecord} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <Award className="text-blue-600 w-4 h-4 animate-bounce" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-extrabold">CPD Certificate Docket</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Select Participant</label>
                <select
                  id="train-emp"
                  value={trainingEmpId}
                  onChange={(e) => setTrainingEmpId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Course / Training Title *</label>
                <input
                  id="train-title"
                  type="text"
                  required
                  placeholder="e.g. ICU Respiratory Care Standards"
                  value={trainingTitle}
                  onChange={(e) => setTrainingTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Certifying provider / Authority *</label>
                <input
                  id="train-provider"
                  type="text"
                  required
                  placeholder="e.g. UNHCR, MOH Central Bureau"
                  value={trainingProvider}
                  onChange={(e) => setTrainingProvider(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">CPD Credits Assigned</label>
                  <input
                    id="train-cpd"
                    type="number"
                    required
                    value={trainingCPD}
                    onChange={(e) => setTrainingCPD(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Dossier Status</label>
                  <select
                    id="train-status"
                    value={trainingStatus}
                    onChange={(e) => setTrainingStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming program</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <button
                id="btn-add-training-record"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition mr-2 cursor-pointer"
              >
                Log Accredited CPD Training
              </button>
            </form>
          </div>

          {/* Trainings logs listing and visual CPD tally */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Licensed Continuous Education (CPD) Directory</h3>
            
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {employees.flatMap(emp => 
                (emp.trainingHistory || []).map(trn => ({
                  ...trn,
                  empName: emp.fullName,
                  empId: emp.id
                }))
              ).map((trn) => (
                <div key={trn.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 lg:flex lg:justify-between lg:items-center shadow-3xs">
                  <div className="space-y-1">
                    <span className="bg-blue-50 text-blue-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border border-blue-100 mr-2">CPD TALLY: {trn.cpdPoints} PTS</span>
                    <h4 className="font-extrabold text-slate-900 text-xs mt-1.5">{trn.title}</h4>
                    <p className="text-[10px] text-slate-450 font-bold">Issued by: {trn.provider} • Participant code: {trn.empName} ({trn.empId})</p>
                  </div>

                  <div className="flex gap-2.5 items-center justify-between lg:justify-end pt-2 lg:pt-0">
                    <span className="text-[10px] font-mono text-slate-400">{trn.startDate} to {trn.endDate}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      trn.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                      : trn.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-150 animate-pulse'
                      : 'bg-slate-100 text-slate-600 border border-slate-250'
                    }`}>
                      {trn.status}
                    </span>
                  </div>
                </div>
              ))}

              {employees.flatMap(e => e.trainingHistory || []).length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">No continuous educational CPD records currently loaded.</div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* =========================================================================
                                      TAB 6: APPRAISAL / EVALUATIONS
         ========================================================================= */}
      {activeSubTab === 'evaluations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="view-clinical-competency-evals">
          
          {/* Create Evaluation Performance Review */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <form onSubmit={handleAddEvaluation} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <TrendingUp className="text-blue-600 w-4 h-4" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-extrabold">Accreditation Appraisal</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Appraised Staff</label>
                <select
                  id="eval-emp"
                  value={evalEmpId}
                  onChange={(e) => setEvalEmpId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Evaluator *</label>
                  <input
                    id="eval-name-input"
                    type="text"
                    required
                    value={evalName}
                    onChange={(e) => setEvalName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Period *</label>
                  <input
                    id="eval-period-input"
                    type="text"
                    required
                    placeholder="e.g. Q2 2026"
                    value={evalPeriod}
                    onChange={(e) => setEvalPeriod(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Core Competencies Slider Matrix (1 to 5) */}
              <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <p className="text-[10px] font-extrabold text-[#1d4ed8] uppercase tracking-wider select-none">Appraisal Competency Indices (1-5)</p>
                
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-600 mb-1">
                    <span>Clinical proficiency</span>
                    <span className="font-bold text-slate-900">{scoreClinical}/5</span>
                  </div>
                  <input
                    id="eval-clinical-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={scoreClinical}
                    onChange={(e) => setScoreClinical(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-600 mb-1">
                    <span>Punctuality & Presence</span>
                    <span className="font-bold text-slate-900">{scorePunctuality}/5</span>
                  </div>
                  <input
                    id="eval-punctuality-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={scorePunctuality}
                    onChange={(e) => setScorePunctuality(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-600 mb-1">
                    <span>Patient Care & Affection</span>
                    <span className="font-bold text-slate-900">{scoreAffection}/5</span>
                  </div>
                  <input
                    id="eval-affection-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={scoreAffection}
                    onChange={(e) => setScoreAffection(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-600 mb-1">
                    <span>Collaboration & Teamwork</span>
                    <span className="font-bold text-slate-900">{scoreTeamwork}/5</span>
                  </div>
                  <input
                    id="eval-teamwork-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={scoreTeamwork}
                    onChange={(e) => setScoreTeamwork(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Appraiser Core Comments</label>
                <textarea
                  id="eval-feedback"
                  rows={2}
                  value={evalFeedback}
                  onChange={(e) => setEvalFeedback(e.target.value)}
                  placeholder="State review observations and clinical behavior appraisal details..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <button
                id="btn-add-evaluation-rating"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
              >
                Log Performance Evaluation
              </button>
            </form>
          </div>

          {/* Evaluations workspace appraisal list */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">National Health board Appraisals Output</h3>
            
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {employees.flatMap(emp => 
                (emp.performanceEvaluations || []).map(ev => ({
                  ...ev,
                  empName: emp.fullName,
                  empId: emp.id
                }))
              ).map((ev) => (
                <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-3xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{ev.empName}</h4>
                      <p className="text-[9px] text-slate-400 font-bold">Evaluator: {ev.evaluatorName} • Period: {ev.period}</p>
                    </div>

                    <div className="bg-blue-50 text-blue-800 rounded-lg p-2 border border-blue-150 text-center select-none">
                      <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-black">OVERALL INDEX</span>
                      <span className="text-sm font-black text-blue-600">{ev.overallScore} / 5.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[9px] border-t border-slate-100 font-semibold uppercase text-slate-600">
                    <div className="bg-slate-50 p-1 rounded border border-slate-100 text-center">
                      Proficiency: <span className="font-bold text-slate-900">{ev.scores.clinicalProficiency}</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-100 text-center">
                      Presence: <span className="font-bold text-slate-900">{ev.scores.punctualityAttendance}</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-100 text-center">
                      Care Affect: <span className="font-bold text-slate-900">{ev.scores.patientCareAffection}</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-100 text-center">
                      Teamwork: <span className="font-bold text-slate-900">{ev.scores.collaborationTeamwork}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-650 italic leading-snug mt-1">" {ev.feedback} "</p>
                </div>
              ))}

              {employees.flatMap(e => e.performanceEvaluations || []).length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">No appraisal files loaded for active staff portfolio.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
