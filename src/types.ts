/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'om';

export type UserRole = 'super_admin' | 'facility_warden' | 'facility_doctor' | 'hr_officer' | 'equipment_officer' | 'staff' | 'public';

export interface TenantFacility {
  id: string;
  name: string;
  code: string;
  type: 'Regional Hospital' | 'General Hospital' | 'Primary Hospital' | 'Health Center' | 'Health Post';
  licenseNo: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  gps: { lat: number; lng: number };
  phone: string;
  email: string;
  status: 'draft' | 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'Pending Approval' | 'Approved' | 'Active' | 'Rejected' | 'Suspended';
  permitStatus?: string;
  approvalStatus?: string;
  onboardingStatus?: string;
  createdAt: string;
  patientsWaiting: number;
  estimatedWaitMinutes: number;
  onCallDoctors: string[];
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  adminPassword?: string;
}

export interface TrainingRecord {
  id: string;
  title: string;
  provider: string;
  startDate: string;
  endDate: string;
  cpdPoints: number;
  status: 'Completed' | 'Upcoming' | 'In Progress';
  certificateUrl: string;
}

export interface LeaveRequest {
  id: string;
  leaveType: 'Sick Leave' | 'Annual Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Study Leave' | 'Compassionate Leave';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  approvedOrRejectedBy?: string;
  remarks?: string;
}

export interface PerformanceEvaluation {
  id: string;
  evaluationDate: string;
  evaluatorName: string;
  period: string; // e.g. "Q1 2026", "Annual 2026"
  scores: {
    clinicalProficiency: number; // 1-5
    punctualityAttendance: number; // 1-5
    patientCareAffection: number; // 1-5
    collaborationTeamwork: number; // 1-5
    complianceDocumentation: number; // 1-5
  };
  overallScore: number; // average
  feedback: string;
  recommendations: string;
}

export interface Employee {
  id: string;
  facilityId: string;
  fullName: string;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  profession: string;
  education: string;
  department: string;
  position: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Suspended' | 'Resigned';
  dateOfHire: string;
  trainingHistory: TrainingRecord[];
  leaveRequests?: LeaveRequest[];
  performanceEvaluations?: PerformanceEvaluation[];
  attendanceSummary: {
    present: number;
    late: number;
    excused: number;
    overtimeHours: number;
  };
  systemRole?: 'Doctor' | 'HR Officer' | 'Store Keeper' | 'Staff';
  salaryStructure?: {
    grade: string;
    housingAllowance: number;
    transportAllowance: number;
    dangerAllowance: number;
    pensionRate: number; // e.g. 0.07 for 7%
    taxRate: number;     // e.g. 0.15 for 15%
    hourlyOvertimeMultiplier: number; // e.g. 1.25 or 1.5
    customDeductions: number;         // custom flat deductions (loans, etc.)
  };
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'Present' | 'Late' | 'Absent' | 'Excused';
  method: 'GPS' | 'Fingerprint' | 'Face Recognition';
  gpsLocation: { lat: number; lng: number };
  gpsVerified: boolean;
  overtimeHours: number;
}

export interface PayrollSlip {
  id: string;
  employeeId: string;
  employeeName: string;
  facilityId: string;
  month: string;
  basicSalary: number;
  overtimeAmount: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Paid' | 'Processing';
  payslipGeneratedAt: string;
  grade?: string;
  targetWorkDays?: number;
  actualWorkDays?: number;
  absentDays?: number;
  overtimeHoursWorked?: number;
  overtimeRatePerHour?: number;
  leaveDeductions?: number;
  pensionEmployee?: number;
  incomeTax?: number;
  allowanceHousing?: number;
  allowanceTransport?: number;
  allowanceDanger?: number;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  description: string;
  cost: number;
  technician: string;
}

export interface AssignmentLog {
  id: string;
  date: string;
  assignedTo: string;
  department: string;
}

export interface Equipment {
  id: string;
  facilityId: string;
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  supplier: string;
  warrantyYears: number;
  status: 'Operational' | 'Under Maintenance' | 'Needs Repair' | 'Disposed';
  maintenanceHistory: MaintenanceLog[];
  assignmentHistory: AssignmentLog[];
  disposalDate?: string;
  disposalReason?: string;
  disposalAuthorizedBy?: string;
}

export interface NonMedicalAsset {
  id: string;
  facilityId: string;
  name: string;
  category: 'Furniture' | 'Vehicles' | 'Computers' | 'Buildings' | 'Office Equipment';
  status: 'In Use' | 'Transferred' | 'Under Repair' | 'Retired';
  registrationNo: string;
  location: string;
  assignedTo: string;
  maintenanceHistory: MaintenanceLog[];
}

export interface FeedbackLog {
  date: string;
  status: string;
  comment: string;
}

export interface FeedbackItem {
  id: string;
  facilityId: string;
  facilityName: string;
  citizenName: string;
  citizenContact: string;
  type: 'Complaint' | 'Suggestion';
  subject: string;
  details: string;
  rating: number;
  status: 'Submitted' | 'In Review' | 'Resolved';
  feedbackStatusLog: FeedbackLog[];
  createdAt: string;
}

export interface PublicAnnouncement {
  id: string;
  facilityId: string;
  facilityName: string;
  titleEn: string;
  titleOm: string;
  type: 'outbreak' | 'campaign' | 'general';
  detailsEn: string;
  detailsOm: string;
  date: string;
}

export interface StaffRoutePoint {
  lat: number;
  lng: number;
  time: string;
}

export interface StaffRouteHistory {
  employeeId: string;
  employeeName: string;
  date: string;
  coordinates: StaffRoutePoint[];
  activeDutyLocation: string;
}

export interface ProgramEvent {
  id: string;
  facilityId: string;
  title: string;
  type: 'Duty Schedule' | 'Overtime' | 'Campaign' | 'Meeting' | 'Outreach' | 'Training';
  start: string;
  end: string;
  assignedStaff: string[];
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  ip: string;
}

export interface OfflineSyncQueueItem {
  id: string;
  action: string;
  payload: any;
  timestamp: string;
}

export interface SystemUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  facilityId: string;
  status: 'Active' | 'Suspended' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Pending OTP Verification' | 'Pending Acceptance';
  createdAt: string;
  // OTP verification fields
  otpVerified?: boolean;
  otpVerificationMethod?: 'email' | 'sms' | 'telegram';
  otpVerificationDate?: string;
  // Doctor invitation fields
  invitedBy?: string;
  invitationToken?: string;
  tempPassword?: string;
  invitationAcceptedAt?: string;
}

export interface VaccineStock {
  id: string;
  facilityId: string;
  name: string;
  batchNumber: string;
  lotNumber: string;
  expiryDate: string;
  quantity: number;
  manufacturer: string;
  status: 'In Stock' | 'Expired' | 'Low Stock' | 'Depleted';
  threshold: number;
  lastUpdated: string;
}
