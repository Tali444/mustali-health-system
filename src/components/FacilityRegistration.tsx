import React, { useState } from 'react';
import { Language, TenantFacility, Employee, Equipment } from '../types';
import { Building2, Plus, Trash2, Edit3, Settings, AlertTriangle, CheckCircle, MapPin, Eye } from 'lucide-react';

interface FacilityRegistrationProps {
  currentLanguage: Language;
  facilities: TenantFacility[];
  employees: Employee[];
  equipment: Equipment[];
  onAddFacility: (newFac: TenantFacility) => void;
  onUpdateFacilityStatus: (id: string, newStatus: 'draft' | 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected') => void;
  onDeleteFacility: (id: string) => void;
  addNewAudit: (action: string, details: string) => void;
}

export default function FacilityRegistration({
  currentLanguage,
  facilities,
  employees,
  equipment,
  onAddFacility,
  onUpdateFacilityStatus,
  onDeleteFacility,
  addNewAudit
}: FacilityRegistrationProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New facility fields
  const [name, setName] = useState('');
  const [type, setType] = useState<'Regional Hospital' | 'General Hospital' | 'Primary Hospital' | 'Health Center' | 'Health Post'>('Health Center');
  const [licenseNo, setLicenseNo] = useState('');
  const [region, setRegion] = useState('Oromia');
  const [zone, setZone] = useState('East Hararghe');
  const [woreda, setWoreda] = useState('Babile');
  const [kebele, setKebele] = useState('Kebele 02');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !licenseNo || !email) {
      alert('Please complete all required fields.');
      return;
    }

    const newFac: TenantFacility = {
      id: `F-${101 + facilities.length}`,
      name,
      code: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      licenseNo,
      region,
      zone,
      woreda,
      kebele,
      gps: { lat: 9.03, lng: 38.74 },
      phone: phone || '+251 900 000 000',
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      patientsWaiting: 0,
      estimatedWaitMinutes: 0,
      onCallDoctors: ['Dr. System Auto-OnCall']
    };

    onAddFacility(newFac);
    addNewAudit('FACILITY_MANUAL_REGISTRATION', `New multi-tenant facility manually created on central registry ledger: ${name}`);
    
    // reset
    setName('');
    setLicenseNo('');
    setEmail('');
    setPhone('');
    setShowAddForm(false);
  };

  const handleStatusChange = (id: string, status: any, facName: string) => {
    onUpdateFacilityStatus(id, status);
    addNewAudit('FACILITY_STATUS_TOGGLED', `Facility ${facName} status updated to: ${status}`);
  };

  const handleDelete = (id: string, facName: string) => {
    if (confirm(`Are you sure you want to delete facility: ${facName}? This operations is irreversible.`)) {
      onDeleteFacility(id);
      addNewAudit('FACILITY_REMOVED', `Permanently purged facility records for: ${facName}`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Module Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-205 shadow-2xs">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
            {currentLanguage === 'en' ? 'Facility Registration & Admission' : 'Galmee Buufataalee Fayyaa'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Configure regulatory licensing status and multi-tenant nodes across clinics.</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> {showAddForm ? 'Close Onboard Form' : 'Register New Tenant'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm space-y-4 animate-fade-in">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Onboard New Health Tenant</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Facility Name *</label>
              <input
                type="text"
                required
                placeholder="Bisidimo Medical Node"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Facility Classification</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Regional Hospital">Regional Hospital</option>
                <option value="General Hospital">General Hospital</option>
                <option value="Primary Hospital">Primary Hospital</option>
                <option value="Health Center">Health Center</option>
                <option value="Health Post">Health Post</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Regulatory License ID *</label>
              <input
                type="text"
                required
                placeholder="REGULATORY-OR-2026-X"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Zone</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Woreda</label>
              <input
                type="text"
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Kebele</label>
              <input
                type="text"
                value={kebele}
                onChange={(e) => setKebele(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Phone Signature</label>
              <input
                type="text"
                placeholder="+251 900 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5">Email *</label>
              <input
                type="email"
                required
                placeholder="contact@mustali.gov.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition shadow-md"
          >
            Issue Onboarding Clearance Document ✓
          </button>
        </form>
      )}

      {/* Grid listing facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map(f => {
          const facEmployees = employees.filter(emp => emp.facilityId === f.id);
          const facEquipment = equipment.filter(eq => eq.facilityId === f.id);

          return (
            <div key={f.id} className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-slate-350 transition flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="text-blue-600 w-4.5 h-4.5" />
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{f.id} ({f.code})</span>
                  </div>
                  
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    f.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                    f.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                    'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    {f.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-900">{f.name}</h4>
                  <div className="text-[10px] text-slate-500 font-medium">Type: {f.type}</div>
                  <div className="text-[10px] text-slate-500 font-medium font-mono">License: {f.licenseNo}</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="block text-[8px] font-mono uppercase text-slate-400">Assigned Staff</span>
                    <span className="text-xs font-extrabold text-slate-800">{facEmployees.length} active</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono uppercase text-slate-400">Reg Equipment</span>
                    <span className="text-xs font-extrabold text-slate-800">{facEquipment.length} units</span>
                  </div>
                </div>

                <div className="mt-3 text-[10.5px] text-slate-505 leading-relaxed flex items-center gap-1.5">
                  <MapPin className="text-slate-400 w-3.5 h-3.5 shrink-0" />
                  <span>GPS: {f.gps.lat.toFixed(4)}, {f.gps.lng.toFixed(4)} • Woreda {f.woreda}</span>
                </div>
              </div>

              {/* Status Update & Actions Controls */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase text-slate-400">Permit Status:</span>
                  <select
                    value={f.status}
                    onChange={(e) => handleStatusChange(f.id, e.target.value as any, f.name)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-[10px] outline-none"
                  >
                    <option value="draft">draft</option>
                    <option value="pending">pending</option>
                    <option value="under_review">under_review</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(f.id, f.name)}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition"
                  title="Purge facility records"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
