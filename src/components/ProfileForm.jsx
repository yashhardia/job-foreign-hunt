import React, { useState } from 'react';
import { User, Code, Briefcase, Globe, DollarSign, Sparkles, CheckCircle2, Plus, X, ShieldAlert } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes',
  'PostgreSQL', 'Go', 'GraphQL', 'Next.js', 'Tailwind CSS', 'Microservices',
  'Java', 'C#', 'PyTorch', 'FastAPI', 'Redis', 'CI/CD', 'Terraform'
];

const SUGGESTED_COUNTRIES = [
  'Germany', 'Netherlands', 'UK', 'Canada', 'Japan', 'USA', 'Remote Worldwide', 'Australia', 'Sweden', 'Switzerland'
];

export default function ProfileForm({ profile, onSaveProfile }) {
  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Senior Full Stack Engineer');
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears || '5');
  const [skills, setSkills] = useState(profile.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']);
  const [newSkill, setNewSkill] = useState('');
  const [requiresVisa, setRequiresVisa] = useState(profile.requiresVisa !== undefined ? profile.requiresVisa : true);
  const [requiresRelocation, setRequiresRelocation] = useState(profile.requiresRelocation !== undefined ? profile.requiresRelocation : true);
  const [preferredCountries, setPreferredCountries] = useState(profile.preferredCountries || ['Germany', 'Netherlands', 'Remote Worldwide']);
  const [minSalary, setMinSalary] = useState(profile.minSalary || '80000');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || newSkill).trim();
    if (val && !skills.some(s => s.toLowerCase() === val.toLowerCase())) {
      setSkills([...skills, val]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const toggleCountry = (country) => {
    if (preferredCountries.includes(country)) {
      setPreferredCountries(preferredCountries.filter(c => c !== country));
    } else {
      setPreferredCountries([...preferredCountries, country]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      targetRole,
      experienceYears: parseInt(experienceYears, 10) || 0,
      skills,
      requiresVisa,
      requiresRelocation,
      preferredCountries,
      minSalary: parseInt(minSalary, 10) || 0
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Matching Engine Intelligence</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Your Foreign Candidate Profile</h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure your technical skills, visa requirements, and foreign preferences to get precise 90%+ match scoring.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-sm font-bold px-4 py-2 rounded-xl animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info & Target Role */}
        <div className="glass-card p-6 rounded-2xl space-y-5">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>Target Role & Experience</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Job Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Developer"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Years of Relevant Experience</label>
              <input
                type="number"
                min="0"
                max="30"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Skills Management */}
        <div className="glass-card p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Code className="w-5 h-5 text-indigo-400" />
              <span>Technical Skills & Stack</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">{skills.length} skills listed</span>
          </div>

          {/* Add skill input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }}}
              placeholder="Add skill (e.g. Docker, Rust, PyTorch)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-sm flex items-center space-x-1 border border-slate-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Active skills pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-cyan-200 text-sm font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 text-cyan-500 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Suggested skills */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-400 mb-2">Quick Add Suggestions:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 10).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visa & Relocation Preferences */}
        <div className="glass-card p-6 rounded-2xl space-y-5">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-emerald-400" />
            <span>Visa, Relocation & Foreign Target Regions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Visa requirement */}
            <div className={`p-4 rounded-xl border transition-all cursor-pointer ${
              requiresVisa ? 'bg-indigo-950/40 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`} onClick={() => setRequiresVisa(!requiresVisa)}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Require Visa Sponsorship?</span>
                <input
                  type="checkbox"
                  checked={requiresVisa}
                  onChange={(e) => setRequiresVisa(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 rounded focus:ring-0"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {requiresVisa ? 'Matching engine prioritizes employers offering EU Blue Card, H1B/O1, Tier 2 Sponsorship.' : 'I already have work authorization in target countries.'}
              </p>
            </div>

            {/* Relocation requirement */}
            <div className={`p-4 rounded-xl border transition-all cursor-pointer ${
              requiresRelocation ? 'bg-indigo-950/40 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`} onClick={() => setRequiresRelocation(!requiresRelocation)}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Open to International Relocation?</span>
                <input
                  type="checkbox"
                  checked={requiresRelocation}
                  onChange={(e) => setRequiresRelocation(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 rounded focus:ring-0"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {requiresRelocation ? 'Willing to relocate physically to Europe, UK, North America, Japan, etc.' : 'Prefer 100% Remote positions globally.'}
              </p>
            </div>

          </div>

          {/* Preferred Countries selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Target Foreign Countries/Regions</label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_COUNTRIES.map((country) => {
                const isSelected = preferredCountries.includes(country);
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => toggleCountry(country)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {country} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salary threshold */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Minimum Target Salary (USD Equivalent / year)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500 font-bold">$</span>
              <input
                type="number"
                step="5000"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="80000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Save Profile & Update Match Scoring</span>
          </button>
        </div>

      </form>
    </div>
  );
}
