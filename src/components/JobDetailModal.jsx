import React, { useState } from 'react';
import { calculateMatchScore } from '../services/matchEngine';
import { X, ExternalLink, Building2, MapPin, DollarSign, Globe2, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, FileText, Bookmark, Send } from 'lucide-react';

export default function JobDetailModal({ job, profile, onClose, trackerStatus, onUpdateTrackerStatus }) {
  if (!job) return null;

  const matchInfo = calculateMatchScore(profile, job);
  const { score, tier, tierLabel, actionText, badgeColor, breakdown, matchingSkills, missingSkills, verdict } = matchInfo;
  
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`notes_${job.id}`);
    return saved || '';
  });

  const handleSaveNotes = (val) => {
    setNotes(val);
    localStorage.setItem(`notes_${job.id}`, val);
  };

  const handleDirectApply = () => {
    if (job.applyUrl && job.applyUrl !== '#') {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
      if (!trackerStatus) {
        onUpdateTrackerStatus(job.id, 'Applied');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-slate-100 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="pr-8">
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
            <span>•</span>
            <span>{job.source}</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white">{job.title}</h2>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-medium">
            <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{job.location}</span>
            </div>

            {job.visaSponsored && (
              <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Visa Sponsored</span>
              </div>
            )}

            {job.relocationPackage && (
              <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-700">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Relocation Provided</span>
              </div>
            )}

            <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 text-cyan-300 font-mono">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{job.salary}</span>
            </div>
          </div>
        </div>

        {/* SCORE SUMMARY BANNER */}
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
          tier === 'IMMEDIATE'
            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100'
            : tier === 'APPLY'
            ? 'bg-blue-950/50 border-blue-500/50 text-blue-100'
            : tier === 'CONSIDER'
            ? 'bg-amber-950/50 border-amber-500/50 text-amber-100'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-black/40 border border-current">
                {tierLabel}
              </span>
              <span className="text-xl font-black">{score}% Match Score</span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed mt-1">{verdict}</p>
          </div>

          <button
            onClick={handleDirectApply}
            className="w-full md:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-xl transition-all"
          >
            <span>{actionText}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Skill Alignment</p>
            <p className="text-lg font-bold text-cyan-400">{breakdown.skillScore}%</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Visa / Relocation</p>
            <p className="text-lg font-bold text-emerald-400">{breakdown.visaScore}%</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Experience Fit</p>
            <p className="text-lg font-bold text-indigo-400">{breakdown.expScore}%</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Location Match</p>
            <p className="text-lg font-bold text-purple-400">{breakdown.locationScore}%</p>
          </div>
        </div>

        {/* Skills Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Matched Required Skills ({matchingSkills.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.length > 0 ? (
                matchingSkills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No exact skill overlap detected</span>
              )}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Missing / Secondary Skills ({missingSkills.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.length > 0 ? (
                missingSkills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-mono">
                    ✕ {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">You match all core required skills!</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Job Description & Requirements</span>
          </h4>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
            {job.description}
          </div>
        </div>

        {/* Pipeline Tracker Status Switcher */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Application Pipeline Status</span>
            <span className="text-xs text-cyan-400 font-bold">{trackerStatus || 'Not Saved'}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Saved', 'Applied', 'Interviewing', 'Offer', 'Archived'].map((status) => (
              <button
                key={status}
                onClick={() => onUpdateTrackerStatus(job.id, trackerStatus === status ? null : status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  trackerStatus === status
                    ? 'bg-cyan-600 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Notes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Tailored Resume / Application Notes</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => handleSaveNotes(e.target.value)}
              placeholder="e.g. Tailored resume submitted on Greenhouse, contact HR manager..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Close
          </button>
          <button
            onClick={handleDirectApply}
            className="px-6 py-2.5 rounded-xl text-xs font-black bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg flex items-center space-x-2"
          >
            <span>Open Application Link</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
