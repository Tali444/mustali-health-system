import React, { useState } from 'react';
import { Language, TenantFacility, AuditLog } from '../types';
import { ShieldCheck, UserCheck, AlertTriangle, Play, CheckCircle2, XCircle, Search, ScrollText } from 'lucide-react';

interface DashboardSuperAdminProps {
  currentLanguage: Language;
  facilities: TenantFacility[];
  approveFacility: (id: string) => void;
  rejectFacility: (id: string) => void;
  auditLogs: AuditLog[];
  addNewAudit: (action: string, details: string) => void;
}

export default function DashboardSuperAdmin({
  currentLanguage,
  facilities,
  approveFacility,
  rejectFacility,
  auditLogs,
  addNewAudit
}: DashboardSuperAdminProps) {
  const [tab, setTab] = useState<'approvals' | 'facilities' | 'audits'>('approvals');
  const [auditSearch, setAuditSearch] = useState('');

  const pendingFacilities = facilities.filter(f => f.status === 'pending');
  const nonPendingFacilities = facilities.filter(f => f.status !== 'pending');

  const filteredAudits = auditLogs.filter(log =>
    log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  const handleApprove = (id: string, name: string) => {
    approveFacility(id);
    addNewAudit('FACILITY_APPROVED', `Super Admin confirmed registration and licensed charter for: ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    rejectFacility(id);
    addNewAudit('FACILITY_REJECTED', `Super Admin revoked application paperwork for: ${name}`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Super Admin Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 relative overflow-hidden shadow-md">
          <div className="absolute right-4 top-4 bg-blue-500/10 text-blue-400 p-2 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Central Registry</span>
          <h4 className="text-xl font-extrabold mt-1">{facilities.length} Facilities</h4>
          <p className="text-[11px] text-slate-400 mt-1">Multi-tenant nodes globally registered.</p>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 relative overflow-hidden shadow-md">
          <div className="absolute right-4 top-4 bg-orange-500/10 text-orange-400 p-2 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Pending Charter Audits</span>
          <h4 className="text-xl font-extrabold mt-1 text-orange-400">{pendingFacilities.length} Pending</h4>
          <p className="text-[11px] text-slate-400 mt-1">Requiring state security authorization.</p>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 relative overflow-hidden shadow-md">
          <div className="absolute right-4 top-4 bg-emerald-500/10 text-emerald-400 p-2 rounded-xl">
            <ScrollText className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Cryptographic Audits</span>
          <h4 className="text-xl font-extrabold mt-1">{auditLogs.length} Records</h4>
          <p className="text-[11px] text-slate-400 mt-1">Immutable system activity reports.</p>
        </div>
      </div>

      {/* Control Panel Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setTab('approvals')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 mr-6 ${
            tab === 'approvals'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🚨 Authorization Queues ({pendingFacilities.length})
        </button>
        <button
          onClick={() => setTab('facilities')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 mr-6 ${
            tab === 'facilities'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🏫 Enrolled Facilities ({nonPendingFacilities.length})
        </button>
        <button
          onClick={() => setTab('audits')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
            tab === 'audits'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          📜 Central Cryptographic Logs
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {tab === 'approvals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">PENDING FACILITY ENROLLMENT REQUESTS</h4>
                <p className="text-[11px] text-slate-505">Validate the hospital credentials before permitting state synchronization databases.</p>
              </div>
            </div>

            {pendingFacilities.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-slate-150 rounded-2xl text-slate-400 text-xs italic">
                Excellent! No pending facilities awaiting state charter approval.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingFacilities.map(f => (
                  <div key={f.id} className="bg-white border rounded-2xl p-5 hover:border-slate-350 transition flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">CHARTER KEY: {f.id}</span>
                        <span className="bg-amber-100 border border-amber-200 text-amber-700 text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                          PENDING ADMISSION
                        </span>
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-900 mt-2">{f.name}</h5>
                      
                      <div className="mt-4 space-y-1.5 text-[11px] text-slate-600">
                        <div className="flex justify-between"><span className="text-slate-400">Class Type:</span><span className="font-semibold text-slate-800">{f.type}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">License ID:</span><span className="font-mono text-slate-800">{f.licenseNo}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Geographic Demark:</span><span>{f.zone}, {f.woreda}, {f.kebele}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Representative:</span><span>{f.email}</span></div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => handleApprove(f.id, f.name)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Charter
                      </button>
                      <button
                        onClick={() => handleReject(f.id, f.name)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-250 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'facilities' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">ENROLLED HEALTH TENANTS Roster</h4>
              <p className="text-[11px] text-slate-505">Actively provisioned health centers and hospitals synchronized with the Mustali Ministry ledger.</p>
            </div>

            <div className="bg-white border rounded-3xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-505 font-bold border-b">
                    <th className="p-4 uppercase tracking-wider text-[10px]">Facility ID</th>
                    <th className="p-4 uppercase tracking-wider text-[10px]">Name & Type</th>
                    <th className="p-4 uppercase tracking-wider text-[10px]">Locality</th>
                    <th className="p-4 uppercase tracking-wider text-[10px]">License Number</th>
                    <th className="p-4 uppercase tracking-wider text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nonPendingFacilities.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-semibold text-slate-600">{f.id}</td>
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">{f.name}</div>
                        <div className="text-[10px] text-slate-500">{f.type}</div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {f.zone}, {f.woreda}
                      </td>
                      <td className="p-4 font-mono text-slate-500">{f.licenseNo}</td>
                      <td className="p-4">
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${
                          f.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800'
                        }`}>
                          {f.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'audits' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">CENTRAL EVENT MONITOR</h4>
                <p className="text-[11px] text-slate-505">Real-time listing of audit registries reflecting biometrics matching, offline queues synchronization, and payroll modifications.</p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by action or details..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-slate-950 text-sky-400 font-mono rounded-3xl p-6 border border-slate-900 space-y-3.5 max-h-[500px] overflow-y-auto shadow-inner text-[11px] leading-relaxed">
              {filteredAudits.length === 0 ? (
                <div className="text-center py-6 text-slate-500 italic">No security logs match query criteria.</div>
              ) : (
                filteredAudits.map(log => (
                  <div key={log.id} className="border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row justify-between text-[10px] text-sky-500 gap-1 font-bold">
                      <span>[{new Date(log.timestamp).toLocaleString()}] {log.id} - {log.action}</span>
                      <span>SRC_IP: {log.ip}</span>
                    </div>
                    <div className="text-slate-350 mt-1 pl-4 border-l-2 border-slate-800">
                      User Context: <span className="text-slate-200 font-extrabold">{log.user} ({log.role})</span>
                      <p className="text-slate-400 mt-0.5 text-[10.5px] font-sans leading-relaxed">{log.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
