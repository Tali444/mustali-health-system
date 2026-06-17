import React, { useState } from 'react';
import { Language, TenantFacility, PublicAnnouncement, FeedbackItem } from '../types';
import { Megaphone, Search, Star, MessageSquarePlus, Clock, Heart, Users } from 'lucide-react';

interface CommunityPortalProps {
  currentLanguage: Language;
  facilities: TenantFacility[];
  announcements: PublicAnnouncement[];
  feedbacks: FeedbackItem[];
  addFeedback: (fb: FeedbackItem) => void;
  isOffline: boolean;
}

export default function CommunityPortal({
  currentLanguage,
  facilities,
  announcements,
  feedbacks,
  addFeedback,
  isOffline
}: CommunityPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]?.id || 'F-101');
  
  // Form states
  const [citizenName, setCitizenName] = useState('');
  const [contact, setContact] = useState('');
  const [feedbackType, setFeedbackType] = useState<'Complaint' | 'Suggestion'>('Suggestion');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState(5);
  const [formSuccess, setFormSuccess] = useState('');

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.woreda.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName || !subject || !details) {
      alert('Please fill out all required fields.');
      return;
    }

    const fac = facilities.find(f => f.id === selectedFacility) || facilities[0];

    const newFb: FeedbackItem = {
      id: `FEB-${Date.now()}`,
      facilityId: fac.id,
      facilityName: fac.name,
      citizenName,
      citizenContact: contact || 'Anonymous',
      type: feedbackType,
      subject,
      details,
      rating,
      status: 'Submitted',
      feedbackStatusLog: [
        {
          date: new Date().toISOString().split('T')[0],
          status: 'Submitted',
          comment: 'Citizen feedback filed on system registry.'
        }
      ],
      createdAt: new Date().toISOString()
    };

    addFeedback(newFb);
    setFormSuccess('Feedback successfully submitted. Thank you for your review!');
    
    // Clear
    setCitizenName('');
    setContact('');
    setSubject('');
    setDetails('');
    setRating(5);
    
    setTimeout(() => setFormSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Announcements Board */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
        
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
            <Megaphone className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-wider uppercase">
              {currentLanguage === 'en' ? 'Ministry & Regional Announcements' : 'Beeksisa Fayyaa Statasii'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {currentLanguage === 'en' ? 'Live public health notifications, vaccine campaigns, and outbreaks.' : 'Faayidaalee fi gorsa dhibee daddarbaa beeksisuu.'}
            </p>
          </div>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs italic">
            Currently no active alerts or outbreaks logged.
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 relative">
                <div className="absolute top-4 right-4 text-[9px] font-mono font-semibold bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-900">
                  {ann.type.toUpperCase()}
                </div>
                
                <h4 className="text-xs font-bold text-white pr-16">
                  {currentLanguage === 'en' ? ann.titleEn : ann.titleOm}
                </h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {currentLanguage === 'en' ? ann.detailsEn : ann.detailsOm}
                </p>
                <div className="mt-3.5 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Author Node: {ann.facilityName}</span>
                  <span>Logged Date: {ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Facilities Search & Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Live Facilities Directory */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                {currentLanguage === 'en' ? 'Health Facilities Status' : 'Ilaalcha Statasii Buufataalee'}
              </h4>
              <p className="text-[11px] text-indigo-200">Wait-time transparency list</p>
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search facility name or woreda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredFacilities.map(fac => (
              <div key={fac.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-blue-400 transition">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 block">CODE: {fac.code}</span>
                  <h5 className="text-xs font-bold text-slate-900">{fac.name}</h5>
                  <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Type: {fac.type}</span>
                    <span>Zone: {fac.zone}</span>
                    <span>Woreda: {fac.woreda}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="bg-white border rounded-lg px-2.5 py-1.5 text-center shadow-2xs">
                    <span className="block text-[8px] text-slate-400 uppercase font-mono">Waiting List</span>
                    <span className="text-xs font-extrabold text-slate-800">{fac.patientsWaiting} patients</span>
                  </div>
                  <div className="bg-white border rounded-lg px-2.5 py-1.5 text-center shadow-2xs">
                    <span className="block text-[8px] text-slate-400 uppercase font-mono">Est Duration</span>
                    <span className="text-xs font-extrabold text-blue-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {fac.estimatedWaitMinutes}m
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Citizens Complaint & Feedback Desk */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="text-blue-600 w-5 h-5" />
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest">Citizen Feedback</h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Submit suggestions or complain on service delivery.</p>
          </div>

          {formSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center text-xs text-emerald-800 font-medium">
              {formSuccess}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Guest Citizen"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-xl text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1">Contact Email/Phone</label>
                  <input
                    type="text"
                    placeholder="+251 9..."
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-xl text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1">Feedback Nature</label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2 py-2 rounded-xl text-slate-800 focus:outline-none"
                  >
                    <option value="Suggestion">💡 Suggestion</option>
                    <option value="Complaint">⚠️ Complaint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1">Choose Facility</label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2 py-2 rounded-xl text-slate-800 focus:outline-none"
                  >
                    {facilities.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1">Subject Heading *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pharmacy wait times long"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1">Rating Experience</label>
                <div className="flex gap-1.5 items-center mt-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRating(val)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-5 h-5 transition ${val <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-250 hover:text-amber-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1">Details & Testimony *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Elaborate on what transpired, mentioning timestamps or staff desk keys if necessary."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-xl text-slate-800 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition"
              >
                Send Citizen Report →
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Citizen Feedback Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-4">Latest Public Citizen Testimonies</h4>
        {feedbacks.length === 0 ? (
          <div className="text-center py-4 text-slate-400 text-xs italic">
            No active feedback logged on system ledger files.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map(f => (
              <div key={f.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Log Code: {f.id}</span>
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${
                      f.type === 'Complaint' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {f.type}
                    </span>
                  </div>
                  <h5 className="text-xs font-extrabold text-slate-800 mt-1">{f.subject}</h5>
                  <p className="text-[11px] text-slate-505 mt-1 sm:line-clamp-2">{f.details}</p>
                </div>
                <div className="mt-3.5 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <span className="font-semibold">Concerned: {f.facilityName}</span>
                  <span className="font-mono">{f.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
