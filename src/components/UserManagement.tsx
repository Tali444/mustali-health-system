import React, { useState } from 'react';
import { Language, SystemUser, TenantFacility, UserRole } from '../types';
import { Users, UserPlus, Trash2, ShieldAlert, ShieldCheck, Check, Search } from 'lucide-react';

interface UserManagementProps {
  users: SystemUser[];
  facilities: TenantFacility[];
  currentLanguage: Language;
  onCreateUser: (newUserFields: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  onUpdateUser: (id: string, updatedFields: Partial<SystemUser>) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagement({
  users,
  facilities,
  currentLanguage,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}: UserManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [facilityId, setFacilityId] = useState(facilities[0]?.id || 'F-101');

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Fields cannot be blank.');
      return;
    }

    onCreateUser({
      fullName,
      email,
      role,
      facilityId: role === 'super_admin' ? 'central' : facilityId,
      status: 'Active'
    });

    // Reset
    setFullName('');
    setEmail('');
    setShowAddForm(false);
  };

  const toggleStatus = (id: string, currentStatus: 'Active' | 'Suspended') => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    onUpdateUser(id, { status: nextStatus });
  };

  const getFacilityName = (facId: string) => {
    if (facId === 'central') return 'Central Administration';
    const f = facilities.find(fac => fac.id === facId);
    return f ? f.name : `Facility: ${facId}`;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-205 shadow-2xs">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
            {currentLanguage === 'en' ? 'User Credentials Management' : 'Bulchiinsa Miseensotaa'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Sovereign identity provision files and privilege assignments.</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition uppercase tracking-wider"
        >
          <UserPlus className="w-4 h-4" /> {showAddForm ? 'Close Registar Form' : 'Provision User Credentials'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm space-y-4 animate-fade-in">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Assign Platform Keys</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">User Full Name *</label>
              <input
                type="text"
                required
                placeholder="Dr. Merga Kenesa"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Email Identity *</label>
              <input
                type="email"
                required
                placeholder="merga@mustali.gov.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Assigned Platform Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
              >
                <option value="public">Citizen Public</option>
                <option value="staff">Facility Staff / Doctor</option>
                <option value="facility_admin">Facility Administrator</option>
                <option value="super_admin">Central Super Admin</option>
              </select>
            </div>

            {role !== 'super_admin' && (
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Assigned Corporate Tenant</label>
                <select
                  value={facilityId}
                  onChange={(e) => setFacilityId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
                >
                  {facilities.map(fac => (
                    <option key={fac.id} value={fac.id}>{fac.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition shadow-md"
          >
            Provision Active Digital Key ✓
          </button>
        </form>
      )}

      {/* Directory Search */}
      <div className="flex justify-end">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search credentials directory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Grid listing Users details */}
      <div className="bg-white border rounded-3xl overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-505 font-bold border-b">
              <th className="p-4 uppercase tracking-wider text-[10px]">Staff Identity</th>
              <th className="p-4 uppercase tracking-wider text-[10px]">Platform Access Role</th>
              <th className="p-4 uppercase tracking-wider text-[10px]">Corporate Enclave</th>
              <th className="p-4 uppercase tracking-wider text-[10px]">Permission Access Status</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="p-4">
                  <div className="font-extrabold text-slate-900">{u.fullName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                </td>
                <td className="p-4">
                  <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded border ${
                    u.role === 'super_admin' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                    u.role === 'facility_admin' ? 'bg-blue-5 border-blue-100 text-blue-700' :
                    'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-slate-600">
                  {getFacilityName(u.facilityId)}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(u.id, u.status)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition border cursor-pointer ${
                      u.status === 'Active'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                        : 'bg-rose-50 border-rose-100 text-rose-800'
                    }`}
                  >
                    {u.status === 'Active' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    {u.status}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onDeleteUser(u.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition"
                    title="Revoke and delete keys"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
