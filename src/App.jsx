import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ApiKeyModal from './components/ApiKeyModal';
import ProfileForm from './components/ProfileForm';
import JobCard from './components/JobCard';
import JobDetailModal from './components/JobDetailModal';
import ScrapeUrlTab from './components/ScrapeUrlTab';
import TrackerBoard from './components/TrackerBoard';

import { INITIAL_MOCK_JOBS } from './services/mockJobs';
import { calculateMatchScore } from './services/matchEngine';
import { searchFirecrawlJobs } from './services/firecrawlService';
import { fetchApifyJobs } from './services/apifyService';

import { Search, Filter, Sparkles, Flame, Cpu, Globe, SlidersHorizontal, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

const COUNTRY_OPTIONS = ['All Countries', 'Germany', 'Netherlands', 'UK', 'Canada', 'Japan', 'Remote', 'USA', 'Sweden'];

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  // Persistent API Keys
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem('globalhunt_api_keys');
    return saved ? JSON.parse(saved) : { firecrawlKey: '', apifyToken: '' };
  });

  // Persistent Profile
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('globalhunt_candidate_profile');
    return saved ? JSON.parse(saved) : {
      targetRole: 'Senior Full Stack Engineer',
      experienceYears: 5,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      requiresVisa: true,
      requiresRelocation: true,
      preferredCountries: ['Germany', 'Netherlands', 'Remote Worldwide'],
      minSalary: 80000
    };
  });

  // Jobs List & Search state
  const [jobs, setJobs] = useState(INITIAL_MOCK_JOBS);
  const [searchQuery, setSearchQuery] = useState('Senior Full Stack Engineer');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [minTierFilter, setMinTierFilter] = useState('ALL'); // ALL, 90 (Apply Immediately), 80 (Apply), 70 (Consider)
  const [visaOnlyFilter, setVisaOnlyFilter] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState(null);

  // Application Tracker Map { jobId: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' }
  const [trackerMap, setTrackerMap] = useState(() => {
    const saved = localStorage.getItem('globalhunt_tracker_map');
    return saved ? JSON.parse(saved) : { 'job-1': 'Saved', 'job-2': 'Applied' };
  });

  const handleSaveKeys = (keys) => {
    setApiKeys(keys);
    localStorage.setItem('globalhunt_api_keys', JSON.stringify(keys));
  };

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('globalhunt_candidate_profile', JSON.stringify(newProfile));
  };

  const handleUpdateTrackerStatus = (jobId, status) => {
    const nextMap = { ...trackerMap };
    if (!status) {
      delete nextMap[jobId];
    } else {
      nextMap[jobId] = status;
    }
    setTrackerMap(nextMap);
    localStorage.setItem('globalhunt_tracker_map', JSON.stringify(nextMap));
  };

  // Perform Live Web Search using Firecrawl or Apify
  const handlePerformLiveSearch = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setSearchMessage(null);

    let newFetchedJobs = [];
    const errors = [];

    // 1. Try Firecrawl Search if key is available
    if (apiKeys.firecrawlKey) {
      try {
        const fcResults = await searchFirecrawlJobs(
          apiKeys.firecrawlKey,
          searchQuery,
          selectedCountry === 'All Countries' ? 'Global' : selectedCountry
        );
        newFetchedJobs = [...newFetchedJobs, ...fcResults];
      } catch (err) {
        errors.push(`Firecrawl: ${err.message}`);
      }
    }

    // 2. Try Apify Actor Search if token is available
    if (apiKeys.apifyToken) {
      try {
        const apifyResults = await fetchApifyJobs(
          apiKeys.apifyToken,
          searchQuery,
          selectedCountry === 'All Countries' ? 'Germany' : selectedCountry
        );
        newFetchedJobs = [...newFetchedJobs, ...apifyResults];
      } catch (err) {
        errors.push(`Apify: ${err.message}`);
      }
    }

    // If no keys present, filter local dataset and add enhanced search results
    if (!apiKeys.firecrawlKey && !apiKeys.apifyToken) {
      await new Promise(res => setTimeout(res, 800));
      setSearchMessage({
        type: 'info',
        text: 'Showing Demo dataset filtered by your query. Add your Firecrawl or Apify keys in top-right API Settings to fetch live foreign web listings!'
      });
      setIsSearching(false);
      return;
    }

    if (newFetchedJobs.length > 0) {
      // Merge with existing jobs (avoid duplicates by ID)
      const merged = [...newFetchedJobs, ...INITIAL_MOCK_JOBS];
      const uniqueJobs = Array.from(new Map(merged.map(item => [item.title + item.company, item])).values());
      setJobs(uniqueJobs);
      setSearchMessage({
        type: 'success',
        text: `Successfully fetched ${newFetchedJobs.length} live jobs via API integrations!`
      });
    } else if (errors.length > 0) {
      setSearchMessage({
        type: 'error',
        text: errors.join(' | ')
      });
    }

    setIsSearching(false);
  };

  // Filter jobs based on user controls & calculated match scores
  const filteredJobs = jobs.filter(job => {
    // 1. Query filter
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.description.toLowerCase().includes(q);
    
    // 2. Country filter
    const matchesCountry = selectedCountry === 'All Countries' || 
      job.country?.toLowerCase() === selectedCountry.toLowerCase() ||
      (selectedCountry === 'Remote' && (job.remoteType === 'Remote' || job.location.toLowerCase().includes('remote')));

    // 3. Visa filter
    const matchesVisa = !visaOnlyFilter || job.visaSponsored;

    // 4. Min Score Tier Filter
    const scoreInfo = calculateMatchScore(profile, job);
    let matchesTier = true;
    if (minTierFilter === '90') matchesTier = scoreInfo.score >= 90;
    if (minTierFilter === '80') matchesTier = scoreInfo.score >= 80;
    if (minTierFilter === '70') matchesTier = scoreInfo.score >= 70;

    return matchesQuery && matchesCountry && matchesVisa && matchesTier;
  }).sort((a, b) => {
    // Sort highest score first
    const scoreA = calculateMatchScore(profile, a).score;
    const scoreB = calculateMatchScore(profile, b).score;
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiSettings={() => setIsApiKeyModalOpen(true)}
        apiKeys={apiKeys}
        profile={profile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: SEARCH & MATCH FEED */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            
            {/* Hero Search Box */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Firecrawl & Apify Powered Match Engine</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Find & Score International Jobs for Your Profile
                  </h1>
                  <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-1">
                    Matches roles based on tech stack, visa sponsorship, relocation packages, and experience. Direct redirects to application portals.
                  </p>
                </div>

                {/* Search Bar Form */}
                <form onSubmit={handlePerformLiveSearch} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Role title or skills (e.g. Senior React Engineer, Python DevOps)..."
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSearching}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Searching Web...</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          <span>Search & Fetch Jobs</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Filter Controls Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-semibold">
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Country dropdown */}
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        {COUNTRY_OPTIONS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>

                      {/* Tier Rating Filter */}
                      <select
                        value={minTierFilter}
                        onChange={(e) => setMinTierFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="ALL">All Match Ratings</option>
                        <option value="90">90-100% (Apply Immediately 🔥)</option>
                        <option value="80">80-89% (Apply 👍)</option>
                        <option value="70">70-79% (Consider 💡)</option>
                      </select>

                      {/* Visa filter toggle */}
                      <button
                        type="button"
                        onClick={() => setVisaOnlyFilter(!visaOnlyFilter)}
                        className={`px-3 py-2 rounded-xl border transition-all flex items-center space-x-1.5 ${
                          visaOnlyFilter
                            ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Visa Sponsored Only</span>
                      </button>

                    </div>

                    <div className="text-slate-400">
                      Showing <span className="text-cyan-400 font-bold">{filteredJobs.length}</span> matching opportunities
                    </div>
                  </div>

                </form>
              </div>
            </div>

            {/* Status Message Banner */}
            {searchMessage && (
              <div className={`p-4 rounded-2xl flex items-center space-x-3 text-xs sm:text-sm font-medium ${
                searchMessage.type === 'success' ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300' :
                searchMessage.type === 'error' ? 'bg-rose-950/80 border border-rose-700 text-rose-300' : 'bg-slate-900 border border-slate-800 text-cyan-300'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchMessage.text}</span>
              </div>
            )}

            {/* Job Grid */}
            {filteredJobs.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
                <Search className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-300">No Jobs Match Your Current Filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your country selection, match rating filter, or search query term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    profile={profile}
                    onSelectJob={(j) => setSelectedJobForModal(j)}
                    trackerStatus={trackerMap[job.id]}
                    onUpdateTrackerStatus={handleUpdateTrackerStatus}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: SCRAPE URL */}
        {activeTab === 'scrape' && (
          <ScrapeUrlTab
            apiKeys={apiKeys}
            profile={profile}
            onSelectJob={(j) => setSelectedJobForModal(j)}
            trackerMap={trackerMap}
            onUpdateTrackerStatus={handleUpdateTrackerStatus}
          />
        )}

        {/* TAB 3: TRACKER BOARD */}
        {activeTab === 'tracker' && (
          <TrackerBoard
            trackerMap={trackerMap}
            allJobs={jobs}
            profile={profile}
            onSelectJob={(j) => setSelectedJobForModal(j)}
            onUpdateTrackerStatus={handleUpdateTrackerStatus}
          />
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <ProfileForm
            profile={profile}
            onSaveProfile={handleSaveProfile}
          />
        )}

      </main>

      {/* Modal Views */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKeys={apiKeys}
        onSaveKeys={handleSaveKeys}
      />

      <JobDetailModal
        job={selectedJobForModal}
        profile={profile}
        onClose={() => setSelectedJobForModal(null)}
        trackerStatus={selectedJobForModal ? trackerMap[selectedJobForModal.id] : null}
        onUpdateTrackerStatus={handleUpdateTrackerStatus}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>GlobalHunt AI — Foreign Job Hunter & Match Engine • Integrated with Firecrawl & Apify</p>
      </footer>

    </div>
  );
}
