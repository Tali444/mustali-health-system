import React, { useState, useMemo } from 'react';
import { Language, TenantFacility, AuditLog, Employee, Equipment, SystemUser } from '../types';
import {
  ShieldCheck, UserCheck, AlertTriangle, Search, ScrollText, Bell, Globe, Activity, Building2,
  Users, CheckCircle2, XCircle, Plus, Trash2, UserPlus, SlidersHorizontal, List, Grid, Map,
  Moon, Sun, Download, Sparkles, TrendingUp, TrendingDown, Filter, Check, Lock, AlertCircle,
  Eye, Loader2, Send, HelpCircle, Wifi
} from 'lucide-react';

interface DashboardSuperAdminProps {
  currentLanguage: Language;
  facilities: TenantFacility[];
  approveFacility: (id: string) => void;
  rejectFacility: (id: string) => void;
  auditLogs: AuditLog[];
  addNewAudit: (action: string, details: string) => void;
  employees?: Employee[];
  equipment?: Equipment[];
  users?: SystemUser[];
  setUsers?: React.Dispatch<React.SetStateAction<SystemUser[]>>;
  setFacilities?: React.Dispatch<React.SetStateAction<TenantFacility[]>>;
}

export default function DashboardSuperAdmin({
  currentLanguage,
  facilities,
  approveFacility,
  rejectFacility,
  auditLogs,
  addNewAudit,
  employees = [],
  equipment = [],
  users = [],
  setUsers,
  setFacilities
}: DashboardSuperAdminProps) {
  // Theme state: dark mode by default
  const [darkMode, setDarkMode] = useState<boolean>(true);
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'approvals' | 'facilities' | 'users' | 'audits'>('analytics');
  // Local translations
  const lang = currentLanguage === 'om' ? 'om' : 'en';

  // State-driven modals & interactive items
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'success' | 'info' | 'error' }[]>([]);
  
  // Modals
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'approve' | 'reject' | 'correction';
    facility: TenantFacility | null;
  }>({ show: false, type: 'approve', facility: null });
  const [modalComment, setModalComment] = useState('');
  const [selectedFacilityForDetails, setSelectedFacilityForDetails] = useState<TenantFacility | null>(null);

  // User list states
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');
  const [userSortField, setUserSortField] = useState<'fullName' | 'role' | 'status'>('fullName');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', role: 'staff' as any, facilityId: 'F-101' });

  // Facility registry query states
  const [facLayout, setFacLayout] = useState<'table' | 'cards' | 'map'>('table');
  const [facRegionFilter, setFacRegionFilter] = useState('all');
  const [facTypeFilter, setFacTypeFilter] = useState('all');
  const [facStatusFilter, setFacStatusFilter] = useState('all');
  const [hoveredMapFacility, setHoveredMapFacility] = useState<TenantFacility | null>(null);

  // Audit list state
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterType, setAuditFilterType] = useState('all');

  // Trigger temporary toasts
  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Derived counts
  const pendingFacilities = useMemo(() => facilities.filter(f => f.status === 'pending'), [facilities]);
  const activeDoctors = useMemo(() => employees.filter(e => e.status === 'Active' && e.profession.toLowerCase().includes('doc')), [employees]);
  const securityWarningsCount = useMemo(() => auditLogs.filter(log => log.action.includes('WARN') || log.action.includes('FAIL') || log.action.includes('REJECT')).length, [auditLogs]);
  const equipmentCount = useMemo(() => equipment.length, [equipment]);
  
  // Notifications Data
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Facility Request', desc: 'Bishoftu Regional Hub submitted license documentation.', time: '5m ago', read: false },
    { id: '2', title: 'Security Event Code Delta', desc: 'Integrity mismatch cleared for node F-105.', time: '1h ago', read: false },
    { id: '3', title: 'System Synchronizer Status', desc: 'Sync cycle completed in 143ms.', time: '2h ago', read: true },
  ]);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  // Handle Approve/Reject with Modals
  const openConfirmModal = (type: 'approve' | 'reject' | 'correction', facility: TenantFacility) => {
    setConfirmModal({ show: true, type, facility });
    setModalComment('');
  };

  const handleModalConfirm = () => {
    if (!confirmModal.facility) return;
    const fac = confirmModal.facility;
    if (confirmModal.type === 'approve') {
      approveFacility(fac.id);
      addNewAudit('FACILITY_APPROVED', `Super Admin confirmed registration and licensed charter for: ${fac.name}. Note: ${modalComment || 'No comments'}`);
      addToast(`Facility [${fac.name}] successfully approved!`, 'success');
    } else if (confirmModal.type === 'reject') {
      rejectFacility(fac.id);
      addNewAudit('FACILITY_REJECTED', `Super Admin rejected application paperwork for: ${fac.name}. Note: ${modalComment || 'No comments'}`);
      addToast(`Facility [${fac.name}] application was declined.`, 'error');
    } else if (confirmModal.type === 'correction') {
      if (setFacilities) {
        setFacilities(prev => prev.map(f => f.id === fac.id ? { ...f, status: 'under_review' as any } : f));
      }
      addNewAudit('FACILITY_REVISION_REQUESTED', `Super Admin requested compliance corrections for: ${fac.name}. Note: ${modalComment}`);
      addToast(`Revision parameters dispatched to ${fac.name}.`, 'info');
    }
    setConfirmModal({ show: false, type: 'approve', facility: null });
  };

  // User Management actions
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email) {
      addToast('Please provide name and email', 'error');
      return;
    }
    const createdUser: SystemUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      facilityId: newUser.facilityId,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    if (setUsers) {
      setUsers(prev => [createdUser, ...prev]);
    }
    addNewAudit('USER_CREATED', `Super Admin provisioned credentials for system user: ${createdUser.fullName} as ${createdUser.role}`);
    addToast(`User ${createdUser.fullName} registered successfully!`, 'success');
    setShowAddUserModal(false);
    setNewUser({ fullName: '', email: '', role: 'staff', facilityId: 'F-101' });
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

  const handleBulkSuspend = () => {
    if (selectedUsers.length === 0) {
      addToast('No users selected', 'error');
      return;
    }
    if (setUsers) {
      setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'Suspended' as any } : u));
    }
    addNewAudit('USERS_SUSPENDED_BULK', `Super admin suspended ${selectedUsers.length} user accounts.`);
    addToast(`Suspended ${selectedUsers.length} account structures`, 'info');
    setSelectedUsers([]);
  };

  const handleBulkActivate = () => {
    if (selectedUsers.length === 0) {
      addToast('No users selected', 'error');
      return;
    }
    if (setUsers) {
      setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'Active' as any } : u));
    }
    addNewAudit('USERS_ACTIVATED_BULK', `Super admin restored ${selectedUsers.length} user accounts.`);
    addToast(`Re-activated ${selectedUsers.length} user profiles`, 'success');
    setSelectedUsers([]);
  };

  // Sorting and Filtering system users
  const sortedAndFilteredUsers = useMemo(() => {
    let result = [...users];
    if (userRoleFilter !== 'all') {
      result = result.filter(u => u.role === userRoleFilter);
    }
    if (userSearch) {
      result = result.filter(u => u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
    }
    result.sort((a, b) => {
      let fA = a[userSortField] || '';
      let fB = b[userSortField] || '';
      return userSortOrder === 'asc' ? fA.localeCompare(fB) : fB.localeCompare(fA);
    });
    return result;
  }, [users, userRoleFilter, userSearch, userSortField, userSortOrder]);

  const toggleUserSort = (field: 'fullName' | 'role' | 'status') => {
    if (userSortField === field) {
      setUserSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortOrder('asc');
    }
  };

  // Facility registry grid filtering
  const filteredRegistryFacilities = useMemo(() => {
    return facilities.filter(f => {
      const matchRegion = facRegionFilter === 'all' || f.region === facRegionFilter || f.zone.includes(facRegionFilter);
      const matchType = facTypeFilter === 'all' || f.type === facTypeFilter;
      const matchStatus = facStatusFilter === 'all' || f.status === facStatusFilter;
      const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.licenseNo.toLowerCase().includes(searchQuery.toLowerCase()) || f.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchType && matchStatus && matchSearch;
    });
  }, [facilities, facRegionFilter, facTypeFilter, facStatusFilter, searchQuery]);

  // Audit Logs filtering
  const filteredAudits = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch = log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.ip.includes(auditSearch);
      
      const matchType = auditFilterType === 'all' || 
        (auditFilterType === 'auth' && log.action.includes('AUTH')) ||
        (auditFilterType === 'facility' && (log.action.includes('FACILITY') || log.action.includes('CHARTER'))) ||
        (auditFilterType === 'warn' && (log.action.includes('WARN') || log.action.includes('FAIL') || log.action.includes('REJECT')));

      return matchSearch && matchType;
    });
  }, [auditLogs, auditSearch, auditFilterType]);

  // Static Regional Distribution Data for Visual Grid
  const regionalData = useMemo(() => {
    const regions: { [key: string]: number } = {};
    facilities.forEach(f => {
      const r = f.region || 'Oromia';
      regions[r] = (regions[r] || 0) + 1;
    });
    return Object.entries(regions).map(([name, count]) => ({ name, count }));
  }, [facilities]);

  // Static User Role proportions
  const roleProportions = useMemo(() => {
    const counts = { super_admin: 0, facility_admin: 0, staff: 0, public: 0 };
    users.forEach(u => {
      if (counts[u.role] !== undefined) counts[u.role]++;
    });
    return [
      { name: 'Super Admins', count: counts.super_admin, color: '#3B82F6' },
      { name: 'Facility Admins', count: counts.facility_admin, color: '#10B981' },
      { name: 'Doctors/Staff', count: counts.staff, color: '#F59E0B' },
      { name: 'Public Citizens', count: counts.public, color: '#8B5CF6' }
    ];
  }, [users]);

  // Abstract Coordinates Projection for Ethiopia / Oromia Regional Blueprint
  // Scale GPS coordinates into consistent box coordinates
  const projectedMapPoints = useMemo(() => {
    // Map bounds: Lat [3, 15], Lng [33, 48]
    return facilities.map(f => {
      const lat = f.gps?.lat || 9.0;
      const lng = f.gps?.lng || 38.7;
      // Convert to SVG space X: 0-400, Y: 0-300
      const x = ((lng - 33) / (48 - 33)) * 400;
      const y = (1 - (lat - 3) / (15 - 3)) * 300;
      return { facility: f, x, y };
    });
  }, [facilities]);

  // Translation sets for professional government look
  const textDict = {
    en: {
      dashboardTitle: "Super-Admin Control Headquarters",
      sysMotto: "Federal Ministry of Health | National Heath Node Ledger Dashboard",
      indicatorActive: "Online Sync Active",
      alerts: "Security Alerts",
      totalFac: "Registered Facilities",
      actDoc: "Active Doctors",
      pendApp: "Pending approvals",
      equipLedger: "Medical Supply Assets",
      monthlyReg: "Monthly Registrations",
      analytics: "Executive Analytics Center",
      approvals: "Charter Authorizations",
      registry: "Facility Nodes Ledger",
      users: "Identity & Roles Registry",
      audits: "Immutable Security logs",
      noPending: "Flawless! No pending facilities awaiting state charter authorization."
    },
    om: {
      dashboardTitle: "Waajira Ol-Aana Bulchiinsa Super-Admin",
      sysMotto: "Ministeera Fayyaa Federaalaa | Toora Galmeessa Fayyaa Biyoolessaa",
      indicatorActive: "Faayila Sync Banameera",
      alerts: "Akeekkachiisa Nageenyaa",
      totalFac: "Dhaabbilee Fayyaa",
      actDoc: "Ogeeyyii Fayyaa",
      pendApp: "Hayyama Eeggatan",
      equipLedger: "Mi’oota Tajaajilaa",
      monthlyReg: "Galmee Ji'aa",
      analytics: "Giddugala Xiinxala Hojii",
      approvals: "Mirkaneessa Hayyamaa",
      registry: "Roster Dhaabbilee Fayyaa",
      users: "Bulchiinsa Eenyummaa",
      audits: "Galmeewwan Nageenyaa",
      noPending: "Galatomaa! Hayyamni eeggataa jiru hin jiru."
    }
  };

  const t = textDict[lang];

  return (
    <div className={`p-1 rounded-3xl transition-colors duration-500 font-sans ${darkMode ? 'bg-[#0F172A] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast Notifications Overlay Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-bounce ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
              toast.type === 'error' ? 'bg-rose-500/10 border-rose-500 text-rose-400' :
              'bg-blue-500/10 border-blue-500 text-blue-400'
            } backdrop-blur-md`}
          >
            <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-rose-400' : 'bg-blue-500'}`} />
            <p className="text-xs font-semibold">{toast.text}</p>
          </div>
        ))}
      </div>

      {/* TOP DECORATIVE BANNER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 text-white rounded-t-2xl px-6 py-2.5 flex justify-between items-center text-xs shadow-inner">
        <div className="flex items-center gap-3">
          <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold tracking-wider text-[10px]">STATE LEDGER</span>
          <span className="opacity-90 font-mono tracking-wider text-[10.5px] uppercase">{t.sysMotto}</span>
        </div>
        <div className="flex items-center gap-5 font-mono text-[10px]">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
            <Wifi className="w-3.5 h-3.5 animate-pulse" /> {t.indicatorActive}
          </span>
          <span className="hidden md:inline text-white/70">Node: Addis_HQ_Secondary</span>
        </div>
      </div>

      {/* RAMPED NAVIGATION BAR WITH ENTERPRISE LOGO & STATS */}
      <header className={`px-6 py-4 border-b flex flex-col lg:flex-row gap-4 items-center justify-between ${darkMode ? 'bg-[#1E293B]/80 border-slate-700' : 'bg-white border-slate-200'} backdrop-blur-md relative z-20`}>
        {/* LOGO */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-50 animate-ping" />
            <div className="relative bg-blue-600 text-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">MUSTALI DIRS</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20 tracking-wider">Super Portal</span>
            </div>
            <p className="text-[11px] opacity-60 font-medium">Enterprise Health Care Governance System</p>
          </div>
        </div>

        {/* SEARCH BOX */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 opacity-40" />
          <input
            type="text"
            placeholder="Search regional facilities, license numbers, registry IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-all ${
              darkMode 
                ? 'bg-[#0F172A] border-slate-700 hover:border-slate-600 focus:border-blue-500 text-slate-100' 
                : 'bg-slate-100 border-slate-200 hover:border-slate-300 focus:border-blue-600 text-slate-800'
            } border`}
          />
        </div>

        {/* CONTROLS AREA */}
        <div className="flex items-center gap-4">
          
          {/* THEME SWITCHER */}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              addToast(`Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`, 'info');
            }}
            className={`p-2.5 rounded-xl transition ${darkMode ? 'bg-[#0F172A] hover:bg-slate-800 text-amber-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
            title="Toggle Visual Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* NOTIFICATION BELL WITH DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className={`p-2.5 rounded-xl transition relative border ${darkMode ? 'bg-[#0F172A] hover:bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl p-4 border z-50 ${darkMode ? 'bg-[#1E293B] border-slate-700 text-slate-100' : 'bg-white border-slate-250 text-slate-800'}`}>
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider">System Alerts ({unreadNotifications})</h5>
                  <button onClick={markAllNotificationsRead} className="text-[10px] text-blue-500 hover:underline">Mark read</button>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-2 rounded-xl text-[11px] ${n.read ? 'opacity-60' : 'bg-blue-500/10 border-l-2 border-blue-500 pl-3'}`}>
                      <div className="flex justify-between">
                        <span className="font-bold">{n.title}</span>
                        <span className="text-[9px] opacity-60">{n.time}</span>
                      </div>
                      <p className="opacity-80 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl transition border ${darkMode ? 'bg-[#0F172A] hover:bg-slate-800 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-[11px] uppercase shadow">
                KT
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-bold">Kassahun T.</p>
                <p className="text-[9px] opacity-40 font-mono font-bold leading-none">Super-Admin</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl p-3 border z-50 ${darkMode ? 'bg-[#1E293B] border-slate-700 text-slate-100' : 'bg-white border-slate-250 text-slate-800'}`}>
                <div className="p-2 border-b mb-1">
                  <p className="text-xs font-bold text-blue-500">Kassahun Tolera</p>
                  <p className="text-[10px] opacity-65">Federal Admin Director</p>
                </div>
                <div className="space-y-1 text-xs">
                  <button onClick={() => { addToast('Central MFA Status Certified Enforced', 'success'); setShowProfileMenu(false); }} className="w-full text-left p-2 hover:bg-slate-500/10 rounded-xl">🔒 Biometrics Security Status</button>
                  <button onClick={() => { addToast('Sync Database Configuration: OK', 'info'); setShowProfileMenu(false); }} className="w-full text-left p-2 hover:bg-slate-500/10 rounded-xl">⚙️ Sync Configurations</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 6 EXECUTIVE STATS SUMMARY TILES WITH SPARKLINE TRENDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-6">
        
        {/* TOTAL FACILITIES */}
        <div className={`rounded-2xl p-4.5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{t.totalFac}</span>
              <h4 className="text-2xl font-extrabold font-mono mt-1">{facilities.length}</h4>
            </div>
            <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl"><Building2 className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px]">
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
              <TrendingUp className="w-3 h-3" /> +8.3%
            </span>
            <span className="opacity-55">Vs last Q</span>
          </div>
          {/* Micro sparkline trend */}
          <div className="h-6 mt-3 opacity-30">
            <svg viewBox="0 0 100 30" className="w-full h-full stroke-blue-500 stroke-2 fill-none">
              <path d="M0,25 Q15,10 30,20 T60,5 T90,15 T100,5" />
            </svg>
          </div>
        </div>

        {/* ACTIVE DOCTORS */}
        <div className={`rounded-2xl p-4.5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{t.actDoc}</span>
              <h4 className="text-2xl font-extrabold font-mono mt-1">{activeDoctors.length || 142}</h4>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px]">
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
            <span className="opacity-55">Active status</span>
          </div>
          <div className="h-6 mt-3 opacity-30">
            <svg viewBox="0 0 100 30" className="w-full h-full stroke-emerald-500 stroke-2 fill-none">
              <path d="M0,15 T20,25 T40,10 T60,18 T80,5 T100,2" />
            </svg>
          </div>
        </div>

        {/* PENDING APPROVALS */}
        <div className={`rounded-2xl p-4.5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
          pendingFacilities.length > 0 
            ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/[0.04] to-transparent' 
            : darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{t.pendApp}</span>
              <h4 className={`text-2xl font-extrabold font-mono mt-1 ${pendingFacilities.length > 0 ? 'text-yellow-500' : ''}`}>{pendingFacilities.length}</h4>
            </div>
            <div className="bg-yellow-500/10 text-yellow-400 p-2.5 rounded-xl"><Activity className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px]">
            <span className="flex items-center gap-0.5 text-amber-400 font-bold bg-amber-500/10 px-1 rounded">
              Requires Audit
            </span>
            <span className="opacity-55">Security queue</span>
          </div>
          <div className="h-6 mt-3 opacity-30">
            <svg viewBox="0 0 100 30" className="w-full h-full stroke-amber-500 stroke-2 fill-none">
              <path d="M0,28 L20,25 L40,15 L60,18 L80,5 L100,8" />
            </svg>
          </div>
        </div>

        {/* SECURITY ALERTS */}
        <div className={`rounded-2xl p-4.5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{t.alerts}</span>
              <h4 className="text-2xl font-extrabold font-mono mt-1 text-rose-500">{securityWarningsCount}</h4>
            </div>
            <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-xl"><AlertTriangle className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px]">
            <span className="text-xs bg-rose-500/15 text-rose-400 rounded-full py-0.2 px-2 border border-rose-500/20 font-bold">
              0 Critical alerts
            </span>
          </div>
          <div className="h-6 mt-3 opacity-30">
            <svg viewBox="0 0 100 30" className="w-full h-full stroke-rose-500 stroke-2 fill-none">
              <path d="M0,5 L30,5 L40,25 L60,25 L70,8 L100,8" />
            </svg>
          </div>
        </div>

        {/* MEDICAL EQUIPMENT */}
        <div className={`rounded-2xl p-4.5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{t.equipLedger}</span>
              <h4 className="text-2xl font-extrabold font-mono mt-1">{equipmentCount || 1032}</h4>
            </div>
            <div className="bg-[#8B5CF6]/10 text-[#8B5CF6] p-2.5 rounded-xl"><ScrollText className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px]">
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
              Verified Operational
            </span>
          </div>
          <div className="h-6 mt-3 opacity-30">
            <svg viewBox="0 0 100 30" className="w-full h-full stroke-indigo-500 stroke-2 fill-none">
              <path d="M0,15 T15,8 T30,22 T50,18 T75,5 T100,10" />
            </svg>
          </div>
        </div>

        {/* MONTHLY PATIENT REGISTRATIONS */}
        <div className={`rounded-2xl p-4.5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{t.monthlyReg}</span>
              <h4 className="text-2xl font-extrabold font-mono mt-1 text-blue-400">12,845</h4>
            </div>
            <div className="bg-[#3B82F6]/10 text-blue-400 p-2.5 rounded-xl"><Sparkles className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px]">
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
            <span className="opacity-55">Daily spikes</span>
          </div>
          <div className="h-6 mt-3 opacity-30">
            <svg viewBox="0 0 100 30" className="w-full h-full stroke-sky-400 stroke-2 fill-none">
              <path d="M0,25 Q10,12 25,20 T50,5 T75,18 T100,5" />
            </svg>
          </div>
        </div>

      </section>

      {/* SECTION TABS FOR SECONDARY ROUTING LAYOUT */}
      <div className="px-6 border-b flex flex-wrap gap-2 relative z-10">
        {[
          { id: 'analytics', label: t.analytics, icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'approvals', label: `${t.approvals} (${pendingFacilities.length})`, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: 'facilities', label: t.registry, icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'users', label: t.users, icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'audits', label: t.audits, icon: <ScrollText className="w-3.5 h-3.5" /> }
        ].map((tabInfo) => (
          <button
            key={tabInfo.id}
            onClick={() => setActiveTab(tabInfo.id as any)}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tabInfo.id
                ? 'border-b-2 border-blue-500 text-blue-500 bg-blue-500/5'
                : 'border-b-2 border-transparent opacity-60 hover:opacity-100 hover:border-slate-500'
            }`}
          >
            {tabInfo.icon}
            {tabInfo.label}
          </button>
        ))}
      </div>

      {/* MAIN REDESIGNED TAB PANELS */}
      <main className="p-6 min-h-[500px]">

        {/* 1. ANALYTICS CENTER WITH ADVANCED SVG VISUALIZATION GRID */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in text-xs font-medium">

            {/* TOP HISTOGRAMS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* BAR CHART: REGIONAL FACILITY DISTRIBUTION */}
              <div className={`col-span-1 lg:col-span-5 rounded-2xl p-5 border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">Regional Distribution</h4>
                    <p className="text-[10px] opacity-60 mt-0.5">Physical hospital nodes mapped inside district authorities</p>
                  </div>
                  <Globe className="w-4 h-4 opacity-40 text-blue-500" />
                </div>
                
                {/* SVG Histograms */}
                <div className="space-y-3.5 mt-4">
                  {regionalData.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 italic">No facility distribution data.</div>
                  ) : (
                    regionalData.map((data, idx) => {
                      const maxVal = Math.max(...regionalData.map(r => r.count));
                      const percentage = maxVal > 0 ? (data.count / maxVal) * 100 : 0;
                      return (
                        <div key={data.name} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="opacity-85">{data.name}</span>
                            <span className="font-mono text-blue-500">{data.count} Facilities</span>
                          </div>
                          <div className="w-full bg-slate-500/10 h-3 rounded-full overflow-hidden flex">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full h-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* DUAL LINE GROWTH CHART: PATIENTS VS SESSIONS */}
              <div className={`col-span-1 lg:col-span-7 rounded-2xl p-5 border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-emerald-500">Node Sync & Enrolment Vector</h4>
                    <p className="text-[10px] opacity-60">Comparative ledger dynamics mapping active sessions (Jan - Jun)</p>
                  </div>
                  <div className="flex gap-4 text-[9px] font-mono font-extrabold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Consultations</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Patients</span>
                  </div>
                </div>

                {/* Customized SVG line graph */}
                <div className="relative pt-4 h-56">
                  <svg viewBox="0 0 500 200" className="w-full h-full">
                    {/* SVG Gradients */}
                    <defs>
                      <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Chart Gridlines */}
                    <line x1="40" y1="10" x2="480" y2="10" stroke={darkMode ? "#334155" : "#E2E8F0"} strokeDasharray="4,4" />
                    <line x1="40" y1="50" x2="480" y2="50" stroke={darkMode ? "#334155" : "#E2E8F0"} strokeDasharray="4,4" />
                    <line x1="40" y1="100" x2="480" y2="100" stroke={darkMode ? "#334155" : "#E2E8F0"} strokeDasharray="4,4" />
                    <line x1="40" y1="150" x2="480" y2="150" stroke={darkMode ? "#334155" : "#E2E8F0"} strokeDasharray="4,4" />
                    <line x1="40" y1="180" x2="480" y2="180" stroke={darkMode ? "#475569" : "#CBD5E1"} />

                    {/* Blue line: consultations (filled area first then line) */}
                    <path d="M 40,165 L 120,130 L 200,140 L 280,85 L 360,115 L 440,35 L 440,180 L 40,180 Z" fill="url(#blueGlow)" />
                    <path d="M 40,165 L 120,130 L 200,140 L 280,85 L 360,115 L 440,35" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />

                    {/* Green line: Patients */}
                    <path d="M 40,150 L 120,105 L 200,80 L 280,110 L 360,65 L 440,20 L 440,180 L 40,180 Z" fill="url(#greenGlow)" />
                    <path d="M 40,150 L 120,105 L 200,80 L 280,110 L 360,65 L 440,20" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

                    {/* Data interactive dots */}
                    <circle cx="120" cy="130" r="4" fill="#2563EB" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="280" cy="85" r="4" fill="#2563EB" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="440" cy="35" r="4" fill="#2563EB" stroke="#ffffff" strokeWidth="1.5" />

                    <circle cx="200" cy="80" r="4" fill="#10B981" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="360" cy="65" r="4" fill="#10B981" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="440" cy="20" r="4" fill="#10B981" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Labels */}
                    <text x="40" y="195" fill={darkMode ? "#94A3B8" : "#64748B"} fontSize="9.5" textAnchor="middle">Jan</text>
                    <text x="120" y="195" fill={darkMode ? "#94A3B8" : "#64748B"} fontSize="9.5" textAnchor="middle">Feb</text>
                    <text x="200" y="195" fill={darkMode ? "#94A3B8" : "#64748B"} fontSize="9.5" textAnchor="middle">Mar</text>
                    <text x="280" y="195" fill={darkMode ? "#94A3B8" : "#64748B"} fontSize="9.5" textAnchor="middle">Apr</text>
                    <text x="360" y="195" fill={darkMode ? "#94A3B8" : "#64748B"} fontSize="9.5" textAnchor="middle">May</text>
                    <text x="440" y="195" fill={darkMode ? "#94A3B8" : "#64748B"} fontSize="9.5" textAnchor="middle">Jun</text>
                  </svg>
                </div>
              </div>

            </div>

            {/* BOTTOM LOWER METRICS & HEALTH METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-4">
              
              {/* DONUT CHART: USER ROLES DISTRIBUTION */}
              <div className={`col-span-1 md:col-span-4 rounded-2xl p-5 border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#8B5CF6] mb-3">User Roles Proportions</h4>
                
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-3">
                  {/* custom SVG Donut */}
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {/* background track */}
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke={darkMode ? "#334155" : "#E2E8F0"} strokeWidth="4" />
                      {/* Segment 1: Super Admin */}
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="#312E81" strokeWidth="4.2" strokeDasharray="10 90" strokeDashoffset="100" />
                      {/* Segment 2: Facility Admin */}
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="#2563EB" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="90" />
                      {/* Segment 3: Staff */}
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10B981" strokeWidth="4.2" strokeDasharray="40 60" strokeDashoffset="65" />
                      {/* Segment 4: Public/Citizen */}
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="#F59E0B" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="25" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-extrabold leading-none">{users.length}</span>
                      <span className="text-[8px] opacity-50 uppercase tracking-widest mt-0.5">Identities</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    {roleProportions.map(el => (
                      <div key={el.name} className="flex justify-between items-center text-[10.5px]">
                        <span className="flex items-center gap-1.5 opacity-80">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: el.color }} />
                          {el.name}
                        </span>
                        <span className="font-bold leading-none font-mono">{el.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* INTEGRITY, PERFORMANCE & SLA SERVICES TARGETS */}
              <div className={`col-span-1 md:col-span-5 rounded-2xl p-5 border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-400 mb-3">Enterprise SLA Performance Monitor</h4>
                
                <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-[#0F172A]' : 'bg-slate-100'} border ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-[10px] opacity-55 block">Server Latency (MOH Gateway)</span>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-lg font-extrabold font-mono text-emerald-400">14ms</span>
                      <span className="text-[8px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">Optimal</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-[#0F172A]' : 'bg-slate-100'} border ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-[10px] opacity-55 block">Bionode Integration Lock</span>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-lg font-extrabold font-mono text-emerald-400">99.99%</span>
                      <span className="text-[8px] uppercase font-bold text-sky-400 bg-sky-500/10 px-1 rounded">Locked</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-[#0F172A]' : 'bg-slate-100'} border ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-[10px] opacity-55 block">MFA Compliance Rating</span>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-lg font-extrabold font-mono text-[#8B5CF6]">95.1%</span>
                      <span className="text-[8px] uppercase font-bold text-slate-400">SLA Rule</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-[#0F172A]' : 'bg-slate-100'} border ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-[10px] opacity-55 block">Offline Replication State Cache</span>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-lg font-extrabold font-mono text-blue-400">Stable</span>
                      <span className="text-[8px] uppercase font-bold text-white bg-blue-600 px-1 rounded-full">Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STICKY SECURITY COMPLIANCE CRITICAL SCORE CARDS */}
              <div className={`col-span-1 md:col-span-3 rounded-2xl p-5 border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} flex flex-col justify-between`}>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#EF4444] mb-2">National Health Security</h4>
                  <p className="text-[10.5px] opacity-75">Immutable decentralized auditing logs compliant with Ethiopian State Information Security standards.</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-700">
                  <div className="flex justify-between text-[11px] mb-1 font-bold">
                    <span>Cryptographic Verification Status</span>
                    <span className="text-emerald-400">Passed</span>
                  </div>
                  <div className="w-full bg-slate-750 h-2.5 rounded-full overflow-hidden flex">
                    <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. CHARTER APPROVALS QUEUE & CORRECTION HUB */}
        {activeTab === 'approvals' && (
          <div className="space-y-5 animate-fade-in text-xs font-medium">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">Pending Government Admissions</h4>
                <p className="text-[10.5px] opacity-65 mt-0.5">Approve, reject, or request compliance correction paperwork for region healthcare nodes.</p>
              </div>
            </div>

            {pendingFacilities.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center text-slate-400 bg-slate-400/[0.02]">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-pulse" />
                <h4 className="font-bold text-lg text-slate-600 dark:text-slate-300">{t.noPending}</h4>
                <p className="text-xs opacity-75 mt-1">All district hospital licenses are compiled in active replication ledger.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {pendingFacilities.map(f => (
                  <div key={f.id} className={`rounded-2xl p-5 border relative flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-[#1E293B]/80 hover:bg-[#1E293B] border-slate-700' : 'bg-white border-slate-250'}`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20 flex items-center justify-center text-lg font-black uppercase">
                            {f.name.substring(0, 2)}
                          </div>
                          <div>
                            <span className="text-[10.5px] bg-[#F59E0B]/15 text-[#F59E0B] py-0.5 px-2 rounded-full font-bold">Awaiting State Admission</span>
                            <h5 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1">{f.name}</h5>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">Node ID: {f.id}</span>
                      </div>

                      {/* Detail metadata stack */}
                      <div className="grid grid-cols-2 gap-4 mt-5 text-[11px]">
                        <div className="p-2 bg-slate-500/5 rounded-lg">
                          <span className="opacity-50 block text-[9.5px]">FACILITY CATEGORY</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">{f.type}</span>
                        </div>
                        <div className="p-2 bg-slate-500/5 rounded-lg">
                          <span className="opacity-50 block text-[9.5px]">GOVERNMENT LICENSE</span>
                          <span className="font-mono font-extrabold text-[#2563EB]">{f.licenseNo}</span>
                        </div>
                        <div className="p-2 bg-slate-500/5 rounded-lg col-span-2">
                          <span className="opacity-50 block text-[9.5px]">ADMIN REGION / SPATIAL GPS METADATA</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-250">
                            {f.region || 'Oromia'}, {f.zone}, {f.woreda} — GPS: ({f.gps?.lat}, {f.gps?.lng})
                          </span>
                        </div>
                        <div className="p-2 bg-slate-500/5 rounded-lg col-span-2">
                          <span className="opacity-50 block text-[9.5px]">CHIEF SIGNATORY CONTACT INFO</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-250 font-mono text-[10.5px]">
                            {f.email} | {f.phone || '+251 (011) 505--0010'}
                          </span>
                        </div>
                      </div>

                      {/* Document dossiers attachment simulator */}
                      <div className={`mt-4 p-2.5 rounded-lg border ${darkMode ? 'bg-[#0F172A]/70 border-slate-700' : 'bg-slate-50 border-slate-200'} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📄</span>
                          <div>
                            <p className="font-bold text-[10px]">Ministry_Compliance_Dossier_2026.pdf</p>
                            <p className="text-[9px] opacity-50">Authorized SHA-256 Signatures matched</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">Checked</span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 pt-4 border-t border-slate-500/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => setSelectedFacilityForDetails(f)}
                        className={`py-2 px-3 rounded-xl border text-center transition font-bold text-[11px] ${
                          darkMode ? 'bg-slate-800 border-slate-705 text-slate-200 hover:bg-slate-750' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        View Dossier
                      </button>

                      <button
                        onClick={() => openConfirmModal('correction', f)}
                        className="py-2 px-3 rounded-xl border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 text-center transition font-bold text-[11px]"
                      >
                        Ask Revision
                      </button>

                      <button
                        onClick={() => openConfirmModal('reject', f)}
                        className="py-2 px-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-center transition font-bold text-[11px]"
                      >
                        Decline
                      </button>

                      <button
                        onClick={() => openConfirmModal('approve', f)}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center transition font-bold text-[11px] col-span-2 sm:col-span-1 shadow-lg shadow-blue-500/20"
                      >
                        Confirm approve
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* CONFIRMATION DIALOG MODAL */}
            {confirmModal.show && confirmModal.facility && (
              <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative animate-scale-in ${
                  darkMode ? 'bg-[#1E293B] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <button 
                    onClick={() => setConfirmModal({ show: false, type: 'approve', facility: null })} 
                    className="absolute right-4 top-4 hover:opacity-60 text-lg font-bold"
                  >
                    ×
                  </button>
                  
                  <div className="text-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      confirmModal.type === 'approve' ? 'bg-emerald-500/10 text-emerald-400' :
                      confirmModal.type === 'reject' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {confirmModal.type === 'approve' ? <CheckCircle2 className="w-8 h-8" /> : 
                       confirmModal.type === 'reject' ? <XCircle className="w-8 h-8" /> : 
                       <AlertCircle className="w-8 h-8" />}
                    </div>

                    <h4 className="text-sm font-extrabold uppercase tracking-wider">
                      {confirmModal.type === 'approve' ? 'Approve Facility License' :
                       confirmModal.type === 'reject' ? 'Decline Spatial Charter' :
                       'Request Compliance Corrections'}
                    </h4>
                    <p className="text-[11px] opacity-75 mt-2">
                      Please confirm action for <span className="font-extrabold text-[#2563EB]">{confirmModal.facility.name}</span>. This log becomes cryptographic metadata.
                    </p>
                  </div>

                  {/* Comment context */}
                  <div className="mt-4 space-y-1">
                    <label className="text-[10px] opacity-50 uppercase font-bold">Action Note / Ministry Remarks</label>
                    <textarea
                      rows={3}
                      value={modalComment}
                      onChange={(e) => setModalComment(e.target.value)}
                      placeholder="Specify auditing notes, remarks or correction forms requirements here..."
                      className={`w-full rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        darkMode ? 'bg-[#0F172A] border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-800'
                      } border`}
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setConfirmModal({ show: false, type: 'approve', facility: null })}
                      className={`flex-1 py-2 rounded-xl text-center font-bold text-xs border ${
                        darkMode ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-250 text-slate-700'
                      }`}
                    >
                      Cancel Action
                    </button>
                    <button
                      onClick={handleModalConfirm}
                      className={`flex-1 py-2 rounded-xl text-center font-bold text-white text-xs ${
                        confirmModal.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                        confirmModal.type === 'reject' ? 'bg-rose-600 hover:bg-rose-700' :
                        'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      Commit Log
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL MODAL OVERLAY */}
            {selectedFacilityForDetails && (
              <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className={`w-full max-w-2xl rounded-3xl p-6 border shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto ${
                  darkMode ? 'bg-[#1E293B] border-slate-755 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <button onClick={() => setSelectedFacilityForDetails(null)} className="absolute right-4 top-4 hover:opacity-60 text-lg font-bold">×</button>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-blue-500 mb-1">State Registry Dossier Dossier</h3>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-150 mb-4">{selectedFacilityForDetails.name}</h2>
                  
                  <div className="space-y-4 text-xs font-medium">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-slate-500/5">
                        <span className="opacity-50 block text-[9.5px]">CHARTER REPLICATED ID</span>
                        <span className="font-mono font-bold">{selectedFacilityForDetails.id}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-500/5">
                        <span className="opacity-50 block text-[9.5px]">CERTIFICATION COMPLIANCE</span>
                        <span className="text-emerald-400 font-bold">SHA-256 Validated</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-500/5 space-y-1.5">
                      <h4 className="font-bold text-[10.5px] uppercase tracking-wider text-slate-400">Audits and Waiting Lists</h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span className="opacity-50">Patients Waiting:</span> <span className="font-bold">{selectedFacilityForDetails.patientsWaiting || 0}</span></div>
                        <div><span className="opacity-50">Estimated Wait:</span> <span className="font-bold">{selectedFacilityForDetails.estimatedWaitMinutes || 0} mins</span></div>
                        <div className="col-span-2"><span className="opacity-50">On-Call Doctors list:</span> <span className="font-mono text-slate-300">{(selectedFacilityForDetails.onCallDoctors || []).join(', ') || 'N/A'}</span></div>
                      </div>
                    </div>

                    <p className="opacity-75 leading-relaxed text-[11px]">
                      This node is synchronized directly with the Federal Ministry database. Any state modifications will propagate to other regional nodes automatically via the decentralized P2P replication mesh.
                    </p>

                    <div className="pt-4 border-t border-slate-700 flex justify-end">
                      <button onClick={() => setSelectedFacilityForDetails(null)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
                        Close Dossier Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. FACILITY REGISTRY LEDGER (TABLE, CARDS & INTERACTIVE VECTOR GPS MAP) */}
        {activeTab === 'facilities' && (
          <div className="space-y-5 animate-fade-in text-xs font-medium">
            
            {/* SEARCH AND FILTERS TOOLBAR */}
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} flex flex-col md:flex-row gap-4 items-center justify-between`}>
              <div className="flex flex-wrap gap-2 items-center">
                
                {/* Region Filter */}
                <select
                  value={facRegionFilter}
                  onChange={(e) => setFacRegionFilter(e.target.value)}
                  className={`p-2 rounded-xl text-xs font-bold border ${darkMode ? 'bg-[#0F172A] border-slate-700 text-slate-350' : 'bg-slate-50 border-slate-210 text-slate-700'}`}
                >
                  <option value="all">🌐 All Regions</option>
                  <option value="Oromia">Oromia</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Amhara">Amhara</option>
                  <option value="Harari">Harari</option>
                </select>

                {/* Facility Category Filter */}
                <select
                  value={facTypeFilter}
                  onChange={(e) => setFacTypeFilter(e.target.value)}
                  className={`p-2 rounded-xl text-xs font-bold border ${darkMode ? 'bg-[#0F172A] border-slate-700 text-slate-350' : 'bg-slate-50 border-slate-210 text-slate-700'}`}
                >
                  <option value="all">🏥 All Categories</option>
                  <option value="Regional Hospital">Regional Hospital</option>
                  <option value="General Hospital">General Hospital</option>
                  <option value="Primary Hospital">Primary Hospital</option>
                  <option value="Health Center">Health Center</option>
                  <option value="Health Post">Health Post</option>
                </select>

                {/* Status Filter */}
                <select
                  value={facStatusFilter}
                  onChange={(e) => setFacStatusFilter(e.target.value)}
                  className={`p-2 rounded-xl text-xs font-bold border ${darkMode ? 'bg-[#0F172A] border-slate-700 text-slate-350' : 'bg-slate-50 border-slate-210 text-slate-700'}`}
                >
                  <option value="all">🗳️ All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>

              {/* Layout switcher */}
              <div className="flex p-1 rounded-xl bg-slate-500/10">
                <button
                  onClick={() => setFacLayout('table')}
                  className={`p-2 rounded-lg transition flex items-center gap-1.5 font-bold ${facLayout === 'table' ? 'bg-blue-600 text-white shadow' : 'opacity-60'}`}
                  title="List Grid View"
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
                <button
                  onClick={() => setFacLayout('cards')}
                  className={`p-2 rounded-lg transition flex items-center gap-1.5 font-bold ${facLayout === 'cards' ? 'bg-blue-600 text-white shadow' : 'opacity-60'}`}
                  title="Card Gallery View"
                >
                  <Grid className="w-3.5 h-3.5" /> Cards
                </button>
                <button
                  onClick={() => setFacLayout('map')}
                  className={`p-2 rounded-lg transition flex items-center gap-1.5 font-bold ${facLayout === 'map' ? 'bg-blue-600 text-white shadow' : 'opacity-60'}`}
                  title="Spatial GPS Vector Map"
                >
                  <Map className="w-3.5 h-3.5" /> GPS Map Map
                </button>
              </div>
            </div>

            {/* A. TABLE LAYOUT */}
            {facLayout === 'table' && (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className={`border-b text-[10.5px] uppercase tracking-wider font-extrabold ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-220'}`}>
                      <th className="p-4">Facility ID</th>
                      <th className="p-4">Facility Name & Type</th>
                      <th className="p-4">Locality Authority</th>
                      <th className="p-4">Government License</th>
                      <th className="p-4 text-center">Patients waiting</th>
                      <th className="p-4">Replication Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/10">
                    {filteredRegistryFacilities.map(f => (
                      <tr key={f.id} className="hover:bg-slate-500/5 leading-normal transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-500">{f.id}</td>
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 dark:text-white">{f.name}</div>
                          <div className="text-[10px] opacity-50 mt-0.5">{f.type}</div>
                        </td>
                        <td className="p-4 opacity-85">
                          {f.region || 'Oromia'}, {f.zone}, {f.woreda}
                        </td>
                        <td className="p-4 font-mono text-[#2563EB] font-extrabold">{f.licenseNo}</td>
                        <td className="p-4 text-center font-mono font-extrabold">{f.patientsWaiting || 0}</td>
                        <td className="p-4">
                          <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                            f.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                            f.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* B. CARDS GRID */}
            {facLayout === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredRegistryFacilities.map(f => (
                  <div key={f.id} className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] opacity-40">LEDGER {f.id}</span>
                        <span className={`text-[8px] uppercase tracking-wider font-extrabold py-0.5 px-2 rounded-full ${
                          f.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                        }`}>{f.status}</span>
                      </div>

                      <h5 className="font-extrabold text-slate-800 dark:text-slate-100 mt-3 text-sm">{f.name}</h5>
                      <p className="text-[10px] opacity-50 mt-0.5 uppercase tracking-wide font-mono">{f.type}</p>

                      <div className="mt-4 space-y-1.5 text-[11px] leading-relaxed">
                        <div className="flex justify-between border-b border-slate-500/5 pb-1"><span className="opacity-50">License:</span> <span className="font-mono font-bold text-blue-500">{f.licenseNo}</span></div>
                        <div className="flex justify-between border-b border-slate-500/5 pb-1"><span className="opacity-50">Local Zone:</span> <span>{f.zone}, {f.woreda}</span></div>
                        <div className="flex justify-between border-b border-slate-500/5 pb-1"><span className="opacity-50 font-sans">Waitlist Queue:</span> <span className="font-mono font-extrabold text-slate-600 dark:text-slate-200">{f.patientsWaiting || 0} Headcount</span></div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-500/5 flex justify-end gap-2">
                      <button onClick={() => setSelectedFacilityForDetails(f)} className="p-1.5 px-3 bg-blue-600/10 hover:bg-blue-600/20 text-[#2563EB] rounded-lg text-[10.5px] font-bold">
                        Inspect Dossier File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* C. INTERACTIVE VECTOR GPS PROJECTION MAP */}
            {facLayout === 'map' && (
              <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} grid grid-cols-1 lg:grid-cols-12 gap-6`}>
                
                {/* Regional Info Panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">Spatial Mapping Projections</h4>
                    <p className="text-[10px] opacity-60">Interactive linear GPS coordinates mapped onto national Oromia health grids.</p>
                  </div>
                  
                  {hoveredMapFacility ? (
                    <div className={`p-4 rounded-xl border animate-scale-in text-[11px] ${darkMode ? 'bg-[#0F172A] border-slate-800' : 'bg-slate-100 border-slate-250'}`}>
                      <span className="font-mono text-[9px] opacity-40">PROJECTED COORDINATES METRICS</span>
                      <h5 className="font-extrabold text-sm text-blue-500 mt-1">{hoveredMapFacility.name}</h5>
                      <div className="mt-3 space-y-1">
                        <p><span className="opacity-60 text-[10px] font-mono">LAT_LNG:</span> {hoveredMapFacility.gps?.lat}°N, {hoveredMapFacility.gps?.lng}°E</p>
                        <p><span className="opacity-60 text-[10px] font-mono">CATEGORY:</span> {hoveredMapFacility.type}</p>
                        <p><span className="opacity-60 text-[10px] font-mono">WAIT:</span> {hoveredMapFacility.estimatedWaitMinutes || 0} mins queue</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-600 bg-slate-500/[0.02] flex items-center justify-center text-center text-slate-500 h-28">
                      <span>Hover over any mapped vector pinpoint to retrieve central biometrics node telemetry data.</span>
                    </div>
                  )}

                  <div className="p-3 bg-blue-600/10 text-[#2563EB] rounded-xl text-[10.5px] leading-relaxed font-bold">
                     Replicated health stations coordinates mapped based on raw Ministry geolocation parameters.
                  </div>
                </div>

                {/* SVG Map Projection Area */}
                <div className={`lg:col-span-8 rounded-xl p-2 relative flex items-center justify-center ${darkMode ? 'bg-[#0F172A]' : 'bg-slate-150'} overflow-hidden min-h-[340px]`}>
                  <svg viewBox="0 0 400 300" className="w-full max-w-lg h-full relative z-10">
                    
                    {/* Abstract Grid Map Boundaries */}
                    <path
                      d="M 50,50 L 150,20 L 300,40 L 370,120 L 320,220 L 250,270 L 120,250 L 50,150 Z"
                      fill={darkMode ? "#182235" : "#e2e8f0"}
                      stroke={darkMode ? "#334155" : "#cbd5e1"}
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                    />

                    {/* Sector Lines Grid (Topography) */}
                    <line x1="120" y1="20" x2="250" y2="270" stroke={darkMode ? "#1E293B" : "#F1F5F9"} strokeWidth="1.5" />
                    <line x1="50" y1="150" x2="370" y2="120" stroke={darkMode ? "#1E293B" : "#F1F5F9"} strokeWidth="1.5" />

                    {/* Plot coordinates */}
                    {projectedMapPoints.map(({ facility, x, y }) => {
                      const isHovered = hoveredMapFacility?.id === facility.id;
                      return (
                        <g
                          key={facility.id}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredMapFacility(facility)}
                          onMouseLeave={() => setHoveredMapFacility(null)}
                        >
                          {/* Pulsing beacon circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? 12 : 7}
                            className={`transition-all duration-300 fill-none ${
                              facility.status === 'approved' ? 'stroke-blue-500' : 'stroke-yellow-500'
                            }`}
                            strokeWidth="1.5"
                            opacity={isHovered ? 0.9 : 0.25}
                          />
                          {/* Inner pinpoint solid */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? 5.5 : 4}
                            className={`transition-all duration-300 ${
                              facility.status === 'approved' ? 'fill-blue-500' : 'fill-yellow-500'
                            }`}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. IDENTITY & ROLES CONTROL CATALOG */}
        {activeTab === 'users' && (
          <div className="space-y-5 animate-fade-in text-xs font-medium">
            
            {/* CONTROL AND FILTER MENU */}
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} flex flex-col md:flex-row gap-4 items-center justify-between`}>
              <div className="flex flex-wrap gap-2.5 items-center w-full md:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 opacity-40" />
                  <input
                    type="text"
                    placeholder="Search personnel directory..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className={`rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none transition-all ${
                      darkMode ? 'bg-[#0F172A] border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-800'
                    } border`}
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className={`p-1.5 rounded-xl text-xs font-bold border ${darkMode ? 'bg-[#0F172A] border-slate-700 text-slate-350' : 'bg-slate-50 border-slate-210 text-slate-700'}`}
                >
                  <option value="all">🛡️ All Assigned Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="facility_admin">Facility Admin</option>
                  <option value="staff">Doctor / Personnel</option>
                  <option value="public">Citizen / Public</option>
                </select>
              </div>

              {/* ACTION TOGGLES AND ACTIONS */}
              <div className="flex gap-2 w-full md:w-auto justify-end">
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-1 bg-slate-500/10 p-1 rounded-xl animate-scale-in">
                    <button
                      onClick={handleBulkSuspend}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold text-[10px] hover:bg-rose-700 transition"
                    >
                      Suspend Selected ({selectedUsers.length})
                    </button>
                    <button
                      onClick={handleBulkActivate}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700 transition"
                    >
                      Restore profile Actives
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/10"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add System User
                </button>
              </div>
            </div>

            {/* MAIN DATA TABLES */}
            <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-black tracking-widest ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-220'}`}>
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === sortedAndFilteredUsers.length && sortedAndFilteredUsers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedUsers(sortedAndFilteredUsers.map(u => u.id));
                          else setSelectedUsers([]);
                        }}
                      />
                    </th>
                    <th className="p-4 cursor-pointer" onClick={() => toggleUserSort('fullName')}>
                       System User Full Name
                    </th>
                    <th className="p-4 cursor-pointer" onClick={() => toggleUserSort('role')}>Role Classification</th>
                    <th className="p-4">Assigned Facility</th>
                    <th className="p-4 cursor-pointer" onClick={() => toggleUserSort('status')}>Auth Status</th>
                    <th className="p-4 text-center">Operation logs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/10">
                  {sortedAndFilteredUsers.map(user => {
                    const isSelected = selectedUsers.includes(user.id);
                    return (
                      <tr key={user.id} className={`transition-colors ${isSelected ? 'bg-blue-500/5' : 'hover:bg-slate-500/5'}`}>
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectUser(user.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-500/10 text-slate-400 flex items-center justify-center font-bold text-xs uppercase">
                              {user.fullName.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 dark:text-slate-150">{user.fullName}</div>
                              <div className="text-[10px] opacity-50 font-mono mt-0.5">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                            user.role === 'super_admin' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' :
                            user.role === 'facility_admin' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                            'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                          }`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold opacity-80">{user.facilityId}</td>
                        <td className="p-4">
                          <span className={`text-[8.5px] font-mono uppercase font-black px-1.5 py-0.5 rounded ${
                            user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-rose-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              addToast(`Audited logs fetched for system UID: ${user.id}`, 'info');
                            }}
                            className="p-1 px-3.5 hover:bg-slate-500/10 rounded-lg text-slate-400 hover:text-slate-200 transition"
                            title="Inspect telemetry keys logs"
                          >
                            Telemetry logs
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ADD SYSTEM USER COMPACT MODAL POPUP */}
            {showAddUserModal && (
              <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4">
                <form onSubmit={handleAddUser} className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative animate-scale-in ${
                  darkMode ? 'bg-[#1E293B] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <button type="button" onClick={() => setShowAddUserModal(false)} className="absolute right-4 top-4 hover:opacity-60 text-lg font-bold">×</button>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB] mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-400" /> Register System Personnel
                  </h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-50">Personnel Full Name</label>
                      <input
                        type="text"
                        required
                        value={newUser.fullName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                        className={`w-full p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs ${
                          darkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-100 border-slate-250 text-slate-900'
                        } border`}
                        placeholder="Dr. Merga Kenesa"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-50">Official Email</label>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs ${
                          darkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-100 border-slate-250 text-slate-900'
                        } border`}
                        placeholder="merga@health-dirs.gov.et"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase opacity-50">Role Classification</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                          className={`w-full p-2.5 rounded-xl font-bold ${
                            darkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-100 border-slate-250 text-slate-900'
                          } border`}
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="facility_admin">Facility Admin</option>
                          <option value="staff">Doctor/Personnel</option>
                          <option value="public">Citizen Public</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase opacity-50">Node Assignment Facility</label>
                        <select
                          value={newUser.facilityId}
                          onChange={(e) => setNewUser(prev => ({ ...prev, facilityId: e.target.value }))}
                          className={`w-full p-2.5 rounded-xl font-bold ${
                            darkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-100 border-slate-250 text-slate-900'
                          } border`}
                        >
                          {facilities.map(f => (
                            <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 py-2 text-xs font-bold border border-slate-500/20 hover:bg-slate-500/10 rounded-xl">Cancel</button>
                    <button type="submit" className="flex-1 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl">Save User Profile</button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* 5. IMMUTABLE SECURITY AUDIT LOG FEED */}
        {activeTab === 'audits' && (
          <div className="space-y-4 animate-fade-in text-xs font-medium">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">Central Event Cryptographic monitor</h4>
                <p className="text-[10.5px] opacity-65 mt-0.5">Real-time terminal log stream of telemetry signatures reflecting offline syncs, payroll, and biometrics matches.</p>
              </div>

              <div className="flex flex-wrap gap-2.5 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 opacity-40 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Filter audit actions..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="rounded-xl pl-9 pr-3 py-1.5 focus:outline-none bg-slate-500/10 border border-slate-700 max-w-xs text-xs font-semibold"
                  />
                </div>

                <select
                  value={auditFilterType}
                  onChange={(e) => setAuditFilterType(e.target.value)}
                  className={`p-1.5 rounded-xl text-xs font-bold border ${darkMode ? 'bg-[#0F172A] border-slate-700 text-slate-350' : 'bg-slate-50 border-slate-210 text-slate-700'}`}
                >
                  <option value="all">🗳️ All Operations</option>
                  <option value="auth">🔑 Authentication Feed</option>
                  <option value="facility">🏫 Charter Approvals</option>
                  <option value="warn">🚨 Alerts and failures</option>
                </select>
              </div>
            </div>

            {/* Cryptographic Logs Terminal Feed */}
            <div className={`font-mono rounded-3xl p-6 border overflow-y-auto shadow-inner text-[11px] leading-relaxed select-text space-y-4 max-h-[550px] ${
              darkMode ? 'bg-slate-950 border-slate-900 text-sky-400' : 'bg-slate-900 border-slate-200 text-green-400'
            }`}>
              {filteredAudits.length === 0 ? (
                <div className="text-center py-10 opacity-50 italic">No security timeline registers matching query criteria.</div>
              ) : (
                filteredAudits.map(log => (
                  <div key={log.id} className="border-b border-white/[0.04] pb-3.5 last:border-none last:pb-0">
                    <div className="flex flex-col sm:flex-row justify-between text-[10px] opacity-80 font-bold gap-1">
                      <span className="text-blue-400 dark:text-sky-300">[{new Date(log.timestamp).toLocaleString()}] {log.id} - {log.action}</span>
                      <span className="opacity-60 text-[9px]">SRC_IP: {log.ip} | STATE: SECURE_COM_LOCK</span>
                    </div>
                    <div className="mt-1.5 pl-4 border-l-2 border-slate-700 text-slate-300 dark:text-slate-300 font-sans text-xs">
                      <p className="font-bold opacity-60">Identity Context: <span className="opacity-100 font-extrabold text-blue-400">{log.user} ({log.role})</span></p>
                      <p className="mt-1 opacity-90 leading-relaxed font-sans">{log.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
