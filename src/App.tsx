/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './firebase';
import {
  Language,
  UserRole,
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
  OfflineSyncQueueItem,
  TrainingRecord,
  VaccineStock
} from './types';
import {
  initialFacilities,
  initialEmployees,
  initialAttendance,
  initialEquipment,
  initialAssets,
  initialAnnouncements,
  initialFeedbacks,
  initialEvents,
  initialAuditLogs,
  dictionary,
  initialVaccines
} from './data/mockData';

// Subcomponents
import CommunityPortal from './components/CommunityPortal';
import DashboardSuperAdmin from './components/DashboardSuperAdmin';
import DashboardFacilityAdmin from './components/DashboardFacilityAdmin';
import DashboardStaff from './components/DashboardStaff';
import MapSimulator from './db/MapSimulator';
import TechnicalSpecs from './components/TechnicalSpecs';
import SecurityPortal from './components/SecurityPortal';
import AndroidSimulator from './components/AndroidSimulator';

import UserManagement from './components/UserManagement';
import SystemStatistics from './components/SystemStatistics';
import ReportsDashboard from './components/ReportsDashboard';
import SettingsPage from './components/SettingsPage';
import FacilityRegistration from './components/FacilityRegistration';
import StaffManagement from './components/StaffManagement';
import MedicalEquipmentLedger from './components/MedicalEquipmentLedger';
import { initialUsers } from './data/mockData';
import { SystemUser } from './types';

import {
  Activity,
  Wifi,
  WifiOff,
  UserCheck,
  Building,
  Terminal,
  Heart,
  Calendar,
  Layers,
  Database,
  Cpu,
  RefreshCw,
  Bell,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function App() {
  // Global States
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [activeRole, setActiveRole] = useState<UserRole>('public');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('F-101');
  const [showTechSpecs, setShowTechSpecs] = useState<boolean>(false);
  const [showMobileSim, setShowMobileSim] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>('');
  
  // Extra Admin Modules navigation view
  const [activeView, setActiveView] = useState<'role_based' | 'users_admin' | 'stats_admin' | 'reports_admin' | 'settings_admin' | 'registration_module' | 'staff_management_module' | 'equipment_ledger'>('role_based');
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);

  // Source Database Simulation States
  const [facilities, setFacilities] = useState<TenantFacility[]>(initialFacilities);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(initialAttendance);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [vaccineStocks, setVaccineStocks] = useState<VaccineStock[]>(initialVaccines);
  const [assets, setAssets] = useState<NonMedicalAsset[]>(initialAssets);
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>(initialAnnouncements);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [events] = useState<ProgramEvent[]>(initialEvents);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [payrollSlips, setPayrollSlips] = useState<PayrollSlip[]>([]);
  const [syncQueue, setSyncQueue] = useState<OfflineSyncQueueItem[]>([]);
  const [notificationsLog, setNotificationsLog] = useState<string[]>([]);
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);

  const t = dictionary[currentLanguage];

  // Initialize Payroll list on first boot if empty
  useEffect(() => {
    if (payrollSlips.length === 0 && employees.length > 0) {
      generateInitialPayroll();
    }
  }, [employees, payrollSlips.length]);

  // Load data from live Firestore or seed with initial mock data if empty
  useEffect(() => {
    async function initFirestore() {
      if (isOffline) return;
      try {
        // Test connectivity first as mandated in SKILL.md
        const { getDocFromServer } = await import('firebase/firestore');
        try {
          await getDocFromServer(doc(db, 'test', 'connection'));
        } catch (_) {
          // Ignore offline check exceptions 
        }

        addNotificationLog("[Firebase] Establishing real-time sync with cloud database...");

        // 1. Facilities
        const facSnap = await getDocs(collection(db, 'facilities')).catch(err => handleFirestoreError(err, OperationType.GET, 'facilities'));
        if (facSnap.empty) {
          addNotificationLog("[Firebase] Seeding initial central facilities information...");
          const seeded: TenantFacility[] = [];
          for (const f of initialFacilities) {
            const baselineStatus = f.status || 'approved';
            const normalized: TenantFacility = {
              ...f,
              status: baselineStatus,
              permitStatus: f.permitStatus || baselineStatus,
              approvalStatus: f.approvalStatus || baselineStatus,
              onboardingStatus: f.onboardingStatus || baselineStatus
            };
            await setDoc(doc(db, 'facilities', f.id), normalized).catch(err => handleFirestoreError(err, OperationType.WRITE, `facilities/${f.id}`));
            seeded.push(normalized);
          }
          setFacilities(seeded);
        } else {
          const list: TenantFacility[] = [];
          facSnap.forEach(docSnap => {
            const data = docSnap.data() as TenantFacility;
            const baselineStatus = data.status || 'pending';
            data.status = baselineStatus;
            data.permitStatus = data.permitStatus || baselineStatus;
            data.approvalStatus = data.approvalStatus || baselineStatus;
            data.onboardingStatus = data.onboardingStatus || baselineStatus;
            list.push(data);
          });
          list.sort((a, b) => a.id.localeCompare(b.id));
          setFacilities(list);
        }

        // 2. Employees & Staff Directory
        const empSnap = await getDocs(collection(db, 'employees')).catch(err => handleFirestoreError(err, OperationType.GET, 'employees'));
        if (empSnap.empty) {
          addNotificationLog("[Firebase] Seeding initial healthcare employees directory...");
          for (const emp of initialEmployees) {
            await setDoc(doc(db, 'employees', emp.id), emp).catch(err => handleFirestoreError(err, OperationType.WRITE, `employees/${emp.id}`));
            await setDoc(doc(db, 'staff', emp.id), emp).catch(err => handleFirestoreError(err, OperationType.WRITE, `staff/${emp.id}`));
            if (emp.trainingHistory) {
              for (const tr of emp.trainingHistory) {
                const trPayload = { ...tr, employeeId: emp.id, employeeName: emp.fullName };
                await setDoc(doc(db, 'trainingRecords', tr.id), trPayload).catch(err => handleFirestoreError(err, OperationType.WRITE, `trainingRecords/${tr.id}`));
              }
            }
            if (emp.performanceEvaluations) {
              for (const ev of emp.performanceEvaluations) {
                const evPayload = { ...ev, employeeId: emp.id, employeeName: emp.fullName };
                await setDoc(doc(db, 'performanceEvaluations', ev.id), evPayload).catch(err => handleFirestoreError(err, OperationType.WRITE, `performanceEvaluations/${ev.id}`));
              }
            }
          }
          setEmployees(initialEmployees);
        } else {
          const list: Employee[] = [];
          empSnap.forEach(docSnap => {
            list.push(docSnap.data() as Employee);
          });
          list.sort((a, b) => a.id.localeCompare(b.id));
          setEmployees(list);
          for (const emp of list) {
            await setDoc(doc(db, 'staff', emp.id), emp).catch(() => {});
          }
        }

        // 3. Attendance
        const attSnap = await getDocs(collection(db, 'attendance')).catch(err => handleFirestoreError(err, OperationType.GET, 'attendance'));
        if (attSnap.empty) {
          addNotificationLog("[Firebase] Seeding initial attendance check-in roster...");
          for (const att of initialAttendance) {
            await setDoc(doc(db, 'attendance', att.id), att).catch(err => handleFirestoreError(err, OperationType.WRITE, `attendance/${att.id}`));
          }
          setAttendanceLogs(initialAttendance);
        } else {
          const list: AttendanceLog[] = [];
          attSnap.forEach(docSnap => {
            list.push(docSnap.data() as AttendanceLog);
          });
          list.sort((a, b) => b.date.localeCompare(a.date));
          setAttendanceLogs(list);
        }

        // 4. Feedback
        const fbSnap = await getDocs(collection(db, 'feedback')).catch(err => handleFirestoreError(err, OperationType.GET, 'feedback'));
        if (fbSnap.empty) {
          addNotificationLog("[Firebase] Seeding initial citizen feedback registries...");
          for (const fb of initialFeedbacks) {
            await setDoc(doc(db, 'feedback', fb.id), fb).catch(err => handleFirestoreError(err, OperationType.WRITE, `feedback/${fb.id}`));
          }
          setFeedbacks(initialFeedbacks);
        } else {
          const list: FeedbackItem[] = [];
          fbSnap.forEach(docSnap => {
            list.push(docSnap.data() as FeedbackItem);
          });
          list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          setFeedbacks(list);
        }

        // 5. Announcements
        const annSnap = await getDocs(collection(db, 'announcements')).catch(err => handleFirestoreError(err, OperationType.GET, 'announcements'));
        if (annSnap.empty) {
          for (const ann of initialAnnouncements) {
             await setDoc(doc(db, 'announcements', ann.id), ann).catch(err => handleFirestoreError(err, OperationType.WRITE, `announcements/${ann.id}`));
          }
          setAnnouncements(initialAnnouncements);
        } else {
          const list: PublicAnnouncement[] = [];
          annSnap.forEach(docSnap => {
            list.push(docSnap.data() as PublicAnnouncement);
          });
          list.sort((a, b) => b.date.localeCompare(a.date));
          setAnnouncements(list);
        }

        // 6. Audit Logs
        const auSnap = await getDocs(collection(db, 'auditLogs')).catch(err => handleFirestoreError(err, OperationType.GET, 'auditLogs'));
        if (auSnap.empty) {
          for (const log of initialAuditLogs) {
             await setDoc(doc(db, 'auditLogs', log.id), log).catch(err => handleFirestoreError(err, OperationType.WRITE, `auditLogs/${log.id}`));
          }
          setAuditLogs(initialAuditLogs);
        } else {
          const list: AuditLog[] = [];
          auSnap.forEach(docSnap => {
            list.push(docSnap.data() as AuditLog);
          });
          list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          setAuditLogs(list);
        }

        // 7. Equipment
        const eqSnap = await getDocs(collection(db, 'equipment')).catch(err => handleFirestoreError(err, OperationType.GET, 'equipment'));
        if (eqSnap.empty) {
          for (const eq of initialEquipment) {
             await setDoc(doc(db, 'equipment', eq.id), eq).catch(err => handleFirestoreError(err, OperationType.WRITE, `equipment/${eq.id}`));
          }
          setEquipment(initialEquipment);
        } else {
          const list: Equipment[] = [];
          eqSnap.forEach(docSnap => {
            list.push(docSnap.data() as Equipment);
          });
          list.sort((a, b) => a.id.localeCompare(b.id));
          setEquipment(list);
        }

        // 7b. Vaccine stock cold chain log
        const vacSnap = await getDocs(collection(db, 'vaccines')).catch(err => handleFirestoreError(err, OperationType.GET, 'vaccines'));
        if (vacSnap.empty) {
          for (const vac of initialVaccines) {
             await setDoc(doc(db, 'vaccines', vac.id), vac).catch(err => handleFirestoreError(err, OperationType.WRITE, `vaccines/${vac.id}`));
          }
          setVaccineStocks(initialVaccines);
        } else {
          const list: VaccineStock[] = [];
          vacSnap.forEach(docSnap => {
            list.push(docSnap.data() as VaccineStock);
          });
          list.sort((a, b) => a.id.localeCompare(b.id));
          setVaccineStocks(list);
        }

        // 8. Assets
        const astSnap = await getDocs(collection(db, 'assets')).catch(err => handleFirestoreError(err, OperationType.GET, 'assets'));
        if (astSnap.empty) {
          for (const ast of initialAssets) {
             await setDoc(doc(db, 'assets', ast.id), ast).catch(err => handleFirestoreError(err, OperationType.WRITE, `assets/${ast.id}`));
          }
          setAssets(initialAssets);
        } else {
          const list: NonMedicalAsset[] = [];
          astSnap.forEach(docSnap => {
            list.push(docSnap.data() as NonMedicalAsset);
          });
          list.sort((a, b) => a.id.localeCompare(b.id));
          setAssets(list);
        }

        // 9. Users Directory
        const usrSnap = await getDocs(collection(db, 'users')).catch(err => handleFirestoreError(err, OperationType.GET, 'users'));
        let userList: SystemUser[] = [];
        if (usrSnap.empty) {
          addNotificationLog("[Firebase] Seeding initial users directory...");
          for (const u of initialUsers) {
             await setDoc(doc(db, 'users', u.id), u).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${u.id}`));
          }
          userList = [...initialUsers];
        } else {
          usrSnap.forEach(docSnap => {
            userList.push(docSnap.data() as SystemUser);
          });
        }

        // Ensure default Super Admin account exists if it is not already resolved in the database
        const defaultAdminEmail = "admin@mustalihrmems.gov";
        const hasDefaultAdmin = userList.some(u => u.email.toLowerCase() === defaultAdminEmail.toLowerCase());
        if (!hasDefaultAdmin) {
          const defaultAdmin: SystemUser = {
            id: "USR-00",
            email: defaultAdminEmail,
            fullName: "Default Super Admin",
            role: "super_admin",
            facilityId: "all",
            status: "Active",
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', defaultAdmin.id), defaultAdmin)
            .catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${defaultAdmin.id}`));
          userList.push(defaultAdmin);
          addNotificationLog(`[Firebase] Default Super Admin account verified & registered: ${defaultAdminEmail}`);
        }

        userList.sort((a, b) => a.id.localeCompare(b.id));
        setUsers(userList);

        // 10. Payroll Slips
        const pyrSnap = await getDocs(collection(db, 'payrollSlips')).catch(err => handleFirestoreError(err, OperationType.GET, 'payrollSlips'));
        if (!pyrSnap.empty) {
          const list: PayrollSlip[] = [];
          pyrSnap.forEach(docSnap => {
            list.push(docSnap.data() as PayrollSlip);
          });
          list.sort((a, b) => a.id.localeCompare(b.id));
          setPayrollSlips(list);
        } else {
          // Fallback loader if Firestore had zero payroll items
          addNotificationLog("[Firebase] Establishing enterprise payroll registers on central db...");
          const seededSlips: PayrollSlip[] = (empSnap.empty ? initialEmployees : ((): Employee[] => {
            const list: Employee[] = [];
            empSnap.forEach(docSnap => { list.push(docSnap.data() as Employee); });
            return list;
          })()).map((emp, index) => {
            const basic = emp.salary;
            const overtimeAmount = (emp.attendanceSummary?.overtimeHours || 0) * 125;
            const allowances = Math.floor(basic * 0.12);
            const deductions = Math.floor(basic * 0.20);
            const netSalary = basic + overtimeAmount + allowances - deductions;
            return {
              id: `PS-${index + 100}`,
              employeeId: emp.id,
              employeeName: emp.fullName,
              facilityId: emp.facilityId,
              month: "June 2026",
              basicSalary: basic,
              overtimeAmount,
              allowances,
              deductions,
              netSalary,
              status: 'Draft' as const,
              payslipGeneratedAt: new Date().toISOString()
            };
          });
          for (const slip of seededSlips) {
            await setDoc(doc(db, 'payrollSlips', slip.id), slip)
              .catch(err => handleFirestoreError(err, OperationType.WRITE, `payrollSlips/${slip.id}`));
          }
          setPayrollSlips(seededSlips);
        }

        addNotificationLog("[Firebase] Connected and synchronized hot replication states!");
      } catch (e) {
        console.warn("Could not sync Firestore natively: ", e);
        addNotificationLog("[Firebase] Bypassed cloud sync due to client offline/missing auth.");
      }
    }
    initFirestore();
  }, [isOffline]);

  const generateInitialPayroll = () => {
    const slips: PayrollSlip[] = employees.map((emp, index) => {
      const basic = emp.salary;
      const overtimeAmount = (emp.attendanceSummary.overtimeHours || 0) * 125;
      const allowances = Math.floor(basic * 0.12); // standard 12% allowance
      const deductions = Math.floor(basic * 0.20); // 20% income tax/deductions
      const netSalary = basic + overtimeAmount + allowances - deductions;

      return {
        id: `PS-${index + 100}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        facilityId: emp.facilityId,
        month: "June 2026",
        basicSalary: basic,
        overtimeAmount,
        allowances,
        deductions,
        netSalary,
        status: 'Paid',
        payslipGeneratedAt: new Date().toISOString()
      };
    });
    setPayrollSlips(slips);
  };

  // Helper: Append immutable transaction logs
  const addNewAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      user: activeRole === 'super_admin' ? 'super_admin_dirs' : 'facility_coordinator',
      role: activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'facility_admin' ? 'Facility Admin' : 'Staff',
      action,
      details,
      ip: '10.122.40.82'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    if (!isOffline) {
      setDoc(doc(db, 'auditLogs', newLog.id), newLog).catch(err => handleFirestoreError(err, OperationType.CREATE, `auditLogs/${newLog.id}`));
    }
  };

  const addNotificationLog = (msg: string) => {
    setNotificationsLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleLoginFromPortal = (role: UserRole, facilityId?: string) => {
    setActiveRole(role);
    if (facilityId) {
      setSelectedFacilityId(facilityId);
    }
    setIsAuthenticated(true);
    setShowMobileSim(false);
    
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      user: role === 'super_admin' ? 'central_admin' : 'facility_staff',
      role: role === 'super_admin' ? 'Super Admin' : role === 'facility_admin' ? 'Facility Admin' : role === 'staff' ? 'Staff' : 'Citizen',
      action: 'USER_LOGIN',
      details: `User signature matching approved for credentials matching role context: ${role}`,
      ip: '127.0.5.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRegisterFacilityFromPortal = (fac: any) => {
    const newFacId = `F-${101 + facilities.length}`;
    const newFac: TenantFacility = {
      id: newFacId,
      name: fac.name,
      code: `PENDING-${Math.floor(10 + Math.random() * 90)}`,
      type: fac.type as any,
      licenseNo: fac.licenseNo,
      region: 'Oromia',
      zone: fac.zone,
      woreda: fac.woreda,
      kebele: fac.kebele,
      gps: { lat: fac.lat, lng: fac.lng },
      phone: fac.phone,
      email: fac.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      patientsWaiting: 0,
      estimatedWaitMinutes: 0,
      onCallDoctors: ['Dr. On-Call Registrar'],
      adminName: fac.adminName,
      adminEmail: fac.adminEmail,
      adminPhone: fac.adminPhone,
      adminPassword: fac.adminPassword,
    };
    
    setFacilities(prev => [...prev, newFac]);
    if (!isOffline) {
      setDoc(doc(db, 'facilities', newFac.id), newFac)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `facilities/${newFac.id}`));
    }

    // Auto-create pending SystemUser account for Facility Administrator
    const newAdminUser: SystemUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      email: fac.adminEmail,
      fullName: fac.adminName,
      role: 'facility_admin',
      facilityId: newFacId,
      status: 'Pending Approval',
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newAdminUser]);
    if (!isOffline) {
      setDoc(doc(db, 'users', newAdminUser.id), newAdminUser)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${newAdminUser.id}`));
    }
    
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      user: 'Facility Applicant',
      role: 'Citizen',
      action: 'TENANT_REGISTER',
      details: `New facility registered: ${fac.name} under license ${fac.licenseNo} by Admin: ${fac.adminName} (${fac.adminEmail}). Status locked to Pending Approval.`,
      ip: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    if (!isOffline) {
      setDoc(doc(db, 'auditLogs', newLog.id), newLog)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `auditLogs/${newLog.id}`));
    }
  };

  const handleRegisterCitizenFromPortal = (fullName: string, email: string) => {
    const newUser: SystemUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      email: email,
      fullName: fullName,
      role: 'public',
      facilityId: 'none',
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      user: fullName,
      role: 'Citizen',
      action: 'CITIZEN_SELF_REGISTER',
      details: `Public Citizen signed up independently: ${fullName} (${email}). Profile active immediately.`,
      ip: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    
    if (!isOffline) {
      setDoc(doc(db, 'users', newUser.id), newUser)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${newUser.id}`));
      setDoc(doc(db, 'auditLogs', newLog.id), newLog)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `auditLogs/${newLog.id}`));
    }
    addNotificationLog(`[Citizen Self-Register] Active account successfully provisioned for ${fullName} (${email}).`);
  };

  const handleCreateUser = (newUserFields: Omit<SystemUser, 'id' | 'createdAt'>) => {
    const newUser: SystemUser = {
      ...newUserFields,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    addNewAudit('USER_CREATED', `Created new system user account: ${newUser.fullName} (${newUser.role})`);
    if (!isOffline) {
      setDoc(doc(db, 'users', newUser.id), newUser).catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${newUser.id}`));
    }
  };

  const handleUpdateUser = (id: string, updatedFields: Partial<SystemUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedFields } : u));
    const target = users.find(u => u.id === id);
    addNewAudit('USER_UPDATED', `Updated system user credentials for: ${target?.fullName || id}`);
    if (!isOffline && target) {
      const merged = { ...target, ...updatedFields } as SystemUser;
      setDoc(doc(db, 'users', id), merged).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${id}`));
    }
  };

  const handleDeleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    addNewAudit('USER_DELETED', `Deleted user credential file for: ${target?.fullName || id}`);
    if (!isOffline) {
      deleteDoc(doc(db, 'users', id)).catch(err => handleFirestoreError(err, OperationType.DELETE, `users/${id}`));
    }
  };

  // Multi-tenant: Tenant Approvals and Activations (Super Admin Action)
  const approveFacility = (id: string) => {
    let targetFac: TenantFacility | undefined;

    setFacilities(prev => {
      const updated = prev.map(f => {
        if (f.id === id) {
          targetFac = { 
            ...f, 
            status: 'approved',
            permitStatus: 'approved',
            approvalStatus: 'approved',
            onboardingStatus: 'approved',
            code: f.code || `${f.type.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}` 
          };
          return targetFac;
        }
        return f;
      });

      if (!isOffline && targetFac) {
        setDoc(doc(db, 'facilities', id), targetFac)
          .catch(err => handleFirestoreError(err, OperationType.UPDATE, `facilities/${id}`));
      }
      return updated;
    });

    // Update corresponding admin users status to Active
    setUsers(prev => {
      const updatedUsers = prev.map(u => {
        if (u.facilityId === id) {
          const updatedUser: SystemUser = { ...u, status: 'Active' };
          if (!isOffline) {
            setDoc(doc(db, 'users', u.id), updatedUser)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${u.id}`));
          }
          return updatedUser;
        }
        return u;
      });
      return updatedUsers;
    });

    // Send email notification log
    setTimeout(() => {
      const fac = facilities.find(f => f.id === id) || targetFac;
      if (fac) {
        const destEmail = fac.adminEmail || fac.email;
        addNotificationLog(`[EMAIL SENT] To: ${destEmail} | SUBJECT: Onboarding status: Approved | Message: Congratulations! Your MUSTALI DIRS registration for ${fac.name} has been approved. Your Admin account "${destEmail}" is now active and can sign in.`);
      }
    }, 200);
  };

  const rejectFacility = (id: string) => {
    let targetFac: TenantFacility | undefined;

    setFacilities(prev => {
      const updated = prev.map(f => {
        if (f.id === id) {
          targetFac = { 
            ...f, 
            status: 'rejected',
            permitStatus: 'rejected',
            approvalStatus: 'rejected',
            onboardingStatus: 'rejected'
          };
          return targetFac;
        }
        return f;
      });

      if (!isOffline && targetFac) {
        setDoc(doc(db, 'facilities', id), targetFac)
          .catch(err => handleFirestoreError(err, OperationType.UPDATE, `facilities/${id}`));
      }
      return updated;
    });

    // Update corresponding admin users status to Rejected
    setUsers(prev => {
      const updatedUsers = prev.map(u => {
        if (u.facilityId === id) {
          const updatedUser: SystemUser = { ...u, status: 'Rejected' };
          if (!isOffline) {
            setDoc(doc(db, 'users', u.id), updatedUser)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${u.id}`));
          }
          return updatedUser;
        }
        return u;
      });
      return updatedUsers;
    });

    // Send email notification log
    setTimeout(() => {
      const fac = facilities.find(f => f.id === id) || targetFac;
      if (fac) {
        const destEmail = fac.adminEmail || fac.email;
        addNotificationLog(`[EMAIL SENT] To: ${destEmail} | SUBJECT: Onboarding status: Declined | Message: We regret to inform you that your MUSTALI DIRS request for ${fac.name} has been declined. Access to the environment remains blocked.`);
      }
    }, 200);
  };

  const handleAddNewFacility = (newFac: TenantFacility) => {
    // Synchronize all status fields on registration
    const initialStatus = newFac.status || 'pending';
    const normalizedFac: TenantFacility = {
      ...newFac,
      status: initialStatus,
      permitStatus: initialStatus,
      approvalStatus: initialStatus,
      onboardingStatus: initialStatus
    };
    setFacilities(prev => {
      const updated = [...prev, normalizedFac];
      if (!isOffline) {
        setDoc(doc(db, 'facilities', normalizedFac.id), normalizedFac)
          .catch(err => handleFirestoreError(err, OperationType.CREATE, `facilities/${normalizedFac.id}`));
      }
      return updated;
    });
  };

  const handleUpdateFacilityStatus = (id: string, newStatus: 'draft' | 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected') => {
    let targetFac: TenantFacility | undefined;
    setFacilities(prev => {
      const updated = prev.map(f => {
        if (f.id === id) {
          targetFac = { 
            ...f, 
            status: newStatus as any,
            permitStatus: newStatus,
            approvalStatus: newStatus,
            onboardingStatus: newStatus
          };
          if (newStatus === 'approved') {
            targetFac.code = f.code || `${f.type.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
          }
          return targetFac;
        }
        return f;
      });
      if (!isOffline && targetFac) {
        setDoc(doc(db, 'facilities', id), targetFac)
          .catch(err => handleFirestoreError(err, OperationType.UPDATE, `facilities/${id}`));
      }
      return updated;
    });

    if (newStatus === 'approved') {
      // Activating user accounts tied to the approved facility
      setUsers(prev => {
        const updatedUsers = prev.map(u => {
          if (u.facilityId === id) {
            const updatedUser: SystemUser = { ...u, status: 'Active' };
            if (!isOffline) {
              setDoc(doc(db, 'users', u.id), updatedUser)
                .catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${u.id}`));
            }
            return updatedUser;
          }
          return u;
        });
        return updatedUsers;
      });

      // Send email notification log
      setTimeout(() => {
        const fac = facilities.find(f => f.id === id) || targetFac;
        if (fac) {
          const destEmail = fac.adminEmail || fac.email;
          addNotificationLog(`[EMAIL SENT] To: ${destEmail} | SUBJECT: Onboarding status: Approved | Message: Congratulations! Your MUSTALI DIRS registration for ${fac.name} has been approved. Your Admin account "${destEmail}" is now active and can sign in.`);
        }
      }, 200);

      const activeF = facilities.find(f => f.id === id);
      const hasEmp = employees.some(e => e.facilityId === id);
      if (!hasEmp) {
        const e1: Employee = {
          id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          facilityId: id,
          fullName: `Dr. Lemma Megersa`,
          gender: 'Male',
          phone: '+251-91-112-2334',
          email: 'lemma@oromia.health.gov.et',
          address: 'Adama, Oromia',
          profession: 'Medical Doctor',
          education: 'MD in Internal Medicine',
          department: 'Emergency & General Medicine',
          position: 'Chief Medical Officer',
          salary: 32000,
          status: 'Active',
          dateOfHire: new Date().toISOString().split('T')[0],
          trainingHistory: [],
          attendanceSummary: { present: 5, late: 0, excused: 0, overtimeHours: 4 }
        };

        const e2: Employee = {
          id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          facilityId: id,
          fullName: `Sr. Chaltu Dibaba`,
          gender: 'Female',
          phone: '+251-92-334-4556',
          email: 'chaltu@oromia.health.gov.et',
          address: 'Adama, Oromia',
          profession: 'Nurse',
          education: 'BSc in Nursing',
          department: 'Critical Care & Nursing',
          position: 'Head Nurse',
          salary: 18000,
          status: 'Active',
          dateOfHire: new Date().toISOString().split('T')[0],
          trainingHistory: [],
          attendanceSummary: { present: 5, late: 0, excused: 0, overtimeHours: 0 }
        };

        setEmployees(prev => {
          const list = [...prev, e1, e2];
          if (!isOffline) {
            setDoc(doc(db, 'employees', e1.id), e1).catch(err => handleFirestoreError(err, OperationType.CREATE, `employees/${e1.id}`));
            setDoc(doc(db, 'employees', e2.id), e2).catch(err => handleFirestoreError(err, OperationType.CREATE, `employees/${e2.id}`));
          }
          return list;
        });
      }

      const hasEq = equipment.some(eq => eq.facilityId === id);
      if (!hasEq) {
        const eq1: Equipment = {
          id: `EQP-${Math.floor(1000 + Math.random() * 9000)}`,
          facilityId: id,
          name: 'Ventilator Lifepack V4',
          category: 'ICU & Life Support',
          serialNumber: `SN-LF-V4-${Math.floor(100000 + Math.random() * 900000)}`,
          purchaseDate: new Date().toISOString().split('T')[0],
          supplier: 'Medical Supplies Ethiopia',
          warrantyYears: 3,
          status: 'Operational',
          maintenanceHistory: [],
          assignmentHistory: []
        };

        setEquipment(prev => {
          const list = [...prev, eq1];
          if (!isOffline) {
            setDoc(doc(db, 'equipment', eq1.id), eq1).catch(err => handleFirestoreError(err, OperationType.CREATE, `equipment/${eq1.id}`));
          }
          return list;
        });
      }
    }
  };

  const handleDeleteFacility = (id: string) => {
    setFacilities(prev => {
      const updated = prev.filter(f => f.id !== id);
      if (!isOffline) {
        deleteDoc(doc(db, 'facilities', id))
          .catch(err => handleFirestoreError(err, OperationType.DELETE, `facilities/${id}`));
      }
      return updated;
    });
  };

  // HRMS: Adding new employees
  const addNewEmployee = (newEmp: Employee) => {
    // Determine system authorization role
    const chosenRole: UserRole = newEmp.systemRole === 'HR Officer' ? 'facility_admin' : 'staff';
    
    // Auto-create active SystemUser credential mapping
    const newSystemUser: SystemUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      email: newEmp.email,
      fullName: newEmp.fullName,
      role: chosenRole,
      facilityId: newEmp.facilityId,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newSystemUser]);

    if (isOffline) {
      // Add to simulated local IndexedDB sync queue
      const queueItem: OfflineSyncQueueItem = {
        id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
        action: 'ADD_EMPLOYEE',
        payload: newEmp,
        timestamp: new Date().toISOString()
      };
      setSyncQueue(prev => [...prev, queueItem]);
      addNotificationLog(`[Offline Mode] Employee records cached locally in IndexedDB.`);
    } else {
      setEmployees(prev => [...prev, newEmp]);
      setDoc(doc(db, 'employees', newEmp.id), newEmp)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `employees/${newEmp.id}`));
      setDoc(doc(db, 'staff', newEmp.id), newEmp)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `staff/${newEmp.id}`));
      setDoc(doc(db, 'users', newSystemUser.id), newSystemUser)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${newSystemUser.id}`));
      addNotificationLog(`[SMS Gateway] Welcome message and credential activation SMS dispatched to ${newEmp.fullName} (${newEmp.email})`);
    }
  };

  // Attendance Check-In checking DML operations
  const submitAttendanceLog = (log: AttendanceLog) => {
    if (isOffline) {
      const queueItem: OfflineSyncQueueItem = {
        id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
        action: 'SUBMIT_ATTENDANCE',
        payload: log,
        timestamp: new Date().toISOString()
      };
      setSyncQueue(prev => [...prev, queueItem]);
    } else {
      setAttendanceLogs(prev => [log, ...prev]);
      setDoc(doc(db, 'attendance', log.id), log)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `attendance/${log.id}`));
    }
  };

  // Training completed log input CPM
  const submitTrainingLog = (employeeId: string, course: TrainingRecord) => {
    setEmployees(prev => {
      const updated = prev.map(emp => {
        if (emp.id === employeeId) {
          const updatedEmp = {
            ...emp,
            trainingHistory: [...emp.trainingHistory, course]
          };
          if (!isOffline) {
            setDoc(doc(db, 'employees', employeeId), updatedEmp)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `employees/${employeeId}`));
          }
          return updatedEmp;
        }
        return emp;
      });
      return updated;
    });
  };

  // Facility Admin: Update Facility profile description & statistics
  const updateFacilityProfile = (facilityId: string, updatedFields: Partial<TenantFacility>) => {
    setFacilities(prev => {
      const updated = prev.map(f => {
        if (f.id === facilityId) {
          const updatedFac = { ...f, ...updatedFields };
          if (!isOffline) {
            setDoc(doc(db, 'facilities', facilityId), updatedFac)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `facilities/${facilityId}`));
          }
          return updatedFac;
        }
        return f;
      });
      return updated;
    });
  };

  // Facility Admin: Update Employee status/metadata
  const updateEmployee = (employeeId: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev => {
      const updated = prev.map(emp => {
        if (emp.id === employeeId) {
          const updatedEmp = { ...emp, ...updatedFields };
          if (!isOffline) {
            setDoc(doc(db, 'employees', employeeId), updatedEmp)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `employees/${employeeId}`));
            setDoc(doc(db, 'staff', employeeId), updatedEmp)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `staff/${employeeId}`));

            if (updatedFields.trainingHistory) {
              for (const tr of updatedFields.trainingHistory) {
                const trPayload = { ...tr, employeeId, employeeName: updatedEmp.fullName };
                setDoc(doc(db, 'trainingRecords', tr.id), trPayload)
                  .catch(err => handleFirestoreError(err, OperationType.WRITE, `trainingRecords/${tr.id}`));
              }
            }

            if (updatedFields.performanceEvaluations) {
              for (const ev of updatedFields.performanceEvaluations) {
                const evPayload = { ...ev, employeeId, employeeName: updatedEmp.fullName };
                setDoc(doc(db, 'performanceEvaluations', ev.id), evPayload)
                  .catch(err => handleFirestoreError(err, OperationType.WRITE, `performanceEvaluations/${ev.id}`));
              }
            }
          }
          return updatedEmp;
        }
        return emp;
      });
      return updated;
    });
  };

  // Facility Admin: Remove/delete Employee file
  const deleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    if (!isOffline) {
      deleteDoc(doc(db, 'employees', employeeId))
        .catch(err => handleFirestoreError(err, OperationType.DELETE, `employees/${employeeId}`));
      deleteDoc(doc(db, 'staff', employeeId))
        .catch(err => handleFirestoreError(err, OperationType.DELETE, `staff/${employeeId}`));
    }
  };

  // Facility Admin: Register New Clinical Equipment
  const addEquipmentRecord = (newEq: Equipment) => {
    setEquipment(prev => [...prev, newEq]);
    if (!isOffline) {
      setDoc(doc(db, 'equipment', newEq.id), newEq)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `equipment/${newEq.id}`));
    }
  };

  // Facility Admin: Update Equipment status or append Maintenance Logs
  const updateEquipmentRecord = (eqId: string, updatedFields: Partial<Equipment>) => {
    setEquipment(prev => {
      const updated = prev.map(eq => {
        if (eq.id === eqId) {
          const updatedEq = { ...eq, ...updatedFields };
          if (!isOffline) {
            setDoc(doc(db, 'equipment', eqId), updatedEq)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `equipment/${eqId}`));
          }
          return updatedEq;
        }
        return eq;
      });
      return updated;
    });
  };

  const deleteEquipmentRecord = (eqId: string) => {
    setEquipment(prev => prev.filter(eq => eq.id !== eqId));
    if (!isOffline) {
      deleteDoc(doc(db, 'equipment', eqId))
        .catch(err => handleFirestoreError(err, OperationType.DELETE, `equipment/${eqId}`));
    }
  };

  const addVaccineRecord = (newVac: VaccineStock) => {
    setVaccineStocks(prev => [...prev, newVac]);
    if (!isOffline) {
      setDoc(doc(db, 'vaccines', newVac.id), newVac)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `vaccines/${newVac.id}`));
    }
  };

  const updateVaccineRecord = (vacId: string, updatedFields: Partial<VaccineStock>) => {
    setVaccineStocks(prev => {
      const updated = prev.map(vac => {
        if (vac.id === vacId) {
          const updatedVac = { ...vac, ...updatedFields };
          if (!isOffline) {
            setDoc(doc(db, 'vaccines', vacId), updatedVac)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `vaccines/${vacId}`));
          }
          return updatedVac;
        }
        return vac;
      });
      return updated;
    });
  };

  const deleteVaccineRecord = (vacId: string) => {
    setVaccineStocks(prev => prev.filter(vac => vac.id !== vacId));
    if (!isOffline) {
      deleteDoc(doc(db, 'vaccines', vacId))
        .catch(err => handleFirestoreError(err, OperationType.DELETE, `vaccines/${vacId}`));
    }
  };

  // Facility Admin: Register New Non-Medical Asset
  const addAssetRecord = (newAsset: NonMedicalAsset) => {
    setAssets(prev => [...prev, newAsset]);
    if (!isOffline) {
      setDoc(doc(db, 'assets', newAsset.id), newAsset)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `assets/${newAsset.id}`));
    }
  };

  // Facility Admin: Update Asset status/metadata
  const updateAssetRecord = (assetId: string, updatedFields: Partial<NonMedicalAsset>) => {
    setAssets(prev => {
      const updated = prev.map(ast => {
        if (ast.id === assetId) {
          const updatedAst = { ...ast, ...updatedFields };
          if (!isOffline) {
            setDoc(doc(db, 'assets', assetId), updatedAst)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `assets/${assetId}`));
          }
          return updatedAst;
        }
        return ast;
      });
      return updated;
    });
  };

  // Public Feedback submission DML
  const addFeedback = (fb: FeedbackItem) => {
    if (isOffline) {
      const queueItem: OfflineSyncQueueItem = {
        id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
        action: 'SUBMIT_FEEDBACK',
        payload: fb,
        timestamp: new Date().toISOString()
      };
      setSyncQueue(prev => [...prev, queueItem]);
    } else {
      setFeedbacks(prev => [fb, ...prev]);
      setDoc(doc(db, 'feedback', fb.id), fb)
        .catch(err => handleFirestoreError(err, OperationType.CREATE, `feedback/${fb.id}`));
      addNewAudit('CITIZEN_FEEDBACK', `Public user successfully registered feedback ticket ID: ${fb.id}`);
      addNotificationLog(`[Email Gateway] Citizen Feedback Alert sent to general director of ${fb.facilityName}.`);
    }
  };

  // Recalculating facility payroll roster with complex attendance, overtime, leave and salary structures
  const recalculatePayroll = () => {
    const updatedSlips: PayrollSlip[] = employees.map((emp, index) => {
      const basic = emp.salary;
      const struct = emp.salaryStructure;

      // 1. Calculate Attendance from Logs (for month of June 2026)
      const empLogs = attendanceLogs.filter(log => log.employeeId === emp.id);
      const presentDays = empLogs.filter(log => log.status === 'Present' || log.status === 'Late').length;
      const targetDays = 20; // Standard monthly working days logic
      const absentDays = empLogs.filter(log => log.status === 'Absent').length;

      // Pro-rated absence deduction
      const absenceDeduction = absentDays > 0 ? Math.floor((basic / targetDays) * absentDays) : 0;

      // 2. Leave Adjustments (Unpaid Approved Leaves)
      const unpaidApprovedLeaves = emp.leaveRequests?.filter(l => l.status === 'Approved' && l.reason.toLowerCase().includes('unpaid')).length || 0;
      const leaveDeduction = unpaidApprovedLeaves > 0 ? Math.floor((basic / targetDays) * unpaidApprovedLeaves * 1.2) : 0;

      // 3. Overtime Calculations (using logs or summary)
      const overtimeHours = empLogs.reduce((sum, log) => sum + (log.overtimeHours || 0), 0) || emp.attendanceSummary?.overtimeHours || 0;
      const overtimeMultiplier = struct?.hourlyOvertimeMultiplier || 1.25;
      const baseHourlyRate = basic / 160; // 40h/week * 4
      const overtimeAmount = Math.floor(overtimeHours * baseHourlyRate * overtimeMultiplier);

      // 4. Custom Allowances
      const allowanceHousing = struct?.housingAllowance !== undefined ? struct.housingAllowance : Math.floor(basic * 0.05);
      const allowanceTransport = struct?.transportAllowance !== undefined ? struct.transportAllowance : Math.floor(basic * 0.04);
      const allowanceDanger = struct?.dangerAllowance !== undefined ? struct.dangerAllowance : (emp.profession.toLowerCase().includes('doctor') || emp.profession.toLowerCase().includes('nurse') ? Math.floor(basic * 0.08) : 0);
      const allowancesSum = allowanceHousing + allowanceTransport + allowanceDanger;

      // 5. Custom Deductions
      const pensionEmployee = Math.floor(basic * (struct?.pensionRate !== undefined ? struct.pensionRate : 0.07)); // 7% standard pension
      const incomeTax = Math.floor(basic * (struct?.taxRate !== undefined ? struct.taxRate : 0.15)); // 15% standard income tax
      const customDeductionsFlat = struct?.customDeductions || 0;
      
      const deductionsSum = pensionEmployee + incomeTax + absenceDeduction + leaveDeduction + customDeductionsFlat;

      // 6. Net Take-Home Calculation
      const netSalary = basic + overtimeAmount + allowancesSum - deductionsSum;

      return {
        id: `PS-${index + 100}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        facilityId: emp.facilityId,
        month: "June 2026",
        basicSalary: basic,
        overtimeAmount,
        allowances: allowancesSum,
        deductions: deductionsSum,
        netSalary,
        status: 'Draft' as const, // resets to draft for approval workflow upon recalculate
        payslipGeneratedAt: new Date().toISOString(),
        grade: struct?.grade || (emp.position.includes('Chief') ? 'Grade XIV' : emp.position.includes('Doctor') ? 'Grade XII' : 'Grade X'),
        targetWorkDays: targetDays,
        actualWorkDays: presentDays > 0 ? presentDays : (targetDays - absentDays),
        absentDays,
        overtimeHoursWorked: overtimeHours,
        overtimeRatePerHour: Math.floor(baseHourlyRate * overtimeMultiplier),
        leaveDeductions: leaveDeduction,
        pensionEmployee,
        incomeTax,
        allowanceHousing,
        allowanceTransport,
        allowanceDanger
      };
    });

    saveRecalculatedPayrollSlips(updatedSlips);
    addNewAudit('PAYROLL_RECALCULATE', `Recalculated complex biometric attendance, leave adjust, and tax roster slips for current active staff.`);
  };

  const saveRecalculatedPayrollSlips = (newSlips: PayrollSlip[]) => {
    setPayrollSlips(newSlips);
    if (!isOffline) {
      newSlips.forEach(slip => {
        setDoc(doc(db, 'payrollSlips', slip.id), slip)
          .catch(err => handleFirestoreError(err, OperationType.WRITE, `payrollSlips/${slip.id}`));
      });
    } else {
      newSlips.forEach(slip => {
        const queueItem: OfflineSyncQueueItem = {
          id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
          action: 'UPDATE_PAYROLL_SLIP',
          payload: slip,
          timestamp: new Date().toISOString()
        };
        setSyncQueue(prev => [...prev, queueItem]);
      });
    }
  };

  const updatePayrollSlip = (slipId: string, updatedFields: Partial<PayrollSlip>) => {
    setPayrollSlips(prev => {
      const updated = prev.map(s => s.id === slipId ? { ...s, ...updatedFields } : s);
      const target = updated.find(s => s.id === slipId);
      if (target) {
        if (!isOffline) {
          setDoc(doc(db, 'payrollSlips', slipId), target)
            .catch(err => handleFirestoreError(err, OperationType.UPDATE, `payrollSlips/${slipId}`));
        } else {
          const queueItem: OfflineSyncQueueItem = {
            id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
            action: 'UPDATE_PAYROLL_SLIP',
            payload: target,
            timestamp: new Date().toISOString()
          };
          setSyncQueue(prevQ => [...prevQ, queueItem]);
        }
      }
      return updated;
    });
  };

  // Simulated Connection synchronization logic trigger
  const handleToggleOnlineOffline = () => {
    if (isOffline) {
      // Transitioning from OFFLINE to ONLINE
      setIsSyncing(true);
      setSyncStatusMsg("Resolving database conflicts using LAST-WRITE-WINS...");
      
      setTimeout(() => {
        // Resolve queue items
        syncQueue.forEach(item => {
          if (item.action === 'ADD_EMPLOYEE') {
            setEmployees(prev => [...prev, item.payload]);
            setDoc(doc(db, 'employees', item.payload.id), item.payload)
              .catch(err => handleFirestoreError(err, OperationType.CREATE, `employees/${item.payload.id}`));
            setDoc(doc(db, 'staff', item.payload.id), item.payload)
              .catch(err => handleFirestoreError(err, OperationType.CREATE, `staff/${item.payload.id}`));
            addNewAudit('OFFLINE_SYNC_RESOLVER', `Synced and approved employee record: ${item.payload.fullName} (ID: ${item.payload.id})`);
            addNotificationLog(`[Sync Resolver] Authorized employee ${item.payload.fullName} added successfully.`);
          } else if (item.action === 'SUBMIT_ATTENDANCE') {
            setAttendanceLogs(prev => [item.payload, ...prev]);
            setDoc(doc(db, 'attendance', item.payload.id), item.payload)
              .catch(err => handleFirestoreError(err, OperationType.CREATE, `attendance/${item.payload.id}`));
            addNewAudit('OFFLINE_SYNC_RESOLVER', `Synced attendance punch stamp for: ${item.payload.employeeName}`);
          } else if (item.action === 'SUBMIT_FEEDBACK') {
            setFeedbacks(prev => [item.payload, ...prev]);
            setDoc(doc(db, 'feedback', item.payload.id), item.payload)
              .catch(err => handleFirestoreError(err, OperationType.CREATE, `feedback/${item.payload.id}`));
            addNewAudit('OFFLINE_SYNC_RESOLVER', `Synced citizen feedback ticket: ${item.payload.id}`);
          } else if (item.action === 'UPDATE_PAYROLL_SLIP') {
            setDoc(doc(db, 'payrollSlips', item.payload.id), item.payload)
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, `payrollSlips/${item.payload.id}`));
            addNewAudit('OFFLINE_SYNC_RESOLVER', `Synced and updated employee payslip ID: ${item.payload.id}`);
          }
        });

        // Clear queue
        setSyncQueue([]);
        setIsSyncing(false);
        setSyncStatusMsg("");
        setIsOffline(false);
        addNewAudit('STATE_ONLINE_RESTORE', 'Restored hot replication database connection. Network sockets reconnected.');
        addNotificationLog(`[Database Sockets] Synced local queue items successfully with cloud Firestore database.`);
      }, 3500);

    } else {
      // Transitioning to OFFLINE
      setIsOffline(true);
      addNewAudit('STATE_OFFLINE_DEVIATE', 'Dislocated central database sockets. System running on client IndexedDB buffers.');
      addNotificationLog(`[Local Sockets] Database connection decoupled. PWA static caches enabled offline state.`);
    }
  };

  // Mock details for user info card based on active role
  const getActiveUserDetails = () => {
    switch (activeRole) {
      case 'public':
        return { name: 'Citizen Client', label: 'Health Client', initials: 'CU' };
      case 'staff':
        return { name: 'Dr. Chala Gemechu', label: 'Medical Doctor', initials: 'CG' };
      case 'facility_admin':
        return { name: 'Abebe Kebede', label: 'Coordinator', initials: 'AK' };
      case 'super_admin':
        return { name: 'Abdisa Wakuma', label: 'Super Admin', initials: 'AW' };
      default:
        return { name: 'Anonymous', label: 'Guest', initials: 'AN' };
    }
  };

  const activeUser = getActiveUserDetails();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100 items-center justify-center p-6 font-sans">
        <SecurityPortal
          onLogin={handleLoginFromPortal}
          onRegisterFacility={handleRegisterFacilityFromPortal}
          onRegisterCitizen={handleRegisterCitizenFromPortal}
          facilities={facilities}
          users={users}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden" id="mustali-dirs-app">
      
      {/* Dynamic Offline Sync Loader Indicator */}
      {isSyncing && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
            <h4 className="text-white font-mono text-xs font-bold uppercase tracking-wider">Synchronizing Offline Registries</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{syncStatusMsg}</p>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-cyan-400 h-2 animate-pulse w-4/5" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono">STAMP: sha256_conflict_resolution_active</span>
          </div>
        </div>
      )}

      {/* Top Navigation / High Density Header */}
      <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg select-none text-white">M</div>
          <h1 className="text-sm font-semibold tracking-tight text-white">
            MUSTALI DIRS <span className="text-slate-400 font-normal text-xs ml-2">| Health Information System</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Online/Offline Dynamic Pulse Selector */}
          <button
            id="btn-connection-toggle-header"
            onClick={handleToggleOnlineOffline}
            className={`flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-medium cursor-pointer transition ${
              isOffline
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-rose-500' : 'bg-green-500'} animate-pulse`}></span>
            {isOffline ? `${t.offline.toUpperCase()} (${syncQueue.length} Q)` : 'ONLINE SYNC ACTIVE'}
          </button>

          {/* Bilingual Quick Toggle */}
          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentLanguage === 'en' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('om')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentLanguage === 'om' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              OM
            </button>
          </div>

          {/* Connected User Badge */}
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6 select-none">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{activeUser.name}</p>
              <p className="text-[9px] text-blue-400 uppercase tracking-wider font-bold">
                {activeUser.label}
              </p>
            </div>
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs border border-slate-600 text-slate-200 font-bold">
              {activeUser.initials}
            </div>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-slate-400 hover:text-white px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold border border-slate-700 rounded hover:bg-slate-800 transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Nav and Dynamic Stage */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side Navigation Board - Secure Role-Based Access controls */}
        <nav className="w-60 bg-slate-900 text-slate-300 flex flex-col shrink-0 text-xs border-r border-slate-800 select-none shadow-xl">
          {activeRole === 'super_admin' && (
            <>
              <div className="p-4 uppercase text-[9px] font-extrabold tracking-widest text-blue-400">
                Federal Administrator Suite
              </div>
              <button
                onClick={() => {
                  setActiveRole('super_admin');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeRole === 'super_admin' && activeView === 'role_based' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>🛡️</span> Super Admin Center
              </button>

              <button
                id="btn-nav-view-stats"
                onClick={() => {
                  setActiveView('stats_admin');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'stats_admin' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>📊</span> System Stats
              </button>

              <button
                id="btn-nav-view-users"
                onClick={() => {
                  setActiveView('users_admin');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'users_admin' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>👥</span> User Directory
              </button>

              <button
                id="btn-nav-view-reports"
                onClick={() => {
                  setActiveView('reports_admin');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'reports_admin' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>📝</span> Reports Desk
              </button>

              <button
                id="btn-nav-view-registration"
                onClick={() => {
                  setActiveView('registration_module');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'registration_module' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>🏢</span> Facility Registry
              </button>

              <button
                id="btn-nav-view-staff-mgmt"
                onClick={() => {
                  setActiveView('staff_management_module');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'staff_management_module' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>👥</span> Staff Management
              </button>

              <button
                id="btn-nav-view-equipment-ledger"
                onClick={() => {
                  setActiveView('equipment_ledger');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'equipment_ledger' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>⚙️</span> Equipment & Supply
              </button>

              <button
                onClick={() => {
                  setShowMobileSim(true);
                  setShowTechSpecs(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  showMobileSim && !showTechSpecs
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>📱</span> Android Mobile App
              </button>

              <div className="p-4 uppercase text-[9px] font-extrabold tracking-widest text-slate-500 mt-2">
                Operational Switcher
              </div>
              <button
                onClick={() => {
                  setActiveRole('public');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left text-slate-400 hover:bg-slate-800 hover:text-white`}
              >
                <span>🌐</span> Citizen Portal Demo
              </button>
              <button
                onClick={() => {
                  setActiveRole('staff');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left text-slate-400 hover:bg-slate-800 hover:text-white`}
              >
                <span>👤</span> Staff Personnel Demo
              </button>
              <button
                onClick={() => {
                  setActiveRole('facility_admin');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left text-slate-400 hover:bg-slate-800 hover:text-white`}
              >
                <span>🏥</span> Facility Admin Demo
              </button>
            </>
          )}

          {activeRole === 'facility_admin' && (
            <>
              <div className="p-4 uppercase text-[9px] font-extrabold tracking-widest text-[#60a5fa]">
                🏥 Facility Admin Suite
              </div>
              <button
                onClick={() => {
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'role_based' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>🏥</span> Hospital Dashboard
              </button>

              <button
                id="btn-nav-view-staff-mgmt"
                onClick={() => {
                  setActiveView('staff_management_module');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'staff_management_module' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>👥</span> Staff Management
              </button>

              <button
                id="btn-nav-view-reports"
                onClick={() => {
                  setActiveView('reports_admin');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'reports_admin' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>📝</span> Reports Desk
              </button>

              <button
                id="btn-nav-view-equipment-ledger"
                onClick={() => {
                  setActiveView('equipment_ledger');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'equipment_ledger' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>⚙️</span> Equipment & Supply
              </button>
            </>
          )}

          {activeRole === 'staff' && (
            <>
              <div className="p-4 uppercase text-[9px] font-extrabold tracking-widest text-[#60a5fa]">
                👤 Employee Suite
              </div>
              <button
                onClick={() => {
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'role_based' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>👤</span> Medical Staff Portal
              </button>

              <button
                id="btn-nav-view-equipment-ledger"
                onClick={() => {
                  setActiveView('equipment_ledger');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'equipment_ledger' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>⚙️</span> Equipment & Supply
              </button>
            </>
          )}

          {activeRole === 'public' && (
            <>
              <div className="p-4 uppercase text-[9px] font-extrabold tracking-widest text-[#60a5fa]">
                🌐 Citizen Services
              </div>
              <button
                onClick={() => {
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'role_based' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>🌐</span> Citizen Portal
              </button>
            </>
          )}

          {activeRole !== 'public' && (
            <>
              <div className="p-4 uppercase text-[9px] font-extrabold tracking-widest text-slate-500 mt-2">
                System Settings
              </div>
              <button
                id="btn-nav-view-settings"
                onClick={() => {
                  setActiveView('settings_admin');
                  setShowTechSpecs(false);
                  setShowMobileSim(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  activeView === 'settings_admin' && !showTechSpecs && !showMobileSim
                    ? 'bg-blue-600 text-white font-semibold shadow-inner border-r-4 border-blue-400'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span>⚙️</span> Portal Settings
              </button>
            </>
          )}

          {activeRole === 'super_admin' && (
            <>
              <div className="p-4 uppercase text-[9px] font-extrabold tracking-widest text-slate-500 mt-2">
                Development & Spec
              </div>
              <button
                onClick={() => {
                  setShowTechSpecs(!showTechSpecs);
                  setActiveView('role_based');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition text-left font-semibold ${
                  showTechSpecs
                    ? 'bg-slate-700 text-cyan-300 font-semibold shadow-inner'
                    : 'hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                <span>🛠️</span> System Blueprint
              </button>
            </>
          )}

          {/* Built-in Status widgets in sidebar */}
          <div className="mt-auto p-4 border-t border-slate-800 bg-slate-950/40 font-mono text-[10px] space-y-1">
            <p className="text-[9px] uppercase font-bold text-slate-500 font-sans">Telemetry Status</p>
            <div className="flex justify-between">
              <span>Access DB</span>
              <span className={isOffline ? 'text-rose-400 font-bold animate-pulse' : 'text-green-400 font-semibold'}>
                {isOffline ? 'OFFLINE' : 'SECURE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Scope</span>
              <span className="text-blue-400 font-bold">{activeRole === 'super_admin' ? 'FEDERAL' : 'LOCAL'}</span>
            </div>
          </div>
        </nav>

        {/* Scrollable Main Content Frame */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-100" id="main-content-scroll-stage">
          
          {/* Dynamic Warning Alert for Offline Mode */}
          {isOffline && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex gap-3 text-rose-900 shadow-xs" id="offline-state-alert">
              <WifiOff className="text-rose-600 w-5 h-5 flex-shrink-0 animate-pulse mt-0.5" />
              <div className="text-xs">
                <span className="font-extrabold block">OFFLINE METRICS CAPTURE ACTIVE</span>
                Database sockets disconnected. Registration state cached locally to IndexedDB buffer. Submit entries when ready or restore network to execute conflict resolution.
              </div>
            </div>
          )}

          {/* Technical Specification Desk Panel if explicitly checked */}
          {showTechSpecs ? (
            <div className="animate-fade-in">
              <TechnicalSpecs />
            </div>
          ) : showMobileSim ? (
            <div className="animate-fade-in py-4 flex justify-center items-center">
              <AndroidSimulator
                facilities={facilities}
                employees={employees}
                isOffline={isOffline}
                onAttendanceLog={(log) => {
                  submitAttendanceLog(log);
                  addNewAudit('MOBILE_ATTENDANCE_PUNCH', `Captured GPS/Biometric shift check-in stamp via Android Mobile Client: ${log.employeeName}`);
                }}
                onOutbreakReport={(outbreak) => {
                  addNewAudit('MOBILE_OUTBREAK_REPORT', `MOBILE CRITICAL TRIGGER: Reported emergency outbreak warning file for ${outbreak.diseaseName} in woreda ${outbreak.locationWoreda}`);
                  addNotificationLog(`[Epidemic Alert] Ingested mobile incident file regarding ${outbreak.diseaseName} hotspot in ${outbreak.locationWoreda}`);
                  const newAnn = {
                    id: `ANN-${Date.now()}`,
                    facilityId: 'F-101',
                    facilityName: 'Mobile Outpost Reporting Node',
                    titleEn: `ALERT: Outbreak of ${outbreak.diseaseName} in ${outbreak.locationWoreda}`,
                    titleOm: `GABAASA: Dhukkuba ${outbreak.diseaseName} naannoo ${outbreak.locationWoreda} tti mul'ate`,
                    type: 'outbreak' as any,
                    detailsEn: `Epidemic cases reported dynamically from verified field coordinates. Estimated confirmed infections: ${outbreak.cases}. Quarantine advisory declared.`,
                    detailsOm: `Gabaasni dhibee tamsa'a daddarbaa kun qaama sarara bilbila dhuunfaan gabaafameera. Baay'ina namoota qabaman: ${outbreak.cases}.`,
                    date: new Date().toISOString().split('T')[0]
                  };
                  setAnnouncements(prev => [newAnn, ...prev]);
                  if (!isOffline) {
                    setDoc(doc(db, 'announcements', newAnn.id), newAnn)
                      .catch(err => handleFirestoreError(err, OperationType.CREATE, `announcements/${newAnn.id}`));
                  }
                }}
                onVaccineAdminister={(campaignId, doses) => {
                  addNewAudit('MOBILE_VACCINATION_DOSE', `Field worker validated and administered ${doses} vaccination doses under outreach code ${campaignId}`);
                  addNotificationLog(`[Immunization Gateway] Tracked ${doses} newly administered doses submitted via Android device.`);
                }}
                onOfflineSync={() => {
                  handleToggleOnlineOffline();
                }}
                syncQueueLength={syncQueue.length}
              />
            </div>
          ) : (
            /* Role-based or Admin Suite work areas */
            <div className="space-y-6">

              {activeView === 'equipment_ledger' && (
                <div className="animate-fade-in">
                  <MedicalEquipmentLedger
                    currentLanguage={currentLanguage}
                    facilities={facilities}
                    equipment={equipment}
                    vaccineStocks={vaccineStocks}
                    employees={employees}
                    activeRole={activeRole}
                    userFacilityId={activeRole === 'facility_admin' ? selectedFacilityId : undefined}
                    isOffline={isOffline}
                    onAddEquipment={addEquipmentRecord}
                    onUpdateEquipment={updateEquipmentRecord}
                    onDeleteEquipment={deleteEquipmentRecord}
                    onAddVaccine={addVaccineRecord}
                    onUpdateVaccine={updateVaccineRecord}
                    onDeleteVaccine={deleteVaccineRecord}
                    addNewAudit={addNewAudit}
                  />
                </div>
              )}

              {activeView === 'registration_module' && (
                <div className="animate-fade-in">
                  <FacilityRegistration
                    currentLanguage={currentLanguage}
                    facilities={facilities}
                    employees={employees}
                    equipment={equipment}
                    onAddFacility={handleAddNewFacility}
                    onUpdateFacilityStatus={handleUpdateFacilityStatus}
                    onDeleteFacility={handleDeleteFacility}
                    addNewAudit={addNewAudit}
                  />
                </div>
              )}
              
              {activeView === 'staff_management_module' && (
                <div className="animate-fade-in">
                  <StaffManagement
                    currentLanguage={currentLanguage}
                    facilities={facilities}
                    employees={employees}
                    attendanceLogs={attendanceLogs}
                    addNewEmployee={addNewEmployee}
                    updateEmployee={updateEmployee}
                    deleteEmployee={deleteEmployee}
                    submitAttendanceLog={submitAttendanceLog}
                    addNewAudit={addNewAudit}
                    activeRole={activeRole}
                    userFacilityId={activeRole === 'facility_admin' ? selectedFacilityId : undefined}
                  />
                </div>
              )}

              {activeView === 'users_admin' && (
                <div className="animate-fade-in shadow-xs">
                  <UserManagement
                    users={users}
                    facilities={facilities}
                    currentLanguage={currentLanguage}
                    onCreateUser={handleCreateUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                  />
                </div>
              )}

              {activeView === 'stats_admin' && (
                <div className="animate-fade-in">
                  <SystemStatistics
                    facilities={facilities}
                    employees={employees}
                    users={users}
                    currentLanguage={currentLanguage}
                  />
                </div>
              )}

              {activeView === 'reports_admin' && (
                <div className="animate-fade-in">
                  <ReportsDashboard
                    facilities={facilities}
                    employees={employees}
                    attendanceLogs={attendanceLogs}
                    currentLanguage={currentLanguage}
                    userFacilityId={activeRole === 'facility_admin' ? selectedFacilityId : undefined}
                  />
                </div>
              )}

              {activeView === 'settings_admin' && (
                <div className="animate-fade-in">
                  <SettingsPage
                    currentLanguage={currentLanguage}
                    onLanguageChange={(lang) => setLanguage(lang)}
                    mfaEnabled={mfaEnabled}
                    onMfaToggle={() => setMfaEnabled(!mfaEnabled)}
                  />
                </div>
              )}

              {activeView === 'role_based' && activeRole === 'public' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Citizens public information dashboard */}
                  <CommunityPortal
                    currentLanguage={currentLanguage}
                    facilities={facilities}
                    announcements={announcements}
                    feedbacks={feedbacks}
                    addFeedback={addFeedback}
                    isOffline={isOffline}
                  />
                  
                  {/* Visual live map tracking staff routes */}
                  <MapSimulator currentLanguage={currentLanguage} />
                </div>
              )}

              {activeView === 'role_based' && activeRole === 'staff' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Staff portal check-ins & CPD */}
                  <DashboardStaff
                    currentLanguage={currentLanguage}
                    employees={employees}
                    attendanceLogs={attendanceLogs}
                    events={events}
                    submitAttendanceLog={submitAttendanceLog}
                    submitTrainingLog={submitTrainingLog}
                    addNewAudit={addNewAudit}
                    isOffline={isOffline}
                    addNotificationLog={addNotificationLog}
                    payrollSlips={payrollSlips}
                  />
                </div>
              )}

              {activeView === 'role_based' && activeRole === 'facility_admin' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Facility coordinator dashboard */}
                  <DashboardFacilityAdmin
                    currentLanguage={currentLanguage}
                    facilities={facilities}
                    employees={employees}
                    attendanceLogs={attendanceLogs}
                    equipment={equipment}
                    assets={assets}
                    payrollSlips={payrollSlips}
                    addNewEmployee={addNewEmployee}
                    addNewAudit={addNewAudit}
                    recalculatePayroll={recalculatePayroll}
                    notificationsLog={notificationsLog}
                    updateFacilityProfile={updateFacilityProfile}
                    updateEmployee={updateEmployee}
                    deleteEmployee={deleteEmployee}
                    addEquipmentRecord={addEquipmentRecord}
                    updateEquipmentRecord={updateEquipmentRecord}
                    addAssetRecord={addAssetRecord}
                    updateAssetRecord={updateAssetRecord}
                    submitAttendanceLog={submitAttendanceLog}
                    userFacilityId={activeRole === 'facility_admin' ? selectedFacilityId : undefined}
                    updatePayrollSlip={updatePayrollSlip}
                  />
                </div>
              )}

              {activeView === 'role_based' && activeRole === 'super_admin' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Super admin control hub */}
                  <DashboardSuperAdmin
                    currentLanguage={currentLanguage}
                    facilities={facilities}
                    approveFacility={approveFacility}
                    rejectFacility={rejectFacility}
                    auditLogs={auditLogs}
                    addNewAudit={addNewAudit}
                    employees={employees}
                    equipment={equipment}
                    users={users}
                    setUsers={setUsers}
                    setFacilities={setFacilities}
                  />
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* Modern Compact Footnote Bar */}
      <footer className="h-8 bg-slate-200 border-t border-slate-350 px-6 flex items-center justify-between text-[10px] text-slate-500 shrink-0 font-medium">
        <div>© 2026 Federal Ministry of Health | MUSTALI DIRS (Stable Enterprise)</div>
        <div className="flex gap-4 font-mono text-[9px] select-none">
          <span>Database: 10.122.40.82</span>
          <span>Node: OK</span>
          <span className="text-blue-600 font-bold uppercase">Multi-tenant approved</span>
        </div>
      </footer>

    </div>
  );
}
