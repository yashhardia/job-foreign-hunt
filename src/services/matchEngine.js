/**
 * Match Engine for scoring job candidate profile fit
 */

export function calculateMatchScore(profile, job) {
  if (!profile || !job) {
    return {
      score: 50,
      tier: 'LOW',
      tierLabel: 'Low Match 🔍',
      actionText: 'Explore',
      badgeColor: 'slate',
      breakdown: { skillScore: 50, visaScore: 50, expScore: 50, locationScore: 50 },
      matchingSkills: [],
      missingSkills: [],
      verdict: 'Incomplete data for scoring'
    };
  }

  // 1. SKILLS MATCHING (45% weight)
  const candidateSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
  const jobSkillsRequired = (job.skillsRequired || []);
  
  // Extract keywords from job description if skills array is short
  let allTargetSkills = [...jobSkillsRequired];
  if (allTargetSkills.length === 0 && job.description) {
    const commonTech = ['react', 'node.js', 'python', 'javascript', 'typescript', 'aws', 'docker', 'kubernetes', 'java', 'go', 'golang', 'c#', 'sql', 'postgresql', 'mongodb', 'graphql', 'rest', 'tailwind', 'vue.js', 'next.js', 'microservices', 'git', 'ci/cd', 'terraform'];
    const descLower = job.description.toLowerCase();
    commonTech.forEach(tech => {
      if (descLower.includes(tech)) {
        allTargetSkills.push(tech);
      }
    });
  }

  let matchedSkills = [];
  let missingSkills = [];

  allTargetSkills.forEach(reqSkill => {
    const reqLower = reqSkill.toLowerCase();
    const isMatched = candidateSkills.some(userSkill => 
      userSkill === reqLower || reqLower.includes(userSkill) || userSkill.includes(reqLower)
    );
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  let skillScore = 70; // baseline if no specific skills listed
  if (allTargetSkills.length > 0) {
    const rawRatio = matchedSkills.length / allTargetSkills.length;
    skillScore = Math.min(100, Math.round(rawRatio * 100));
  } else {
    // Check keyword search match in title/description
    let matchCount = 0;
    const fullText = `${job.title} ${job.description}`.toLowerCase();
    candidateSkills.forEach(skill => {
      if (fullText.includes(skill)) matchCount++;
    });
    if (candidateSkills.length > 0) {
      skillScore = Math.min(100, Math.round((matchCount / Math.max(1, candidateSkills.length)) * 100));
    }
  }

  // 2. VISA & RELOCATION FIT (25% weight)
  let visaScore = 100;
  if (profile.requiresVisa) {
    if (job.visaSponsored || job.relocationPackage) {
      visaScore = 100;
    } else if (job.country === 'Remote' || job.remoteType === 'Remote') {
      visaScore = 95; // Remote doesn't require physical relocation visa
    } else {
      visaScore = 20; // Critical mismatch if visa is required but job offers none
    }
  }

  // 3. EXPERIENCE MATCH (15% weight)
  const candidateExp = parseInt(profile.experienceYears || '0', 10);
  const minRequiredExp = parseInt(job.experienceMinYears || '2', 10);
  let expScore = 100;
  if (candidateExp >= minRequiredExp) {
    expScore = 100;
  } else if (candidateExp === minRequiredExp - 1) {
    expScore = 80;
  } else if (candidateExp === minRequiredExp - 2) {
    expScore = 60;
  } else {
    expScore = 40;
  }

  // 4. LOCATION PREFERENCE MATCH (15% weight)
  const preferredCountries = (profile.preferredCountries || []).map(c => c.toLowerCase().trim());
  let locationScore = 75;
  if (preferredCountries.length === 0 || preferredCountries.includes('anywhere') || preferredCountries.includes('all')) {
    locationScore = 100;
  } else {
    const jobCountryLower = (job.country || '').toLowerCase();
    const isPreferred = preferredCountries.some(pc => pc === jobCountryLower || jobCountryLower.includes(pc) || pc.includes(jobCountryLower));
    if (isPreferred || jobCountryLower === 'remote') {
      locationScore = 100;
    } else {
      locationScore = 55;
    }
  }

  // CALCULATE OVERALL WEIGHTED SCORE
  const weightedScore = Math.round(
    (skillScore * 0.45) +
    (visaScore * 0.25) +
    (expScore * 0.15) +
    (locationScore * 0.15)
  );

  // CLASSIFICATION AS SPECIFIED IN USER REQUIREMENTS:
  // 90-100%: Apply Immediately
  // 80-89%: Apply
  // 70-79%: Consider
  // <70%: Low Match
  let tier = 'LOW';
  let tierLabel = 'Low Match 🔍';
  let actionText = 'Consider Carefully';
  let badgeColor = 'slate';
  let verdict = 'Moderate match. Review missing skills before applying.';

  if (weightedScore >= 90) {
    tier = 'IMMEDIATE';
    tierLabel = 'Apply Immediately 🔥';
    actionText = 'Apply Immediately 🚀';
    badgeColor = 'emerald';
    verdict = 'Outstanding match! Your profile aligns closely with the role and visa/relocation requirements. Apply right away!';
  } else if (weightedScore >= 80) {
    tier = 'APPLY';
    tierLabel = 'Apply 👍';
    actionText = 'Apply Now 👍';
    badgeColor = 'blue';
    verdict = 'Strong fit for your skills and career preferences. High probability of getting noticed.';
  } else if (weightedScore >= 70) {
    tier = 'CONSIDER';
    tierLabel = 'Consider 💡';
    actionText = 'Consider Applying 💡';
    badgeColor = 'amber';
    verdict = 'Good potential match. You meet core requirements, though some secondary skills or visa factors should be reviewed.';
  } else {
    tier = 'LOW';
    tierLabel = 'Low Match 🔍';
    actionText = 'View Job Link';
    badgeColor = 'slate';
    verdict = 'Lower alignment with your listed profile. Check missing requirements below.';
  }

  return {
    score: weightedScore,
    tier,
    tierLabel,
    actionText,
    badgeColor,
    breakdown: {
      skillScore,
      visaScore,
      expScore,
      locationScore
    },
    matchingSkills: Array.from(new Set(matchedSkills)),
    missingSkills: Array.from(new Set(missingSkills)),
    verdict
  };
}
