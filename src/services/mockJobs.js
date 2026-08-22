export const INITIAL_MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer (Visa & Relocation Package)',
    company: 'Fintech Scaleup Europe',
    location: 'Berlin, Germany (Hybrid)',
    country: 'Germany',
    remoteType: 'Hybrid',
    visaSponsored: true,
    relocationPackage: true,
    salary: '€85,000 - €105,000 / year',
    minSalaryNum: 85000,
    currency: 'EUR',
    postedDate: '2 days ago',
    source: 'Company Career Site',
    applyUrl: 'https://workable.com',
    description: `We are seeking a Senior Full Stack Engineer to join our core banking team in Berlin. Full relocation support including visa sponsorship, blue card processing, flights, and temporary apartment provided.

Key Requirements:
- 5+ years experience in React, TypeScript, Node.js or Python
- Experience building scalable microservices and RESTful / GraphQL APIs
- Knowledge of PostgreSQL, Docker, AWS or GCP
- Fluent English speaker (German language not required)
- Willingness to relocate to Berlin, Germany`,
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Python'],
    experienceMinYears: 5
  },
  {
    id: 'job-2',
    title: 'Lead Frontend Architect',
    company: 'Booking Tech Group',
    location: 'Amsterdam, Netherlands (Hybrid)',
    country: 'Netherlands',
    remoteType: 'Hybrid',
    visaSponsored: true,
    relocationPackage: true,
    salary: '€95,000 - €115,000 / year + 30% Tax Ruling',
    minSalaryNum: 95000,
    currency: 'EUR',
    postedDate: '1 day ago',
    source: 'LinkedIn Jobs via Firecrawl',
    applyUrl: 'https://linkedin.com',
    description: `Join our high-impact guest experience team in Amsterdam! We offer full 30% tax allowance support, relocation allowance, and highly competitive salary.

Key Requirements:
- Expert proficiency in Modern React, Next.js, Micro-frontends, Performance Optimization
- State management with Zustand/Redux, Tailwind CSS, TypeScript
- Experience leading tech decisions, code reviews, and architectural patterns
- Great communication in English`,
    skillsRequired: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Architecture', 'Web Performance'],
    experienceMinYears: 6
  },
  {
    id: 'job-3',
    title: 'Staff AI / Machine Learning Engineer (Remote Worldwide)',
    company: 'NexusAI Global',
    location: 'Remote (Worldwide)',
    country: 'Remote',
    remoteType: 'Remote',
    visaSponsored: false,
    relocationPackage: false,
    salary: '$130,000 - $160,000 USD / year',
    minSalaryNum: 130000,
    currency: 'USD',
    postedDate: '3 hours ago',
    source: 'Apify LinkedIn Scraper',
    applyUrl: 'https://greenhouse.io',
    description: `100% Remote position open to engineers anywhere globally. Pay in USD via Remote.com or Deel.

Key Requirements:
- Python, PyTorch / TensorFlow, LLM Fine-tuning, LangChain, RAG pipelines
- Vector databases (Pinecone, Qdrant, ChromaDB), FastAPI, Docker
- 4+ years in Machine Learning or Data Engineering
- Strong problem solving and independent asynchronous work ethics`,
    skillsRequired: ['Python', 'PyTorch', 'LLMs', 'LangChain', 'FastAPI', 'Vector DB', 'Docker'],
    experienceMinYears: 4
  },
  {
    id: 'job-4',
    title: 'Cloud DevOps & Infrastructure Lead (UK Visa Sponsored)',
    company: 'CloudVentures UK',
    location: 'London, UK (On-site / Hybrid)',
    country: 'UK',
    remoteType: 'Hybrid',
    visaSponsored: true,
    relocationPackage: true,
    salary: '£80,000 - £100,000 / year',
    minSalaryNum: 80000,
    currency: 'GBP',
    postedDate: 'Just now',
    source: 'Firecrawl Career Scrape',
    applyUrl: 'https://lever.co',
    description: `Licensed Tier 2 / Skilled Worker Visa Sponsor in London. Looking for an experienced Cloud Infrastructure Lead to migrate legacy systems to Kubernetes on AWS.

Key Requirements:
- AWS, Kubernetes (EKS), Terraform, CI/CD pipelines (GitHub Actions)
- Monitoring (Prometheus, Grafana), Python / Bash scripting
- Strong understanding of security, VPC networking, IAM policies`,
    skillsRequired: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker', 'Python', 'Linux'],
    experienceMinYears: 5
  },
  {
    id: 'job-5',
    title: 'Backend Software Developer (Go / Microservices)',
    company: 'Tokyo Cloud Tech',
    location: 'Tokyo, Japan (Hybrid)',
    country: 'Japan',
    remoteType: 'Hybrid',
    visaSponsored: true,
    relocationPackage: true,
    salary: '¥9,000,000 - ¥12,000,000 / year',
    minSalaryNum: 65000,
    currency: 'JPY',
    postedDate: '3 days ago',
    source: 'Apify Google Jobs Scraper',
    applyUrl: 'https://japan-dev.com',
    description: `English-speaking engineering culture in central Tokyo (Shibuya). Full work visa sponsorship and relocation bonus provided.

Key Requirements:
- Go (Golang) or Java, gRPC, Redis, PostgreSQL, Distributed Systems
- Experience with high throughput event-driven microservices (Kafka)
- Japanese language skills are a plus but NOT required (English environment)`,
    skillsRequired: ['Go', 'Golang', 'Microservices', 'PostgreSQL', 'Redis', 'Docker', 'gRPC', 'Kafka'],
    experienceMinYears: 3
  },
  {
    id: 'job-6',
    title: 'Senior React Native / iOS Mobile Developer',
    company: 'Maple Leaf Mobility',
    location: 'Toronto, Canada (Hybrid)',
    country: 'Canada',
    remoteType: 'Hybrid',
    visaSponsored: true,
    relocationPackage: true,
    salary: '$110,000 - $135,000 CAD / year',
    minSalaryNum: 85000,
    currency: 'CAD',
    postedDate: '4 days ago',
    source: 'Indeed Scraper via Apify',
    applyUrl: 'https://indeed.com',
    description: `We sponsor Canadian Global Talent Stream work permits (processed in 2-4 weeks).

Key Requirements:
- React Native, TypeScript, Redux, iOS (Swift) or Android (Kotlin) native modules
- CI/CD for Mobile (Fastlane, App Store & Google Play deployment)
- Automated testing with Jest, Detox`,
    skillsRequired: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'Mobile Development', 'Redux', 'Jest'],
    experienceMinYears: 4
  },
  {
    id: 'job-7',
    title: 'Junior/Mid Frontend Developer',
    company: 'Nordic Digital Agency',
    location: 'Stockholm, Sweden (Onsite)',
    country: 'Sweden',
    remoteType: 'Onsite',
    visaSponsored: false,
    relocationPackage: false,
    salary: 'SEK 45,000 / month',
    minSalaryNum: 48000,
    currency: 'SEK',
    postedDate: '5 days ago',
    source: 'Firecrawl Web Search',
    applyUrl: 'https://monster.com',
    description: `Entry to mid level position in Stockholm. Requires existing EU work permit or Swedish residency.

Key Requirements:
- HTML, CSS, JavaScript, Vue.js or React
- 1-2 years experience building responsive websites
- Swedish or English fluency`,
    skillsRequired: ['JavaScript', 'HTML', 'CSS', 'Vue.js', 'React'],
    experienceMinYears: 1
  }
];
