import React from 'react';
import { Globe, Key, UserCheck, Search, Link2, BookmarkCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenApiSettings, apiKeys, profile }) {
  const hasFirecrawlKey = Boolean(apiKeys.firecrawlKey);
  const hasApifyToken = Boolean(apiKeys.apifyToken);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Globe className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">GlobalHunt</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Foreign Job Match & Scorer</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Job Search & Match</span>
            </button>

            <button
              onClick={() => setActiveTab('scrape')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'scrape'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Scrape URL</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Application Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Profile & Skills</span>
              {(!profile.skills || profile.skills.length === 0) && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>
          </nav>

          {/* Right side - API status & Key config */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenApiSettings}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                hasFirecrawlKey || hasApifyToken
                  ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-slate-800'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-current" />
              <span>
                {hasFirecrawlKey && hasApifyToken
                  ? 'Firecrawl & Apify Connected'
                  : hasFirecrawlKey
                  ? 'Firecrawl Active'
                  : hasApifyToken
                  ? 'Apify Active'
                  : 'Pass API Keys (Demo Mode)'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-slate-950 px-2 text-xs">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'search' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>Search</span>
        </button>
        <button
          onClick={() => setActiveTab('scrape')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'scrape' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Link2 className="w-4 h-4 mb-0.5" />
          <span>Scrape</span>
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'tracker' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <BookmarkCheck className="w-4 h-4 mb-0.5" />
          <span>Tracker</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'profile' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <UserCheck className="w-4 h-4 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
}
