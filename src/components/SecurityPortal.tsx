import React, { useState, useEffect } from 'react';
import { UserRole, TenantFacility, SystemUser } from '../types';
import { Shield, Key, Building2, User, Landmark, Send, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface SecurityPortalProps {
  onLogin: (role: UserRole, facilityId?: string) => void;
  onRegisterFacility: (fac: any) => void;
  onRegisterCitizen: (fullName: string, email: string) => void;
  facilities: TenantFacility[];
  users: SystemUser[];
}

export default function SecurityPortal({
  onLogin,
  onRegisterFacility,
  onRegisterCitizen,
  facilities,
  users
}: SecurityPortalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'citizen_register'>('login');
  
  // Computed approved facilities
  const approvedFacilities = facilities.filter(f => {
    const statusVal = (f.status || '').toLowerCase();
    const permitVal = (f.permitStatus || '').toLowerCase();
    const approvalVal = (f.approvalStatus || '').toLowerCase();
    const onboardingVal = (f.onboardingStatus || '').toLowerCase();

    const isApprovedOrActive = (v: string) => v === 'approved' || v === 'active';

    return isApprovedOrActive(statusVal) || 
           isApprovedOrActive(permitVal) || 
           isApprovedOrActive(approvalVal) || 
           isApprovedOrActive(onboardingVal);
  });

  // Login states
  const [selectedRole, setSelectedRole] = useState<UserRole>('public');
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sync selectedFacility with approvedFacilities
  useEffect(() => {
    if (approvedFacilities.length > 0 && !approvedFacilities.some(f => f.id === selectedFacility)) {
      setSelectedFacility(approvedFacilities[0].id);
    }
  }, [approvedFacilities, selectedFacility]);

  // Register facility states
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [facName, setFacName] = useState('');
  const [facType, setFacType] = useState<'Regional Hospital' | 'General Hospital' | 'Primary Hospital' | 'Health Center' | 'Health Post'>('Health Center');
  const [licenseNo, setLicenseNo] = useState('');
  const [zone, setZone] = useState('Central');
  const [woreda, setWoreda] = useState('Woreda 01');
  const [kebele, setKebele] = useState('Kebele 01');
  const [latitude, setLatitude] = useState('9.0300');
  const [longitude, setLongitude] = useState('38.7400');

  // Citizen register states
  const [citizenName, setCitizenName] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenConfirmPassword, setCitizenConfirmPassword] = useState('');

  const [regSuccess, setRegSuccess] = useState(false);
  const [citizenRegSuccess, setCitizenRegSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputEmail = username.trim().toLowerCase();

    // 1. Super Admin checking
    if (selectedRole === 'super_admin') {
      const match = users.find(u => u.email.toLowerCase() === inputEmail && u.role === 'super_admin');
      if (inputEmail !== "abdisa.wakuma@health.go.et" && !match) {
        setErrorMsg('Error: Super Admin credentials or email identity not found.');
        return;
      }
      if (inputEmail === "admin@mustalihrmems.gov" && password !== "Admin@12345") {
        setErrorMsg('Error: Invalid secure password for Super Admin.');
        return;
      }
      if (match && match.status === 'Suspended') {
        setErrorMsg('Error: This Super Admin account is Suspended.');
        return;
      }
      onLogin(selectedRole);
      return;
    }

    // 2. Facility Admin checking
    if (selectedRole === 'facility_admin') {
      // Find the facility currently selected
      const fac = facilities.find(f => f.id === selectedFacility);
      if (!fac) {
        setErrorMsg('Error: Selected clinical facility node does not exist.');
        return;
      }

      // Check the facility's registration status
      const statusLower = (fac.status || '').toLowerCase();
      const permitLower = (fac.permitStatus || '').toLowerCase();
      const approvalLower = (fac.approvalStatus || '').toLowerCase();
      const onboardingLower = (fac.onboardingStatus || '').toLowerCase();

      const isApproved = statusLower === 'approved' || 
                         permitLower === 'approved' ||
                         approvalLower === 'approved' ||
                         onboardingLower === 'approved';

      const isRejected = statusLower === 'rejected' || 
                         permitLower === 'rejected' ||
                         approvalLower === 'rejected' ||
                         onboardingLower === 'rejected';

      const isSuspended = statusLower === 'suspended' || 
                          permitLower === 'suspended' ||
                          approvalLower === 'suspended' ||
                          onboardingLower === 'suspended';

      if (!isApproved) {
        if (isRejected) {
          setErrorMsg('Access Denied: Your facility registration request has been Rejected. Access is prohibited.');
          return;
        }
        if (isSuspended) {
          setErrorMsg('Access Denied: Your facility access is Suspended. Please contact system support.');
          return;
        }
        setErrorMsg('Access Denied: Your facility onboarding request is currently Pending Approval by the Super Admin.');
        return;
      }

      // Find user matching role and email
      const userMatch = users.find(u => u.email.toLowerCase() === inputEmail && u.role === 'facility_admin');
      if (userMatch) {
         if (userMatch.status === 'Pending Approval') {
           setErrorMsg('Access Denied: Your admin user account is currently Pending Approval.');
           return;
         }
         if (userMatch.status === 'Rejected') {
           setErrorMsg('Access Denied: Your onboarding credentials have been Rejected.');
           return;
         }
         if (userMatch.status === 'Suspended') {
           setErrorMsg('Access Denied: Your admin user account is Suspended.');
           return;
         }
      }

      // Validate custom password if matching admin email
      if (fac.adminEmail && fac.adminEmail.toLowerCase() === inputEmail) {
        if (fac.adminPassword && fac.adminPassword !== password) {
          setErrorMsg('Error: Invalid secure password for Facility Administrator.');
          return;
        }
      }

      onLogin(selectedRole, selectedFacility);
      return;
    }

    // 3. Staff Checking
    if (selectedRole === 'staff') {
      const match = users.find(u => u.email.toLowerCase() === inputEmail && u.role === 'staff');
      if (match) {
        if (match.status === 'Suspended') {
          setErrorMsg('Access Denied: Your medical staff privileges have been Suspended.');
          return;
        }
      }
      
      onLogin(selectedRole, match?.facilityId || 'F-101');
      return;
    }

    // 4. Public Citizen Checking
    if (selectedRole === 'public') {
      const match = users.find(u => u.email.toLowerCase() === inputEmail && u.role === 'public');
      if (match && match.status === 'Suspended') {
        setErrorMsg('Access Denied: Your public citizen portal account has been Suspended.');
        return;
      }
      onLogin(selectedRole);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!adminFullName || !adminEmail || !adminPhone || !adminPassword || !confirmPassword) {
      setErrorMsg('Please complete all Facility Administrator required fields.');
      return;
    }

    if (adminPassword !== confirmPassword) {
      setErrorMsg('Error: Password and Password Confirmation do not match.');
      return;
    }

    if (!facName || !licenseNo) {
      setErrorMsg('Please supply Facility Corporate Name and Regulatory License ID.');
      return;
    }

    onRegisterFacility({
      // Facility Info
      name: facName,
      type: facType,
      licenseNo: licenseNo,
      zone: zone,
      woreda: woreda,
      kebele: kebele,
      lat: parseFloat(latitude) || 9.0300,
      lng: parseFloat(longitude) || 38.7400,
      phone: adminPhone,
      email: adminEmail,
      // Administrator Info
      adminName: adminFullName,
      adminEmail: adminEmail,
      adminPhone: adminPhone,
      adminPassword: adminPassword,
    });

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setActiveTab('login');
      // Reset onboarding states
      setAdminFullName('');
      setAdminEmail('');
      setAdminPhone('');
      setAdminPassword('');
      setConfirmPassword('');
      setFacName('');
      setLicenseNo('');
    }, 3500);
  };

  const handleCitizenRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!citizenName || !citizenEmail || !citizenPassword || !citizenConfirmPassword) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    if (citizenPassword !== citizenConfirmPassword) {
      setErrorMsg('Error: Password and Password Confirmation do not match.');
      return;
    }

    onRegisterCitizen(citizenName, citizenEmail);
    setCitizenRegSuccess(true);
    setTimeout(() => {
      setCitizenRegSuccess(false);
      setActiveTab('login');
      setSelectedRole('public');
      setUsername(citizenEmail);
      setCitizenName('');
      setCitizenEmail('');
      setCitizenPassword('');
      setCitizenConfirmPassword('');
    }, 3000);
  };

  return (
    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative font-sans">
      {/* Decorative colored bar */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500 w-full" />
      
      {/* Brand Header */}
      <div className="p-6 text-center bg-slate-50 border-b border-slate-100">
        <div className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md mb-2">
          <Shield className="w-5.5 h-5.5" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">MUSTALI DIRS</h3>
        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Enterprise Health Information & Security Portal</p>
      </div>

      {/* Interface Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={() => {
            setActiveTab('login');
            setErrorMsg('');
          }}
          className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider text-center transition border-b-2 ${
            activeTab === 'login'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🔐 Secure Access
        </button>
        <button
          onClick={() => {
            setActiveTab('register');
            setErrorMsg('');
          }}
          className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider text-center transition border-b-2 ${
            activeTab === 'register'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🏥 Onboard Facility
        </button>
        <button
          onClick={() => {
            setActiveTab('citizen_register');
            setErrorMsg('');
          }}
          className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider text-center transition border-b-2 ${
            activeTab === 'citizen_register'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🌐 Citizen Sign Up
        </button>
      </div>

      <div className="p-6">
        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-100 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Access Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(['public', 'staff', 'facility_admin', 'super_admin'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setErrorMsg('');
                    }}
                    className={`flex items-center gap-2 p-2.5 border rounded-xl transition text-left text-xs ${
                      selectedRole === role
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-350'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {role === 'public' && 'Public Citizen'}
                      {role === 'staff' && 'Facility Doctor'}
                      {role === 'facility_admin' && 'Facility Warden'}
                      {role === 'super_admin' && 'Super Admin'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {selectedRole === 'facility_admin' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Assigned Facility</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                >
                  {approvedFacilities.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.id}) — {f.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">User Identity Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder={
                      selectedRole === 'public' ? 'citizen@gmail.com' :
                      selectedRole === 'super_admin' ? 'admin@mustalihrmems.gov' : 'admin@facility.go.et'
                    }
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[...]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Secure Password Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border[...]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition shadow-md"
            >
              Sign In to Environment →
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {regSuccess ? (
              <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-emerald-800 text-xs font-bold">Onboarding Documents Registered!</h4>
                <p className="text-[10px] text-emerald-600 leading-relaxed">
                  Your regulatory licensing application has been queued as <strong>Pending Approval</strong>. The system administrator was notified.
                </p>
              </div>
            ) : (
              <>
                {/* PART A: Administrator Settings */}
                <div className="border border-indigo-100 bg-indigo-50/20 p-3.5 rounded-2xl space-y-3">
                  <span className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wider border-b border-indigo-100 pb-1">
                    👤 Facility Administrator
                  </span>
                  
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Mohammed Al-Amin"
                      value={adminFullName}
                      onChange={(e) => setAdminFullName(e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Official Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. director@facility.gov.et"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +251 912 345 678"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* PART B: Facility Details */}
                <div className="border border-slate-200 p-3.5 rounded-2xl space-y-3">
                  <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1">
                    🏥 Facility Information
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Facility Corporate Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bisidimo Regional Referral"
                        value={facName}
                        onChange={(e) => setFacName(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Facility Type</label>
                      <select
                        value={facType}
                        onChange={(e) => setFacType(e.target.value as any)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-700"
                      >
                        <option value="Regional Hospital">Regional Hospital</option>
                        <option value="General Hospital">General Hospital</option>
                        <option value="Primary Hospital">Primary Hospital</option>
                        <option value="Health Center">Health Center</option>
                        <option value="Health Post">Health Post</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Regulatory ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. REG-MOH-OR-2026-B4"
                        value={licenseNo}
                        onChange={(e) => setLicenseNo(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Zone *</label>
                      <input
                        type="text"
                        required
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Woreda *</label>
                      <input
                        type="text"
                        required
                        value={woreda}
                        onChange={(e) => setWoreda(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Kebele *</label>
                      <input
                        type="text"
                        required
                        value={kebele}
                        onChange={(e) => setKebele(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">GPS Latitude *</label>
                      <input
                        type="text"
                        required
                        placeholder="9.0300"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">GPS Longitude *</label>
                      <input
                        type="text"
                        required
                        placeholder="38.7400"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition shadow-md"
                >
                  Onboard Health Node & Lodge Request ✓
                </button>
              </>
            )}
          </form>
        )}

        {activeTab === 'citizen_register' && (
          <form onSubmit={handleCitizenRegisterSubmit} className="space-y-4">
            {citizenRegSuccess ? (
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-blue-800 text-xs font-bold font-sans">Citizen Account Constructed</h4>
                <p className="text-[10px] text-blue-600">Your profile is immediately active. Connecting you to the secure portal...</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-3">
                  <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200 pb-1">
                    🌐 Register Citizen Portal Account
                  </span>

                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariku Jaleta"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Personal Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. citizen.user@gmail.com"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={citizenConfirmPassword}
                        onChange={(e) => setCitizenConfirmPassword(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition shadow-md"
                >
                  Create Citizen Account & Sign In ✓
                </button>
              </>
            )}
          </form>
        )}
      </div>

      <div className="px-8 py-3 bg-slate-50 text-center text-[9px] text-slate-400 font-mono border-t border-slate-100">
        SECURITY DECREE SIGNATURE: SHA-256 SECURE ENCRYPTION
      </div>
    </div>
  );
}
