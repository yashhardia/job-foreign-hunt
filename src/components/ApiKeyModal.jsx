import React, { useState } from 'react';
import { X, Key, CheckCircle, Flame, Cpu, ExternalLink, ShieldCheck, Info } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKeys, onSaveKeys }) {
  const [firecrawlKey, setFirecrawlKey] = useState(apiKeys.firecrawlKey || '');
  const [apifyToken, setApifyToken] = useState(apiKeys.apifyToken || '');
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKeys({
      firecrawlKey: firecrawlKey.trim(),
      apifyToken: apifyToken.trim()
    });
    setStatusMsg({ type: 'success', text: 'API Keys saved successfully!' });
    setTimeout(() => {
      setStatusMsg(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">API Integration Keys</h3>
            <p className="text-xs text-slate-400">Configure your Firecrawl & Apify keys for live web searching</p>
          </div>
        </div>

        {statusMsg && (
          <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 text-sm font-medium ${
            statusMsg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700' : 'bg-rose-950/80 text-rose-300 border border-rose-700'
          }`}>
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Firecrawl API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Firecrawl API Key</span>
              </label>
              <a
                href="https://firecrawl.dev"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="fc-xxxxxxxxxxxxxxxxxxxxxxxx"
              value={firecrawlKey}
              onChange={(e) => setFirecrawlKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
            />
            <p className="text-xs text-slate-400">
              Used for searching company career pages, web job portals, and scraping direct URLs.
            </p>
          </div>

          {/* Apify API Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Apify API Token</span>
              </label>
              <a
                href="https://apify.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="apify_api_xxxxxxxxxxxxxxxxxxxx"
              value={apifyToken}
              onChange={(e) => setApifyToken(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
            />
            <p className="text-xs text-slate-400">
              Used to trigger specialized LinkedIn, Indeed, & Glassdoor job scrapers on Apify.
            </p>
          </div>

          {/* Info banner */}
          <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200 mb-0.5">Privacy First</p>
              <p className="text-slate-400">
                Your keys are stored purely in your local browser storage (<code className="text-cyan-300">localStorage</code>) and are never sent to external servers except direct calls to Firecrawl & Apify.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
            >
              Save API Keys
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
