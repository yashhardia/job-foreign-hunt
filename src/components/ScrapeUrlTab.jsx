import React, { useState } from 'react';
import { scrapeJobUrlWithFirecrawl } from '../services/firecrawlService';
import JobCard from './JobCard';
import { Link2, Flame, Sparkles, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ScrapeUrlTab({ apiKeys, profile, onSelectJob, trackerMap, onUpdateTrackerStatus }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [scrapedJob, setScrapedJob] = useState(null);

  const handleScrapeUrl = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setScrapedJob(null);

    try {
      if (apiKeys.firecrawlKey) {
        const job = await scrapeJobUrlWithFirecrawl(apiKeys.firecrawlKey, targetUrl.trim());
        setScrapedJob(job);
      } else {
        // Fallback simulation when key is missing so user can see it works
        await new Promise(res => setTimeout(res, 1200));
        const urlLower = targetUrl.toLowerCase();
        const isGermany = urlLower.includes('berlin') || urlLower.includes('germany') || urlLower.includes('.de');
        
        const mockScraped = {
          id: `scraped-${Date.now()}`,
          title: 'Senior Software Engineer (Extracted Posting)',
          company: 'Foreign Enterprise / Target URL',
          location: isGermany ? 'Berlin, Germany (Hybrid)' : 'International / Remote',
          country: isGermany ? 'Germany' : 'Europe/Worldwide',
          remoteType: 'Hybrid',
          visaSponsored: true,
          relocationPackage: true,
          salary: '€85,000 - €100,000 / year (Visa Included)',
          source: 'Firecrawl URL Scraper (Demo)',
          applyUrl: targetUrl.trim(),
          description: `Extracted from URL: ${targetUrl.trim()}\n\nRequirements:\n- Senior engineering experience in React, TypeScript, Node.js, AWS\n- Visa sponsorship and relocation support provided for qualified international candidates\n- Fluent in English`,
          skillsRequired: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
          experienceMinYears: 4
        };
        setScrapedJob(mockScraped);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to scrape job posting URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Instant URL Scraper & Match Evaluator</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">Scrape Any Foreign Job Link</h2>
        <p className="text-sm text-slate-400 mt-1">
          Paste a direct link to any foreign job posting (LinkedIn, Greenhouse, Lever, Workday, company career page). We'll extract requirements and score it against your profile.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <form onSubmit={handleScrapeUrl} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center space-x-2">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>Foreign Job Posting URL</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/... or https://boards.greenhouse.io/..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scrape & Score Fit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!apiKeys.firecrawlKey && (
            <p className="text-xs text-amber-400 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Firecrawl key not set — running in Demo extraction mode. Add key in settings for live web scraping.</span>
            </p>
          )}
        </form>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-300 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Scraped Result Card */}
      {scrapedJob && (
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Scraped Job & Candidate Match Result</span>
          </h3>

          <JobCard
            job={scrapedJob}
            profile={profile}
            onSelectJob={onSelectJob}
            trackerStatus={trackerMap[scrapedJob.id]}
            onUpdateTrackerStatus={onUpdateTrackerStatus}
          />
        </div>
      )}

    </div>
  );
}
