import React from 'react';
import { Cpu, Database, Network, ShieldCheck, Terminal, Layers } from 'lucide-react';

export default function TechnicalSpecs() {
  return (
    <div className="bg-slate-950 text-slate-300 rounded-3xl p-6 border border-slate-900 shadow-xl font-mono text-xs space-y-6">
      
      {/* Header banner */}
      <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
        <div className="p-2 bg-slate-900 border border-slate-800 text-sky-400 rounded-xl">
          <Terminal className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-white font-extrabold tracking-wide text-xs">MUSTALI DIRS STATE SERVICE PLATFORM</h4>
          <p className="text-[10px] text-sky-500 font-bold uppercase mt-0.5">Sovereign Architecture Registry & Protocols</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Architecture Specs */}
        <div className="space-y-4">
          <h5 className="text-white font-extrabold border-b border-slate-900 pb-1 uppercase tracking-wider text-[11px] text-cyan-400">
            System Topology Specs
          </h5>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-white block font-bold">Client Persistence Cache Model</span>
                <span className="text-[10.5px] text-slate-400">Persistent IndexedDB stores local SQLite mirrors allowing sub-second bio checks when cell network decoupled.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Network className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-white block font-bold">Conflict Resolution Paradigm</span>
                <span className="text-[10.5px] text-slate-400">Standardized state stamps. Central database acts as sovereign ledger, automerging offline entries using temporal hashing.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-white block font-bold">MFA & Authentication Tokens</span>
                <span className="text-[10.5px] text-slate-400">OAuth 2.0 biometric assertions. Access role separation mapping state civil servants to specific regional facilities.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical stack logs */}
        <div className="space-y-3">
          <h5 className="text-white font-extrabold border-b border-slate-900 pb-1 uppercase tracking-wider text-[11px] text-cyan-400">
            Node Environment Coordinates
          </h5>

          <div className="bg-slate-980 p-4 border border-slate-900 rounded-2xl text-[10.5px] leading-relaxed space-y-1.5 text-slate-400">
            <div><span className="text-white">CODENAME:</span> Mustali-DIRS-Stable</div>
            <div><span className="text-white">STACK:</span> React 19.0 + Vite 6.2 + Tailwind CSS v4</div>
            <div><span className="text-white">PERSIST:</span> Firebase Firestore + standard client storage</div>
            <div><span className="text-white">SOCKET PORT:</span> 3000 (ingress reverse-proxied)</div>
            <div><span className="text-white">ENCRYPTION:</span> SHA-256 state seal + digital slips signature</div>
            <div className="pt-2 border-t border-slate-900 text-[10px] text-emerald-400">
              ● Central Server Connected at https://ais-pre-j3u2tskexdlonksbkz2huf-554897122951.europe-west1.run.app
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[9px] text-slate-500 pt-3 border-t border-slate-900 select-none">
        STATE INTERNAL DOCS • PRODUCED ACROSS REGIONAL MINISTRY INFRASTRUCTURES • DO NOT DISTRIBUTE OUTSIDE GOV NETWORKS
      </div>
    </div>
  );
}
