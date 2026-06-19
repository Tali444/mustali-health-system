/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TenantFacility,
  Employee,
  AttendanceLog,
  Equipment,
  NonMedicalAsset,
  FeedbackItem,
  PublicAnnouncement,
  ProgramEvent,
  AuditLog,
  PayrollSlip,
  StaffRouteHistory,
  SystemUser,
  VaccineStock
} from '../types';

// Multilingual Dictionary (English and Afaan Oromo)
export const dictionary = {
  en: {
    appTitle: "MUSTALI DIRS Fayyaa",
    appSubtitle: "Enterprise Health Information & Resource Management System",
    communityPortal: "Community Portal",
    facilityAdmin: "Facility Administration",
    employeePortal: "Staff Portal",
    superAdmin: "Super Admin Console",
    technicalSpecs: "Technical & Developer Docs",
    
    // Statuses & UI Core Labels
    online: "CONNECTED (ONLINE)",
    offline: "LOCAL STAGE (OFFLINE)",
    syncQueue: "Sync Queue",
    syncStatus: "State Synchronization",
    syncNow: "Sync Changes Now",
    allSynced: "All changes synchronized.",
    pendingTenant: "Tenant Activations Pending",
    approvedTenant: "Approved Facilities",
    rejected: "Rejected",
    active: "Active",
    inactive: "Inactive",
    
    // Module 1: Citizen Exchange
    provideHeader: "Public Health Information Desk",
    viewFacilities: "Find Health Facilities & Real-time Waiting Times",
    emergencyContacts: "Emergency Contacts & On-call Doctors",
    waitingQueueMsg: "Live waiting time represents direct patient metrics",
    patientsWaiting: "Patients waiting",
    estTime: "Estimated waiting time",
    onCallRoster: "On-call Duty Doctors",
    outbreakAlerts: "Outbreak Alerts & Vaccination Campaigns",
    submitCitizenFeedback: "Submit Complaint or Suggestion",
    trackFeedback: "Track Feedback Resolution Status",
    citizenName: "Citizen Full Name",
    citizenContact: "Contact Details (Phone/Email)",
    feedbackType: "Feedback Type",
    complaint: "Complaint",
    suggestion: "Suggestion",
    selectFacility: "Select Health Facility",
    subject: "Subject / Issue Title",
    details: "Elaborated Details",
    serviceRating: "Rate Facility Service Quality",
    submitFeedbackBtn: "Submit Feedback Record",
    feedbackStatus: "Feedback Action History",
    
    // Module 2: Facility management
    facilityName: "Facility Name",
    facilityCode: "Unique Facility Code",
    facilityType: "Health Facility Type",
    licenseNo: "Operational License Number",
    region: "Region",
    zone: "Zone",
    woreda: "Woreda",
    kebele: "Kebele",
    gpsCoords: "GPS Coordinates",
    registerFacility: "Register Health Facility",
    pendingApproval: "Pending Super-Admin Review & Security Check",
    
    // Module 3: HRMS
    employeeId: "Employee ID Number",
    fullName: "Employee Full Name",
    gender: "Gender",
    phone: "Phone Number",
    email: "Email Address",
    address: "Residential Address",
    profession: "Medical / Admin Profession",
    education: "Academic Qualification",
    department: "Assigned Department",
    position: "Position Title",
    salary: "Base Monthly Salary (ETB)",
    dateOfHire: "Date of Employment",
    trainingHistory: "CPD & Practical Training History",
    addEmployee: "Register New Employee Staff",
    employmentStatus: "Employment Status",
    
    // Module 4: Attendance
    gpsAttendance: "Check-in with GPS Verification",
    fingerprintSim: "Acknowledge Fingerprint Biometrics",
    faceSim: "Verify Face biometrics Scanner",
    attendanceLog: "Live Attendance Logs",
    checkIn: "Punch-In Check",
    checkOut: "Punch-Out Check",
    lateReason: "Late Code Reason",
    overtimeWorked: "Overtime Hours Calculated",
    generateAttendanceRep: "Compile Professional Roster Report",
    
    // Module 5: Payroll
    monthlyPayroll: "System Automated Payroll Generator (ETB)",
    allowances: "Allowances (Pensions, Danger, Duty)",
    deductions: "Deductions (Income Tax, Social Contribution)",
    netSalary: "Generated Net Take-home Pay",
    payslipHistory: "Official Monthly Digital Payslips",
    calculatePayrollBtn: "Recalculate Current Roster Payroll",
    
    // Module 6: Training
    cpdTracking: "CPD Credits & Specialized Certificates",
    trainingProvider: "Authorized Training Provider",
    cpdPoints: "CPD Points Earned",
    upcomingTrainings: "Up-coming Institutional Trainings",
    
    // Module 7: Location
    liveMapTitle: "Simulated Real-time GPS Asset & Field Staff Map",
    staffLiveLoc: "Field Activities & Staff Live Route Coordinates",
    trackRouteHistory: "View Assigned Active Outreach Routes",
    
    // Module 8: Calendar
    programCalendar: "Program & Outreach Activity Schedules",
    campaignActivities: "Vaccination Drives & Community Outreach",
    meetingsMeetings: "Clinical Meetings & Symposia",
    
    // Module 9 & 10: Inventory
    medicalEquip: "Clinical & Life-support Equipment Register",
    nonMedicalAssets: "Non-medical Enterprise Asset Register",
    equipmentStatus: "Current Operating Status",
    warrantyDetails: "Warranty Coverage (Years)",
    maintenanceCost: "Reported Maintenance Repair Costs",
    transferAsset: "Transfer Asset Responsibility",
    
    // Administrative & Security
    auditLog: "Secure Immutable System Audit Logs",
    mfaSim: "Simulated MFA Token Gate",
    securityAuditHeader: "Enterprise Security Architecture & Disaster Recovery Tools",
    backupPanel: "Manual Snapshot Encryption & Remote Backups"
  },
  om: {
    appTitle: "MUSTALI DIRS Fayyaa",
    appSubtitle: "Sirna Odeeffannoo Fayyaa fi Bulchiinsa Qabeenyaa",
    communityPortal: "Portaali Hawaasaa",
    facilityAdmin: "Bulchiinsa Dhaabbata Fayyaa",
    employeePortal: "Portaali Hojjeetaa",
    superAdmin: "Konsooli To'annoo Super Admin",
    technicalSpecs: "Ragaawwan Teeknikaa fi Developer",
    
    // Statuses & UI Core Labels
    online: "FEE’AMEE JIRA (ONLINE)",
    offline: "KAA’AMA LOCAL (OFFLINE)",
    syncQueue: "Tartiiba Sync",
    syncStatus: "Sinxironaayizeeshinii Ragaa",
    syncNow: "Amma Ragaa Sinxironaayiz Godhi",
    allSynced: "Giddu-galli jijjiirama hundaa wal-giteera.",
    pendingTenant: "Dhaabbata Fayyaa Galmee Eeggatan",
    approvedTenant: "Dhaabbilee Fayyaa Heyyamameef",
    rejected: "Didiitti",
    active: "Hojicha Irra Kan Jiru",
    inactive: "Hojii Dhaabeera",
    
    // Module 1: Citizen Exchange
    provideHeader: "Minjaala Odeeffannoo Fayyaa Hawaasaa",
    viewFacilities: "Dhaabbilee Fayyaa fi Yeroo Eegumsaa Agarsiisi",
    emergencyContacts: "Quunnamtii Ariifachiisaa fi Ogeeyyii Fayyaa Geeggessan",
    waitingQueueMsg: "Yeroon eegumsaa dalgaa metrics dhukkubsataa agarsiisa",
    patientsWaiting: "Kan eeggachaa jiran",
    estTime: "Yeroo eegumsaa tilmaamame",
    onCallRoster: "Ogeeyyii Fayyaa On-Call Hojii Irra Jiran",
    outbreakAlerts: "Akkasumas Hubannoo dhibee fi Duula Talaallii Fayyaa",
    submitCitizenFeedback: "Koomii ykn Yaada Submit Godhi",
    trackFeedback: "Hordoffii Haala Koomii fi Deebii",
    citizenName: "Maqaa Guutuu Lammii",
    citizenContact: "Quunnamtii Lammii (Bilbila/Email)",
    feedbackType: "Gosa Yaadaa",
    complaint: "Koomii",
    suggestion: "Yaada",
    selectFacility: "Dhaabbata Fayyaa Filadhu",
    subject: "Yeroo Mata-duree / Dhimma",
    details: "Ibsa Guutuu Koomii ykn Yaadaa",
    serviceRating: "Sadarkaa Tajaajila Dhaabbatichaa",
    submitFeedbackBtn: "Yaada Submit Godhi",
    feedbackStatus: "Hordoffii Adeemsa yaadaa",
    
    // Module 2: Facility management
    facilityName: "Maqaa Dhaabbata Fayyaa",
    facilityCode: "Koodii Dhaabbataa Addaa",
    facilityType: "Gosa Dhaabbata Fayyaa",
    licenseNo: "Lakkoofsa Heyyama Hojii",
    region: "Naannoo",
    zone: "Godina",
    woreda: "Aanaa",
    kebele: "Ganda",
    gpsCoords: "GPS Coordinates",
    registerFacility: "Dhaabbata Fayyaa Galmeessi",
    pendingApproval: "Eegumsa Mirkaneessa Super Admin",
    
    // Module 3: HRMS
    employeeId: "Lakkoofsa ID Hojjetaa",
    fullName: "Maqaa Guutuu Hojjetaa",
    gender: "Saala",
    phone: "Lakkoofsa Bilbilaa",
    email: "Imeelii",
    address: "Teessoo Residential",
    profession: "Ogummaa (Fayyaa / Bulchiinsa)",
    education: "Sadarkaa Barnootaa",
    department: "Kutaa Hojii",
    position: "Gahee Hojii",
    salary: "Mindaa Ka’umsa Ji’aa (ETB)",
    dateOfHire: "Guyyaa Hojii Jalqabe",
    trainingHistory: "Seenaa Leenjii Leenjifamaa",
    addEmployee: "Hojjetaa Haaraa Galmeessi",
    employmentStatus: "Haala Hojii",
    
    // Module 4: Attendance
    gpsAttendance: "Check-In Mirkaneessa GPS",
    fingerprintSim: "Biometrics Of-eeggannoo Fingerprint",
    faceSim: "Biometrics Of-eeggannoo Face Scanner",
    attendanceLog: "Galmee Hordoffii Hojii (Attendance)",
    checkIn: "Sa’aatii Jalqabaa",
    checkOut: "Sa’aatii Barnootaa",
    lateReason: "Sababa Hifannoo Yeroo",
    overtimeWorked: "Sa’aatii Dabalataa Hojjetame",
    generateAttendanceRep: "Gabaasa Hordoffii attendance Compile Godhi",
    
    // Module 5: Payroll
    monthlyPayroll: "Hanga Mindaa Ji'aa Automatikiin (ETB)",
    allowances: "Duroo dabalataa (Allowances)",
    deductions: "Kutaa (Tax, Social Fund)",
    netSalary: "Mindaa Hafe Mirkaneessa",
    payslipHistory: "Slipy Mindaa Ji'aa",
    calculatePayrollBtn: "Mindaa Roster Ammee Recalculate Godhi",
    
    // Module 6: Training
    cpdTracking: "CPD Credits fi Ragaawwan Leenjii",
    trainingProvider: "Dhaabbata Leenjii Kennu",
    cpdPoints: "Qabxii CPD Argatame",
    upcomingTrainings: "Leenjiiwwan Institutional Fuulduraa",
    
    // Module 7: Location
    liveMapTitle: "Maappii GPS Staff fi Qabeenya Jiraa",
    staffLiveLoc: "Kallattii fi Seenaa Hojjeetaa Outreach",
    trackRouteHistory: "Seenaa Kallattii Imala Hojjeetaa Hordofi",
    
    // Module 8: Calendar
    programCalendar: "Sagantaa Hooggansa Hojii fi Outreach",
    campaignActivities: "Duula Talaallii fi Outreach Hawaasaa",
    meetingsMeetings: "Walga'ii Kiliinikaa fi Symposia",
    
    // Module 9 & 10: Inventory
    medicalEquip: "Galmeessa Meeshaalee Kiliinikaa fi Siree",
    nonMedicalAssets: "Galmeessa Qabeenya Fayyaa Dabalataa",
    equipmentStatus: "Haala Meeshaa Ammee",
    warrantyDetails: "Wabii Meeshaa Ammee (Waggaan)",
    maintenanceCost: "Baasii Haaromsa Meeshaa",
    transferAsset: "Dabarsa Itti-gaafatamummaa Qabeenyaa",
    
    // Administrative & Security
    auditLog: "Audit Logs Amansiisaa To'annoo Sirnaa",
    mfaSim: "MFA Token Simuu",
    securityAuditHeader: "Ragaalee Teeknikaa Ijaarsa Security fi Disaster Recovery",
    backupPanel: "Backup Ragaalee fi Enkripshinii"
  }
};

// Initial Registered Health Facilities (Tenants)
export const initialFacilities: TenantFacility[] = [
  {
    id: "F-101",
    name: "Adama General Hospital",
    code: "ADMHSP-01",
    type: "General Hospital",
    licenseNo: "O-MOH-2025-0019",
    region: "Oromia",
    zone: "East Shewa",
    woreda: "Adama Woreda",
    kebele: "Kebele 04",
    gps: { lat: 8.5414, lng: 39.2689 },
    phone: "+251-22-111-9090",
    email: "adama.gen@health.gov.et",
    status: "approved",
    createdAt: "2025-01-12T08:00:00Z",
    patientsWaiting: 14,
    estimatedWaitMinutes: 25,
    onCallDoctors: ["Dr. Chala Gemechu (Emergency)", "Dr. Aster Tolossa (Pediatrics)"]
  },
  {
    id: "F-102",
    name: "Bishoftu Primary Hospital",
    code: "BSFHSP-02",
    type: "Primary Hospital",
    licenseNo: "O-MOH-2025-0024",
    region: "Oromia",
    zone: "East Shewa",
    woreda: "Bishoftu",
    kebele: "Kebele 02",
    gps: { lat: 8.7522, lng: 38.9785 },
    phone: "+251-11-433-8080",
    email: "bishoftu.primary@health.gov.et",
    status: "approved",
    createdAt: "2025-02-15T09:30:00Z",
    patientsWaiting: 4,
    estimatedWaitMinutes: 10,
    onCallDoctors: ["Dr. Kenenisa Dibaba (OB/GYN)"]
  },
  {
    id: "F-103",
    name: "Jimma Specialized Hospital",
    code: "JIMSPL-03",
    type: "Regional Hospital",
    licenseNo: "O-MOH-2024-0010",
    region: "Oromia",
    zone: "Jimma",
    woreda: "Jimma Town",
    kebele: "Kebele 01",
    gps: { lat: 7.6732, lng: 36.8347 },
    phone: "+251-47-111-2020",
    email: "jimma.specialized@health.gov.et",
    status: "approved",
    createdAt: "2024-11-20T10:00:00Z",
    patientsWaiting: 32,
    estimatedWaitMinutes: 55,
    onCallDoctors: ["Dr. Tsegaye Megersa (Surgery)", "Dr. Lelise Bekele (Internal Medicine)"]
  },
  {
    id: "F-104",
    name: "Shashemene Health Center",
    code: "SHS-HC-04",
    type: "Health Center",
    licenseNo: "O-MOH-2025-0112",
    region: "Oromia",
    zone: "West Arsi",
    woreda: "Shashemene Woreda",
    kebele: "Malima Kebele",
    gps: { lat: 7.1996, lng: 38.5975 },
    phone: "+251-46-102-1144",
    email: "shashemene.hc@health.gov.et",
    status: "approved",
    createdAt: "2025-03-01T11:45:00Z",
    patientsWaiting: 8,
    estimatedWaitMinutes: 18,
    onCallDoctors: ["Sr. Bontu Gerba (Midwifery)"]
  },
  {
    id: "F-105",
    name: "Bule Hora Referral Hospital",
    code: "BHR-HSP-05",
    type: "Regional Hospital",
    licenseNo: "O-MOH-2026-0044",
    region: "Oromia",
    zone: "West Guji",
    woreda: "Bule Hora",
    kebele: "Kebele 03",
    gps: { lat: 5.6353, lng: 38.2394 },
    phone: "+251-46-231-9011",
    email: "bulehora.ref@health.gov.et",
    status: "pending",
    createdAt: "2026-06-10T08:30:00Z",
    patientsWaiting: 0,
    estimatedWaitMinutes: 0,
    onCallDoctors: ["Dr. Galgalo Guyo (Trauma Medicine)"]
  },
  {
    id: "F-106",
    name: "Nekemte Primary Hospital",
    code: "NKM-HSP-06",
    type: "Primary Hospital",
    licenseNo: "O-MOH-2026-0082",
    region: "Oromia",
    zone: "East Welega",
    woreda: "Nekemte Woreda",
    kebele: "Chaffee Kebele",
    gps: { lat: 9.0812, lng: 36.5492 },
    phone: "+251-57-211-4040",
    email: "nekemte.primary@health.gov.et",
    status: "pending",
    createdAt: "2026-06-12T14:20:00Z",
    patientsWaiting: 0,
    estimatedWaitMinutes: 0,
    onCallDoctors: ["Dr. Tolera Gudina (Emergency Specialist)"]
  }
];

// Initial Personnel (Employees)
export const initialEmployees: Employee[] = [
  {
    id: "EMP-2025-01",
    facilityId: "F-101",
    fullName: "Dr. Chala Gemechu",
    gender: "Male",
    phone: "+251-911-343536",
    email: "chala.gemechu@adamahealth.org",
    address: "Kebele 05, Adama Town",
    profession: "Medical Doctor (Emergency)",
    education: "Doctor of Medicine (AAU), Specialty in Emergency Medicine",
    department: "Emergency Care Unit",
    position: "Chief Emergency Physician",
    salary: 32000,
    status: "Active",
    dateOfHire: "2025-02-01",
    trainingHistory: [
      {
        id: "T-01",
        title: "Advanced Cardiac Life Support (ACLS)",
        provider: "Federal Ministry of Health (MOH)",
        startDate: "2025-03-10",
        endDate: "2025-03-15",
        cpdPoints: 15,
        status: "Completed",
        certificateUrl: "cert_acls_chala_2025.pdf"
      }
    ],
    attendanceSummary: { present: 22, late: 1, excused: 1, overtimeHours: 12 }
  },
  {
    id: "EMP-2025-02",
    facilityId: "F-101",
    fullName: "Dr. Aster Tolossa",
    gender: "Female",
    phone: "+251-922-878990",
    email: "aster.tolossa@adamahealth.org",
    address: "Kebele 02, Adama Town",
    profession: "Pediatrician",
    education: "MD from Harar Health College, Pediatrics Residency",
    department: "Pediatrics & Child Health",
    position: "Senior Pediatrician",
    salary: 28500,
    status: "Active",
    dateOfHire: "2025-03-15",
    trainingHistory: [
      {
        id: "T-02",
        title: "Integrated Management of Newborn and Childhood Illness (IMNCI)",
        provider: "UNICEF Ethiopia",
        startDate: "2025-05-02",
        endDate: "2025-05-08",
        cpdPoints: 18,
        status: "Completed",
        certificateUrl: "cert_imnci_aster.pdf"
      }
    ],
    attendanceSummary: { present: 20, late: 0, excused: 2, overtimeHours: 6 }
  },
  {
    id: "EMP-2025-03",
    facilityId: "F-102",
    fullName: "Dr. Kenenisa Dibaba",
    gender: "Male",
    phone: "+251-912-556677",
    email: "kenenisa.d@bishoftuhealth.org",
    address: "Bishoftu Town, Near Crater Lake",
    profession: "OB/GYN Specialist",
    education: "M.D. from Jimma University",
    department: "Obstetrics and Gynecology",
    position: "Senior OB/GYN Physician",
    salary: 29800,
    status: "Active",
    dateOfHire: "2025-01-10",
    trainingHistory: [
      {
        id: "T-03",
        title: "Advanced Emergency Obstetric and Newborn Care (BEmONC)",
        provider: "Oromia Regional Health Bureau",
        startDate: "2025-02-18",
        endDate: "2025-02-23",
        cpdPoints: 20,
        status: "Completed",
        certificateUrl: "bemonc_kenenisa_cert.pdf"
      }
    ],
    attendanceSummary: { present: 21, late: 2, excused: 0, overtimeHours: 15 }
  },
  {
    id: "EMP-2025-04",
    facilityId: "F-101",
    fullName: "Sr. Bontu Gerba",
    gender: "Female",
    phone: "+251-944-112233",
    email: "bontu.gerba@adamahealth.org",
    address: "Woreda 02, Shashemene",
    profession: "Midwife Professional",
    education: "BSc in Midwifery from Hawassa University",
    department: "Maternity Ward",
    position: "Head Midwife",
    salary: 16500,
    status: "Active",
    dateOfHire: "2025-04-01",
    trainingHistory: [
      {
        id: "T-04",
        title: "Family Planning & Long Acting Contraceptives",
        provider: "Marie Stopes International",
        startDate: "2025-04-10",
        endDate: "2025-04-14",
        cpdPoints: 12,
        status: "Completed",
        certificateUrl: "fp_bontu_2025.pdf"
      }
    ],
    attendanceSummary: { present: 23, late: 0, excused: 1, overtimeHours: 8 }
  }
];

// Seeded Attendance Logs to show calculations
export const initialAttendance: AttendanceLog[] = [
  {
    id: "ATT-1001",
    employeeId: "EMP-2025-01",
    employeeName: "Dr. Chala Gemechu",
    date: "2026-06-15",
    checkIn: "07:52 AM",
    checkOut: "05:15 PM",
    status: "Present",
    method: "GPS",
    gpsLocation: { lat: 8.5415, lng: 39.2688 },
    gpsVerified: true,
    overtimeHours: 1
  },
  {
    id: "ATT-1002",
    employeeId: "EMP-2025-02",
    employeeName: "Dr. Aster Tolossa",
    date: "2026-06-15",
    checkIn: "08:14 AM",
    checkOut: "04:58 PM",
    status: "Late",
    method: "Face Recognition",
    gpsLocation: { lat: 8.5414, lng: 39.2689 },
    gpsVerified: true,
    overtimeHours: 0
  },
  {
    id: "ATT-1003",
    employeeId: "EMP-2025-03",
    employeeName: "Dr. Kenenisa Dibaba",
    date: "2026-06-15",
    checkIn: "07:44 AM",
    checkOut: "06:30 PM",
    status: "Present",
    method: "Fingerprint",
    gpsLocation: { lat: 8.7523, lng: 38.9784 },
    gpsVerified: true,
    overtimeHours: 2.5
  },
  {
    id: "ATT-1004",
    employeeId: "EMP-2025-04",
    employeeName: "Sr. Bontu Gerba",
    date: "2026-06-15",
    checkIn: "07:58 AM",
    checkOut: "04:30 PM",
    status: "Present",
    method: "GPS",
    gpsLocation: { lat: 8.5412, lng: 39.2690 },
    gpsVerified: true,
    overtimeHours: 0
  }
];

// Seeded Equipment Logs (Clinical / medical equipment)
export const initialEquipment: Equipment[] = [
  {
    id: "EQP-M301",
    facilityId: "F-101",
    name: "Mindray SV300 Ventilator",
    category: "ICU & Life Support",
    serialNumber: "SN-MIND-SV300-88129",
    purchaseDate: "2024-03-10",
    supplier: "Medical Equipment Suppliers Ethiopia (MESE)",
    warrantyYears: 3,
    status: "Operational",
    maintenanceHistory: [
      {
        id: "M-01",
        date: "2025-10-12",
        description: "Standard oxygen sensor calibration and filter replacement",
        cost: 4500,
        technician: "Abebe Kebede (Lead Bio-Medical Eng.)"
      }
    ],
    assignmentHistory: [
      {
        id: "A-01",
        date: "2025-11-01",
        assignedTo: "ICU Unit B",
        department: "Intensive Care Unit"
      }
    ]
  },
  {
    id: "EQP-U202",
    facilityId: "F-101",
    name: "GE Voluson E8 Ultrasound Machine",
    category: "Radiology & Imaging",
    serialNumber: "SN-GEVOL-E8-10294",
    purchaseDate: "2024-05-18",
    supplier: "Global Med-Tech Plc",
    warrantyYears: 5,
    status: "Operational",
    maintenanceHistory: [],
    assignmentHistory: [
      {
        id: "A-02",
        date: "2024-06-01",
        assignedTo: "Obstetrics Gynae Imaging Rm 3",
        department: "Maternity Care Unit"
      }
    ]
  },
  {
    id: "EQP-A404",
    facilityId: "F-102",
    name: "Aero-Centrifuge Benchtop Model",
    category: "Laboratory Equipment",
    serialNumber: "SN-AEROBC-9920",
    purchaseDate: "2025-01-22",
    supplier: "Horizon Diagnostics Trade Plc",
    warrantyYears: 2,
    status: "Under Maintenance",
    maintenanceHistory: [
      {
        id: "M-02",
        date: "2026-05-02",
        description: "Motor rotor imbalance inspection, waiting on parts",
        cost: 8200,
        technician: "Omer Mohammed (Technician)"
      }
    ],
    assignmentHistory: []
  },
  {
    id: "EQP-X509",
    facilityId: "F-103",
    name: "Siemens Mobilette Elara Max Mobile X-Ray",
    category: "Radiology & Imaging",
    serialNumber: "SN-SIEM-XRAY-44319",
    purchaseDate: "2023-11-15",
    supplier: "Siemens Healthineers Ethiopia",
    warrantyYears: 3,
    status: "Operational",
    maintenanceHistory: [
      {
        id: "M-03",
        date: "2025-12-05",
        description: "High voltage cabling routing checks & shield certification",
        cost: 11000,
        technician: "Biomedical Eng. Squad (MOH)"
      }
    ],
    assignmentHistory: []
  }
];

// Seeded Non-Medical Corporate Assets
export const initialAssets: NonMedicalAsset[] = [
  {
    id: "AST-CONF-12",
    facilityId: "F-101",
    name: "Administrative Boardroom Solid Mahogany Table & Chairs Set",
    category: "Furniture",
    status: "In Use",
    registrationNo: "REG-F-101-FRN-0012",
    location: "Block A, 2nd Floor, Admin Hall",
    assignedTo: "Hospital General Director Office",
    maintenanceHistory: []
  },
  {
    id: "AST-VEH-01",
    facilityId: "F-10 ]1",
    name: "Toyota Land Cruiser Ambulance 4WD",
    category: "Vehicles",
    status: "In Use",
    registrationNo: "REG-F-101-VEH-0001",
    location: "Vehicle Garage and Dispatch",
    assignedTo: "Emergency Ambulance dispatch unit",
    maintenanceHistory: [
      {
        id: "M-V-01",
        date: "2026-04-10",
        description: "Tyre replacements, front suspension shock absorber replacement",
        cost: 38000,
        technician: "Zewdu Motors Shop"
      }
    ]
  },
  {
    id: "AST-SRV-04",
    facilityId: "F-101",
    name: "Dell PowerEdge Server for local MUSTALI Offline Database Storage",
    category: "Computers",
    status: "In Use",
    registrationNo: "REG-F-101-SRV-0004",
    location: "Server Room, Basement Room 12",
    assignedTo: "Hospital Health IT Network Administrator",
    maintenanceHistory: []
  },
  {
    id: "AST-BLD-01",
    facilityId: "F-102",
    name: "Outpatient Department (OPD) Main Building Facility Complex",
    category: "Buildings",
    status: "In Use",
    registrationNo: "REG-F-102-BLD-0001",
    location: "Main Street Plot, Bishoftu Center",
    assignedTo: "Estate Operations & Facility Safety",
    maintenanceHistory: []
  }
];

// Outbreaks and Community Announcements
export const initialAnnouncements: PublicAnnouncement[] = [
  {
    id: "ANN-301",
    facilityId: "F-101",
    facilityName: "Adama General Hospital",
    titleEn: "Urgent Outbreak Alert: Active Cholera Cases Identified",
    titleOm: "Akeekkachiisa Ariifachiisaa: Dhibeen Cholera Mul'atee Jira",
    type: "outbreak",
    detailsEn: "Preventive response activated. Please thoroughly boil drinking water, clean raw foods with chlorinated solutions, and present urgently to Adama General Emergency Ward for acute watery diarhea symptoms.",
    detailsOm: "Tarkaanfiin ittisaa hojiirra ooleera. Maaloo bishaan dhugaatii bilcheessaa, midhaan qulqulleessaa, dhibba gubaa/bifa bishaanii qabaannaan ariitiin gara emergency Adama koottaa.",
    date: "2026-06-14"
  },
  {
    id: "ANN-302",
    facilityId: "F-102",
    facilityName: "Bishoftu Primary Hospital",
    titleEn: "Regional Measles & Rubella Vaccination Campaign June 2026",
    titleOm: "Duula Talaallii Gifiraa fi Rubellaha Waxabajjii 2026",
    type: "campaign",
    detailsEn: "Free mass children vaccination campaigns starting June 18th to June 25th in all Primary Health Posts and Kebele administration grounds for children ages 6 months to 15 years.",
    detailsOm: "Talaallii bilisaa daa'immanii Waxabajjii 18 hanga 25tti Kebele hundatti hundeeffamee jira daa'imman ji'a 6 hanga waggaa 15f.",
    date: "2026-06-15"
  },
  {
    id: "ANN-303",
    facilityId: "F-101",
    facilityName: "Adama General Hospital",
    titleEn: "Seasonal Influenza Precautions during rainy season",
    titleOm: "Ofeggannoo Dhukkuba Influenza Yeroo gannaatti",
    type: "general",
    detailsEn: "Avoid crowded closed settings, ensure warm insulation for pediatrics, and utilize clinical hygiene guidance published at the public health board.",
    detailsOm: "Bakka namoonni baay'atan irraa fagaadhaa, daa'imman qorruu ittisaa, gorsa fayyaa minjaala irratti maxxanfame hordofaa.",
    date: "2026-06-16"
  }
];

// Citizen suggestions, complaints and feedback
export const initialFeedbacks: FeedbackItem[] = [
  {
    id: "FB-801",
    facilityId: "F-101",
    facilityName: "Adama General Hospital",
    citizenName: "Dereje Haile",
    citizenContact: "dereje.haile@gmail.com",
    type: "Complaint",
    subject: "Long wait queues at Orthopedic OPD clinic on Mondays",
    details: "I arrived at 8:00 AM on Monday, but the attending orthopedic specialist only started consults around 10:45 AM. Queue registration was congested.",
    rating: 2,
    status: "In Review",
    feedbackStatusLog: [
      { date: "2026-06-10", status: "Submitted", comment: "Feedback received via digital portal" },
      { date: "2026-06-12", status: "In Review", comment: "Forwarded to Outpatient Department Chief and Duty Roster coordinator for schedule verification" }
    ],
    createdAt: "2026-06-10T11:00:00Z"
  },
  {
    id: "FB-802",
    facilityId: "F-102",
    facilityName: "Bishoftu Primary Hospital",
    citizenName: "Kiftu Hundesa",
    citizenContact: "+251-931-124455",
    type: "Suggestion",
    subject: "Highly professional maternity ward nurse staff care",
    details: "I delivered my daughter at Bishoftu Primary Ward. Nurse Bontu and Midwife teams were extraordinarily supportive, clean, and empathetic. Highly recommend! Suggesting institutional recognition.",
    rating: 5,
    status: "Resolved",
    feedbackStatusLog: [
      { date: "2026-06-12", status: "Submitted", comment: "Suggestion filed successfully" },
      { date: "2026-06-14", status: "Resolved", comment: "Message logged with HR. Official letter of commendation delivered to maternity ward on morning huddle" }
    ],
    createdAt: "2026-06-12T15:30:00Z"
  }
];

// Immutable System Audit Logs
export const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-00912",
    timestamp: "2026-06-16T08:12:00Z",
    user: "super_admin_dirs",
    role: "Super Admin",
    action: "TENANT_APPROVAL",
    details: "Approved 'Bishoftu Primary Hospital' operational code BSFHSP-02 after compliance and license checks",
    ip: "10.120.44.112"
  },
  {
    id: "AUD-00913",
    timestamp: "2026-06-16T09:15:00Z",
    user: "chala.gemechu@adamahealth.org",
    role: "Staff",
    action: "ATTENDANCE_CHECK_IN",
    details: "GPS Check-In at 07:52 AM - Latitude: 8.5415, Longitude: 39.2688 (Verified inside facility radius of 150m)",
    ip: "192.168.12.80"
  },
  {
    id: "AUD-00914",
    timestamp: "2026-06-16T09:30:00Z",
    user: "adama.admin",
    role: "Facility Admin",
    action: "PAYROLL_RECALCULATE",
    details: "Recalculated monthly payroll logs for June 2026 including overtime adjustments",
    ip: "192.168.12.4"
  },
  {
    id: "AUD-00915",
    timestamp: "2026-06-16T10:05:00Z",
    user: "system_cron",
    role: "System (Auto)",
    action: "OFFLINE_BATCH_SYNC",
    details: "Executed queue synchronization batch. Synced 3 citizen feedbacks and updated waiting line parameters",
    ip: "127.0.0.1"
  }
];

// Program activities
export const initialEvents: ProgramEvent[] = [
  {
    id: "EVT-01",
    facilityId: "F-101",
    title: "Seasonal Malaria Bednet Distribution Outreach",
    type: "Outreach",
    start: "2026-06-18T08:00:00Z",
    end: "2026-06-18T16:00:00Z",
    assignedStaff: ["Dr. Chala Gemechu", "Sr. Bontu Gerba"],
    description: "Door-to-door distribution of insecticide-treated bed nets in Woreda selected kebeles with stagnant pools."
  },
  {
    id: "EVT-02",
    facilityId: "F-101",
    title: "Emergency Triaging Simulation Training",
    type: "Training",
    start: "2026-06-20T10:30:00Z",
    end: "2026-06-20T14:30:00Z",
    assignedStaff: ["Dr. Chala Gemechu", "Dr. Aster Tolossa"],
    description: "Bio-hazard response, major incident scenario management and MASS-Casualty triage techniques."
  },
  {
    id: "EVT-03",
    facilityId: "F-102",
    title: "District Maternal Health Advisory Committee Meet",
    type: "Meeting",
    start: "2026-06-22T09:00:00Z",
    end: "2026-06-22T12:00:00Z",
    assignedStaff: ["Dr. Kenenisa Dibaba"],
    description: "Quarterly review of institutional delivery statistics, referral protocols, and emergency blood banks."
  }
];

// Staff Live Location simulation coordinates
export const staffRouteHistories: StaffRouteHistory[] = [
  {
    employeeId: "EMP-2025-01",
    employeeName: "Dr. Chala Gemechu",
    date: "2026-06-16",
    activeDutyLocation: "Aanaa Adama Rural Health Post Alpha",
    coordinates: [
      { lat: 8.5414, lng: 39.2689, time: "08:00 AM" },
      { lat: 8.5480, lng: 39.2800, time: "10:00 AM" },
      { lat: 8.5600, lng: 39.3000, time: "12:00 PM" },
      { lat: 8.5720, lng: 39.3200, time: "02:00 PM" }
    ]
  },
  {
    employeeId: "EMP-2025-04",
    employeeName: "Sr. Bontu Gerba",
    date: "2026-06-16",
    activeDutyLocation: "Ganda Malima Vaccinating Post 3",
    coordinates: [
      { lat: 7.1996, lng: 38.5975, time: "08:30 AM" },
      { lat: 7.2100, lng: 38.6100, time: "11:00 AM" },
      { lat: 7.2300, lng: 38.6400, time: "01:30 PM" }
    ]
  }
];

export const initialUsers: SystemUser[] = [
  {
    id: "USR-00",
    email: "admin@mustalihrmems.gov",
    fullName: "Default Super Admin",
    role: "super_admin",
    facilityId: "all",
    status: "Active",
    createdAt: "2026-06-18T08:00:00Z"
  },
  {
    id: "USR-01",
    email: "abdisa.wakuma@health.go.et",
    fullName: "Abdisa Wakuma",
    role: "super_admin",
    facilityId: "all",
    status: "Active",
    createdAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "USR-02",
    email: "abebe.kebede@adama.health.go.et",
    fullName: "Abebe Kebede",
    role: "facility_admin",
    facilityId: "F-101",
    status: "Active",
    createdAt: "2026-02-15T09:30:00Z"
  },
  {
    id: "USR-03",
    email: "chala.gemechu@adama.health.go.et",
    fullName: "Dr. Chala Gemechu",
    role: "staff",
    facilityId: "F-101",
    status: "Active",
    createdAt: "2026-03-01T10:00:00Z"
  },
  {
    id: "USR-04",
    email: "tariku.jaleta@gmail.com",
    fullName: "Tariku Jaleta",
    role: "public",
    facilityId: "none",
    status: "Active",
    createdAt: "2026-05-12T14:20:00Z"
  },
  {
    id: "USR-05",
    email: "aster.tolossa@adama.health.go.et",
    fullName: "Dr. Aster Tolossa",
    role: "staff",
    facilityId: "F-101",
    status: "Active",
    createdAt: "2026-04-10T11:15:00Z"
  },
  {
    id: "USR-06",
    email: "kenenisa.dibaba@shashemene.health.go.et",
    fullName: "Dr. Kenenisa Dibaba",
    role: "staff",
    facilityId: "F-102",
    status: "Active",
    createdAt: "2026-04-20T12:00:00Z"
  }
];

export const initialVaccines: VaccineStock[] = [
  {
    id: "VAC-BCG-102",
    facilityId: "F-101",
    name: "BCG Tuberculosis Vaccine",
    batchNumber: "BCG-2026-X8",
    lotNumber: "LOT-9981-A",
    expiryDate: "2026-12-15",
    quantity: 1420,
    manufacturer: "Serum Institute of India",
    status: "In Stock",
    threshold: 200,
    lastUpdated: "2026-06-10T08:30:00Z"
  },
  {
    id: "VAC-OPV-403",
    facilityId: "F-101",
    name: "Oral Polio Vaccine (OPV)",
    batchNumber: "OPV-2026-B1",
    lotNumber: "LOT-6672-P",
    expiryDate: "2026-10-20",
    quantity: 80,
    manufacturer: "Bio-Farma Indonesia",
    status: "Low Stock",
    threshold: 150,
    lastUpdated: "2026-06-11T14:15:00Z"
  },
  {
    id: "VAC-MEA-002",
    facilityId: "F-102",
    name: "Measles-Rubella Vaccine (MR)",
    batchNumber: "MR-EXP-772",
    lotNumber: "LOT-1123-M",
    expiryDate: "2026-05-10",
    quantity: 350,
    manufacturer: "Sanofi Pasteur",
    status: "Expired",
    threshold: 100,
    lastUpdated: "2026-05-01T11:00:00Z"
  },
  {
    id: "VAC-ROT-302",
    facilityId: "F-101",
    name: "Rotavirus Vaccine (Rotarix)",
    batchNumber: "ROT-2026-Y9",
    lotNumber: "LOT-4451-R",
    expiryDate: "2027-04-18",
    quantity: 0,
    manufacturer: "GlaxoSmithKline",
    status: "Depleted",
    threshold: 120,
    lastUpdated: "2026-06-12T09:20:00Z"
  }
];

