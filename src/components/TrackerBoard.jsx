import React, { useState } from 'react';
import { calculateMatchScore } from '../services/matchEngine';
import { BookmarkCheck, ExternalLink, Download, Trash2, Building2, MapPin, CheckCircle2, Send, MessageSquare, Award, Archive } from 'lucide-react';

const STATUS_COLUMNS = [
  { id: 'Saved', title: 'Saved / Considering', icon: BookmarkCheck, color: 'text-blue-400' },
  { id: 'Applied', title: 'Applied 📩', icon: Send, color: 'text-indigo-400' },
  { id: 'Interviewing', title: 'Interviewing 🗣️', icon: MessageSquare, color: 'text-amber-400' },
  { id: 'Offer', title: 'Offer Received 🎉', icon: Award, color: 'text-emerald-400' },
  { id: 'Archived', title: 'Archived 📁', icon: Archive, color: 'text-slate-400' }
];

export default function TrackerBoard({ trackerMap, allJobs, profile, onSelectJob, onUpdateTrackerStatus }) {
  const [selectedColumn, setSelectedColumn] = useState('ALL');

  // Filter tracked jobs
  const trackedJobs = allJobs.filter(job => trackerMap[job.id]);

  const countByStatus = (status) => {
    return trackedJobs.filter(job => trackerMap[job.id] === status).length;
  };

  const handleExportCSV = () => {
    if (trackedJobs.length === 0) {
      alert('No tracked jobs to export!');
      return;
    }

    const headers = ['Title', 'Company', 'Location', 'Country', 'Status', 'MatchScore', 'ApplyURL'];
    const rows = trackedJobs.map(j => {
      const match = calculateMatchScore(profile, j);
      return [
        `"${j.title.replace(/"/g, '""')}"`,
        `"${j.company.replace(/"/g, '""')}"`,
        `"${j.location.replace(/"/g, '""')}"`,
        `"${j.country}"`,
        `"${trackerMap[j.id]}"`,
        `"${match.score}%"`,
        `"${j.applyUrl}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foreign_job_hunt_tracker_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <BookmarkCheck className="w-6 h-6 text-cyan-400" />
            <span>Foreign Application Pipeline</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track your target overseas applications, interview stages, and offers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 font-bold text-xs flex items-center space-x-2 transition-all shadow-md shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Tracker CSV</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUS_COLUMNS.map(col => {
          const count = countByStatus(col.id);
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              onClick={() => setSelectedColumn(selectedColumn === col.id ? 'ALL' : col.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedColumn === col.id
                  ? 'bg-slate-800 border-cyan-500 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${col.color}`} />
                <span className="text-xs font-bold text-slate-400">{count}</span>
              </div>
              <p className="text-xs font-semibold text-slate-300 mt-2 truncate">{col.title}</p>
            </div>
          );
        })}
      </div>

      {/* Main Tracked Jobs List */}
      {trackedJobs.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Saved Applications Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the "Save" button on any job listing in the Search tab to build your custom application pipeline.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trackedJobs
            .filter(j => selectedColumn === 'ALL' || trackerMap[j.id] === selectedColumn)
            .map(job => {
              const status = trackerMap[job.id];
              const match = calculateMatchScore(profile, job);

              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="glass-card p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{job.company}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{job.location}</span>
                    </div>

                    <h4 className="text-base font-extrabold text-white">{job.title}</h4>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    
                    {/* Match rating badge */}
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-900 border border-slate-700 text-cyan-300 font-mono">
                      {match.score}% Fit
                    </span>

                    {/* Status Dropdown */}
                    <select
                      value={status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateTrackerStatus(job.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Saved">Saved</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer Received</option>
                      <option value="Archived">Archived</option>
                    </select>

                    {/* Direct Apply Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                      title="Open Application Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateTrackerStatus(job.id, null);
                      }}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
        </div>
      )}

    </div>
  );
}
