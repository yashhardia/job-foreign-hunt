/**
 * Apify API Service Integration
 * Connects with Apify Actors (LinkedIn Jobs, Indeed, Google Jobs) or custom task runs
 */

export async function fetchApifyJobs(apiToken, query = 'Software Engineer', country = 'Germany') {
  if (!apiToken) {
    throw new Error('Apify API Token is missing. Please enter your Apify API Token in Settings.');
  }

  try {
    // Calling Apify LinkedIn Jobs Scraper Actor (hMvNspw3Pj5b9tF93 or standard task/run-sync)
    // We call the run-sync-get-dataset-items endpoint for instant dataset response
    const actorId = 'hMvNspw3Pj5b9tF93'; // Popular public LinkedIn jobs scraper on Apify
    const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}`;

    const inputPayload = {
      title: query,
      location: country !== 'Global' ? country : 'Worldwide',
      rows: 10,
      workType: ["REMOTE", "HYBRID"],
      publishedAt: "r604800" // last week
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Apify API Error (${response.status}): ${errorText.slice(0, 150)}`);
    }

    const items = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    return items.map((item, idx) => {
      const title = item.title || item.jobTitle || `${query} Role`;
      const company = item.companyName || item.company || 'International Tech Employer';
      const location = item.location || country;
      const url = item.link || item.jobUrl || item.url || 'https://linkedin.com';
      const desc = item.description || item.descriptionText || 'Scraped via Apify Actor.';

      const containsVisa = /visa|sponsorship|relocation|blue card/i.test(desc + ' ' + title);

      return {
        id: `apify-${Date.now()}-${idx}`,
        title,
        company,
        location,
        country: country !== 'Global' ? country : 'Europe/US',
        remoteType: /remote/i.test(location + ' ' + desc) ? 'Remote' : 'Hybrid',
        visaSponsored: containsVisa,
        relocationPackage: containsVisa,
        salary: item.salary || 'Market Rate (Check posting)',
        minSalaryNum: 80000,
        currency: 'USD',
        postedDate: item.postedAt || 'Recently scraped',
        source: 'Apify Actor (LinkedIn/Indeed)',
        applyUrl: url,
        description: desc.slice(0, 1500),
        skillsRequired: extractSkills(desc),
        experienceMinYears: 3
      };
    });

  } catch (err) {
    console.error('Apify Fetch Error:', err);
    throw err;
  }
}

function extractSkills(text) {
  const commonTech = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'Go', 'AWS',
    'Docker', 'Kubernetes', 'PostgreSQL', 'GraphQL', 'Tailwind',
    'Next.js', 'Microservices', 'Terraform'
  ];
  const textLower = (text || '').toLowerCase();
  return commonTech.filter(s => textLower.includes(s.toLowerCase()));
}
