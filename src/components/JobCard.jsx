import React from 'react';
import { calculateMatchScore } from '../services/matchEngine';
import { ExternalLink, Flame, CheckCircle, AlertCircle, Building2, MapPin, DollarSign, Globe2, ShieldCheck, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';

export default function JobCard({ job, profile, onSelectJob, trackerStatus, onUpdateTrackerStatus }) {
  const matchInfo = calculateMatchScore(profile, job);
  const { score, tier, tierLabel, actionText, badgeColor, breakdown, matchingSkills, missingSkills, verdict } = matchInfo;

  // Determine badge styling according to specifications:
  // 90-100%: Apply immediately
  // 80-89%: Apply
  // 70-79%: Consider
  let tierBadgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
  let cardBorder = 'border-slate-800 hover:border-slate-700';

  if (tier === 'IMMEDIATE') {
    tierBadgeStyle = 'bg-emerald-950/90 text-emerald-300 border-emerald-500 badge-glow-green animate-pulse';
    cardBorder = 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/10';
  } else if (tier === 'APPLY') {
    tierBadgeStyle = 'bg-blue-950/90 text-blue-300 border-blue-500 badge-glow-blue';
    cardBorder = 'border-blue-500/30 hover:border-blue-400 bg-blue-950/10';
  } else if (tier === 'CONSIDER') {
    tierBadgeStyle = 'bg-amber-950/90 text-amber-300 border-amber-500 badge-glow-amber';
    cardBorder = 'border-amber-500/30 hover:border-amber-400 bg-amber-950/10';
  }

  const handleDirectApply = (e) => {
    e.stopPropagation();
    if (job.applyUrl && job.applyUrl !== '#') {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Opening application portal for ${job.company}`);
    }
  };

  const isSaved = trackerStatus === 'Saved' || trackerStatus === 'Applied' || trackerStatus === 'Interviewing';

  return (
    <div 
      onClick={() => onSelectJob(job)}
      className={`glass-card rounded-2xl p-6 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${cardBorder}`}
    >
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            
            {/* Company & Source */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{job.company}</span>
              <span>•</span>
              <span className="text-slate-500">{job.source}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
              {job.title}
            </h3>
          </div>

          {/* MATCH RATING BADGE */}
          <div className="flex flex-col items-end shrink-0">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border flex items-center space-x-1.5 shadow-md ${tierBadgeStyle}`}>
              <span>{tierLabel}</span>
              <span className="text-sm font-black px-1.5 py-0.5 rounded bg-black/40 font-mono">
                {score}%
              </span>
            </div>
          </div>
        </div>

        {/* Job Attributes Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{job.location}</span>
          </div>

          {job.visaSponsored && (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visa Sponsorship</span>
            </div>
          )}

          {job.relocationPackage && (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Relocation Support</span>
            </div>
          )}

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-mono">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>{job.salary}</span>
          </div>
        </div>

        {/* Verdict Summary */}
        <div className="bg-slate-950/70 rounded-xl p-3 mb-4 border border-slate-800/80 text-xs text-slate-300">
          <p className="font-semibold text-slate-200 mb-1 flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Match Verdict:</span>
          </p>
          <p className="text-slate-400 leading-relaxed">{verdict}</p>
        </div>

        {/* Skills Match Breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Skill Alignment ({breakdown.skillScore}%)</span>
            <span className="text-slate-300 font-semibold">{matchingSkills.length} matched / {missingSkills.length} missing</span>
          </div>
          
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                score >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                score >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                score >= 70 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-slate-600'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Matched skills badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchingSkills.slice(0, 5).map(skill => (
              <span key={skill} className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono">
                ✓ {skill}
              </span>
            ))}
            {missingSkills.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-900/40 text-rose-300 text-[11px] font-mono">
                ✕ {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        
        {/* Save to tracker button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateTrackerStatus(job.id, isSaved ? null : 'Saved');
          }}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
            isSaved
              ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4 text-indigo-400" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
          <span>{isSaved ? (trackerStatus || 'Saved') : 'Save'}</span>
        </button>

        {/* DIRECT APPLY REDIRECT BUTTON */}
        <button
          onClick={handleDirectApply}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-extrabold text-xs tracking-wide transition-all shadow-lg ${
            tier === 'IMMEDIATE'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25 animate-pulse'
              : tier === 'APPLY'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/25'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <span>{actionText}</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </button>

      </div>

    </div>
  );
}
