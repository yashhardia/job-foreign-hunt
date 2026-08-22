/**
 * Firecrawl API Service integration
 * Parses search API responses and extracts individual job items from markdown pages
 */

export function parseFirecrawlResponseJson(jsonPayload) {
  try {
    const parsed = typeof jsonPayload === 'string' ? JSON.parse(jsonPayload) : jsonPayload;
    const items = parsed.data || (Array.isArray(parsed) ? parsed : [parsed]);
    
    const extractedJobs = [];

    items.forEach((item, idx) => {
      const markdown = item.markdown || item.description || '';
      const sourceURL = item.url || item.metadata?.sourceURL || 'https://google.com';
      const pageTitle = item.title || 'Firecrawl Extracted Job';

      const lines = markdown.split('\n');
      let currentJob = null;

      lines.forEach(line => {
        const headerMatch = line.match(/^###?\s*\[([^\]]+)\]\(([^)]+)\)/i) || line.match(/^###?\s*([A-Za-z0-9\s\&\-\/\,\(\)]+)/i);
        
        if (headerMatch && headerMatch[1] && headerMatch[1].length > 5 && !headerMatch[1].toLowerCase().includes('carousel') && !headerMatch[1].toLowerCase().includes('resources')) {
          if (currentJob && currentJob.title) {
            extractedJobs.push(currentJob);
          }

          const titleText = headerMatch[1].trim();
          const urlLink = headerMatch[2] || sourceURL;
          const isVisa = /visa|sponsorship|h-1b|h1b|green card|o-1|e-3/i.test(markdown);
          const isRemote = /remote/i.test(titleText + ' ' + markdown);

          currentJob = {
            id: `fc-parsed-${Date.now()}-${extractedJobs.length}-${idx}`,
            title: titleText,
            company: item.metadata?.ogSiteName || item.metadata?.siteName || 'Web Employer',
            location: isRemote ? 'Remote / USA' : 'International Location',
            country: 'USA',
            remoteType: isRemote ? 'Remote' : 'Hybrid/Onsite',
            visaSponsored: isVisa,
            relocationPackage: isVisa,
            salary: '$80,000 - $180,000 / year (Visa Sponsored)',
            source: 'Firecrawl API Result',
            applyUrl: urlLink.startsWith('http') ? urlLink : sourceURL,
            description: `Extracted from Firecrawl search response.\nSource URL: ${sourceURL}\n\nTitle: ${titleText}\nFull Details available on posting page.`,
            skillsRequired: ['React', 'Node.js', 'TypeScript', 'Java', 'Python', 'AWS', 'Docker', 'Spring Boot'],
            experienceMinYears: 4
          };
        } else if (currentJob) {
          if (line.trim().length > 0 && currentJob.description.length < 1000) {
            currentJob.description += '\n' + line.trim();
          }
          const salaryMatch = line.match(/\$\d{2,3},\d{3}\s*-\s*\$\d{2,3},\d{3}/);
          if (salaryMatch) {
            currentJob.salary = salaryMatch[0] + ' / year';
          }
        }
      });

      if (currentJob && currentJob.title) {
        extractedJobs.push(currentJob);
      }

      if (extractedJobs.length === 0) {
        const isVisa = /visa|sponsorship|h-1b|h1b|green card/i.test(markdown);
        extractedJobs.push({
          id: `fc-item-${Date.now()}-${idx}`,
          title: pageTitle.replace(/\|.*$/g, ''),
          company: item.metadata?.ogSiteName || 'Web Search Result',
          location: 'International / USA',
          country: 'USA',
          remoteType: 'Hybrid',
          visaSponsored: isVisa,
          relocationPackage: isVisa,
          salary: 'Market Rate (Check Link)',
          source: 'Firecrawl API Result',
          applyUrl: sourceURL,
          description: markdown.slice(0, 1000) || 'Firecrawl scraped page content.',
          skillsRequired: ['React', 'Node.js', 'Java', 'Spring Boot', 'AWS', 'TypeScript'],
          experienceMinYears: 4
        });
      }
    });

    return extractedJobs;
  } catch (err) {
    console.error('Firecrawl Parse Error:', err);
    return [];
  }
}

export async function searchFirecrawlJobs(apiKey, query, country = 'Global') {
  if (!apiKey) {
    throw new Error('Firecrawl API Key is missing. Please add your key in API Settings.');
  }

  const searchQuery = `${query} job visa sponsorship relocation ${country !== 'Global' ? country : ''}`;

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 10,
        scrapeOptions: {
          formats: ['markdown']
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Firecrawl API Error: ${response.statusText}`);
    }

    return parseFirecrawlResponseJson(data);
  } catch (err) {
    console.error('Firecrawl search error:', err);
    throw err;
  }
}
