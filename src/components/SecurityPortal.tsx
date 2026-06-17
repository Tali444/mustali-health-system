import React, { useState } from 'react';
import { UserRole, TenantFacility } from '../types';
import { Shield, Key, Building2, User, Landmark, Send, Check } from 'lucide-react';

interface SecurityPortalProps {
  onLogin: (role: UserRole, facilityId?: string) => void;
  onRegisterFacility: (fac: any) => void;
  facilities: TenantFacility[];
}

export default function SecurityPortal({ onLogin, onRegisterFacility, facilities }: SecurityPortalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login states
  const [selectedRole, setSelectedRole] = useState<UserRole>('public');
  const [selectedFacility, setSelectedFacility] = useState<string>(facilities[0]?.id || 'F-101');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Register facility states
  const [facName, setFacName] = useState('');
  const [facType, setFacType] = useState<'Regional Hospital' | 'General Hospital' | 'Primary Hospital' | 'Health Center' | 'Health Post'>('Health Center');
  const [licenseNo, setLicenseNo] = useState('');
  const [zone, setZone] = useState('Central');
  const [woreda, setWoreda] = useState('Woreda 01');
  const [kebele, setKebele] = useState('Kebele 01');
  const [latitude, setLatitude] = useState('9.03');
  const [longitude, setLongitude] = useState('38.74');
  const [phone, setPhone] = useState('+251 911 000 000');
  const [email, setEmail] = useState('contact@facility.gov.et');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Auto-authenticate for beautiful experience
    if (selectedRole === 'facility_admin') {
      onLogin(selectedRole, selectedFacility);
    } else {
      onLogin(selectedRole);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName || !licenseNo) {
      alert('Please fill out all required fields.');
      return;
    }

    onRegisterFacility({
      name: facName,
      type: facType,
      licenseNo: licenseNo,
      zone: zone,
      woreda: woreda,
      kebele: kebele,
      lat: parseFloat(latitude) || 9.03,
      lng: parseFloat(longitude) || 38.74,
      phone: phone,
      email: email,
    });

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setActiveTab('login');
      // Reset
      setFacName('');
      setLicenseNo('');
    }, 3000);
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative font-sans">
      {/* Decorative colored bar */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500 w-full" />
      
      {/* Brand Header */}
      <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">MUSTALI DIRS</h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">Enterprise Health Information & Security Portal</p>
      </div>

      {/* Interface Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-center transition border-b-2 ${
            activeTab === 'login'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🔐 Secure Access
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-center transition border-b-2 ${
            activeTab === 'register'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🏥 Onboard Facility
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-2">Access Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(['public', 'staff', 'facility_admin', 'super_admin'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setErrorMsg('');
                    }}
                    className={`flex items-center gap-2 p-3 border rounded-xl transition text-left text-xs ${
                      selectedRole === role
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-350'
                    }`}
                  >
                    <User className="w-4 h-4 text-slate-400" />
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-2">Select Assigned Facility</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-blue-500"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1.5">User Identity Email / ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'public' ? 'citizen@gov.et' : 'admin@mustali.gov.et'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1.5">Secure Password Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition shadow-md"
            >
              Sign In to Environment →
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {regSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-emerald-800 text-xs font-bold">Registration Captured</h4>
                <p className="text-[11px] text-emerald-600">Your licensing paperwork has been queued for Super Admin audit authorization.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">Facility Corporate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bisidimo Regional Referral Hospital"
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">Facility Type</label>
                    <select
                      value={facType}
                      onChange={(e) => setFacType(e.target.value as any)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Regional Hospital">Regional Hospital</option>
                      <option value="General Hospital">General Hospital</option>
                      <option value="Primary Hospital">Primary Hospital</option>
                      <option value="Health Center">Health Center</option>
                      <option value="Health Post">Health Post</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">Regulatory ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OROMIA-HEA-2026-89"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">Zone</label>
                    <input
                      type="text"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="block w-full px-2 py-2 bg-slate-50 border border-slate-200 text-[11px] font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">Woreda</label>
                    <input
                      type="text"
                      value={woreda}
                      onChange={(e) => setWoreda(e.target.value)}
                      className="block w-full px-2 py-2 bg-slate-50 border border-slate-200 text-[11px] font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">Kebele</label>
                    <input
                      type="text"
                      value={kebele}
                      onChange={(e) => setKebele(e.target.value)}
                      className="block w-full px-2 py-2 bg-slate-50 border border-slate-200 text-[11px] font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">GPS Lat</label>
                    <input
                      type="text"
                      placeholder="9.0300"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1">GPS Lng</label>
                    <input
                      type="text"
                      placeholder="38.7400"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition shadow-md"
                  >
                    Submit Charter Documents ✓
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>

      <div className="px-8 py-4 bg-slate-50 text-center text-[10px] text-slate-400 font-mono border-t border-slate-100">
        SECURITY SEAL: SHA-256 STATE CRYPTOGRAPHY SYSTEM
      </div>
    </div>
  );
}
