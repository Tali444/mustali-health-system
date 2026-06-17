import React from 'react';
import { Language, TenantFacility, Employee, SystemUser } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Activity, Shield, Users, Landmark, Syringe, ClipboardList } from 'lucide-react';

interface SystemStatisticsProps {
  facilities: TenantFacility[];
  employees: Employee[];
  users: SystemUser[];
  currentLanguage: Language;
}

export default function SystemStatistics({
  facilities,
  employees,
  users,
  currentLanguage
}: SystemStatisticsProps) {
  
  // Calculate aggregate metrics
  const totalFacilities = facilities.length;
  const approvedFacilities = facilities.filter(f => f.status === 'approved').length;
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;

  // Pie chart data: Facility types distribution
  const facilityTypes = facilities.reduce((acc: { [key: string]: number }, cur) => {
    acc[cur.type] = (acc[cur.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(facilityTypes).map(key => ({
    name: key,
    value: facilityTypes[key]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // Bar chart data: Employees per facility
  const barData = facilities.map(fac => {
    const count = employees.filter(emp => emp.facilityId === fac.id).length;
    return {
      name: fac.name.split(' ').slice(0, 2).join(' '), // shorten
      Pactitioners: count
    };
  });

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Top statistics overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-blue-600 bg-blue-50 p-2 rounded-xl w-fit">
            <Landmark className="w-5 h-5" />
          </div>
          <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono mt-3">Approved Tenants</span>
          <span className="text-xl font-extrabold text-slate-900 block mt-1">{approvedFacilities} / {totalFacilities}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-emerald-600 bg-emerald-50 p-2 rounded-xl w-fit">
            <Users className="w-5 h-5" />
          </div>
          <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono mt-3">Active Practitioners</span>
          <span className="text-xl font-extrabold text-slate-900 block mt-1">{activeEmployees} / {totalEmployees}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-amber-600 bg-amber-50 p-2 rounded-xl w-fit">
            <Shield className="w-5 h-5" />
          </div>
          <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono mt-3">Active Credentials</span>
          <span className="text-xl font-extrabold text-slate-900 block mt-1">{activeUsers} / {totalUsers}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-purple-600 bg-purple-50 p-2 rounded-xl w-fit">
            <Activity className="w-5 h-5" />
          </div>
          <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono mt-3">System Health Status</span>
          <span className="text-xs font-bold text-emerald-600 block mt-3 uppercase font-mono animate-pulse">● STABLE STATE</span>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar chart panel: Clinicians distribution */}
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-2xs space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Health Practitioners Capacity</h4>
            <span className="text-[10px] text-slate-400 font-medium">Distribution of medical teams mapped against facility endpoints.</span>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: '10.5px', borderRadius: '12px' }} />
                <Bar dataKey="Pactitioners" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart panel: Facility Classification */}
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-2xs space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Facility Classification Share</h4>
            <span className="text-[10px] text-slate-400 font-medium">Division of registry database entries across regulatory facility types.</span>
          </div>

          <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-1/2 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              {pieData.map((d, index) => (
                <div key={d.name} className="flex items-center gap-2 text-[10.5px]">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-semibold text-slate-700">{d.name}:</span>
                  <span className="font-mono text-slate-500 font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
