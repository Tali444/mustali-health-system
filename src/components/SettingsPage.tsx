import React from 'react';
import { Language } from '../types';
import { Settings, ShieldCheck, Languages, Save, RefreshCw, Smartphone } from 'lucide-react';

interface SettingsPageProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  mfaEnabled: boolean;
  onMfaToggle: () => void;
}

export default function SettingsPage({
  currentLanguage,
  onLanguageChange,
  mfaEnabled,
  onMfaToggle
}: SettingsPageProps) {
  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      
      {/* Settings title header */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Settings className="text-slate-800 w-5 h-5 animate-spin-slow" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">System Control Parameters</h3>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Configure bilingual locales and MFA authentication profiles.</p>
      </div>

      {/* Language Toggle section */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <Languages className="text-blue-600 w-4.5 h-4.5" />
          <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Locale Preference Mapping</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-105">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`p-4 border rounded-2xl text-left transition ${
              currentLanguage === 'en'
                ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                : 'border-slate-200 hover:border-slate-350 text-slate-600'
            }`}
          >
            <span className="block text-xs font-bold font-sans">English</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">Default primary legislative translation dictionary.</span>
          </button>

          <button
            type="button"
            onClick={() => onLanguageChange('om')}
            className={`p-4 border rounded-2xl text-left transition ${
              currentLanguage === 'om'
                ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                : 'border-slate-200 hover:border-slate-350 text-slate-600'
            }`}
          >
            <span className="block text-xs font-bold font-sans">Afaan Oromo</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">Naannoolee daddarboo fi gabaasaa hojjattootaaf.</span>
          </button>
        </div>
      </div>

      {/* MFA Authorization section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-600 w-4.5 h-4.5" />
          <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Security Autentication Shield</h4>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-150">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-slate-900 block uppercase">Dual Biometric MFA</span>
            <span className="text-[11px] text-slate-505 block leading-normal">Require dual mobile biometric check signatures alongside system passwords.</span>
          </div>

          <button
            type="button"
            onClick={onMfaToggle}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors relative cursor-pointer ${
              mfaEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
              mfaEnabled ? 'translate-x-5.5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Informational settings */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono italic">
        <span>STATION CODE: MUSTALI-SEC-NODE-12</span>
        <span>REVISION: Stable.2026.17</span>
      </div>

    </div>
  );
}
