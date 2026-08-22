# 🌍 GlobalHunt AI - Foreign Job Finder & Multi-Profile Match Engine

**GlobalHunt AI** is an intelligent web application built to search, score, and track international software engineering jobs with **Firecrawl API** and **Apify API** integrations. 

It evaluates candidate profiles against foreign job requirements—prioritizing technical skills, experience alignment, **Visa Sponsorship**, and **Relocation packages**—with a strict match rating system and one-click direct application redirects.

---

## 🌟 Key Features

### 1. 🔑 Firecrawl & Apify API Integrations
- **Firecrawl API (`fc-...`)**: Deep web search across global tech job portals, company career pages, and URL scraping. Includes a smart JSON payload extractor that parses raw Firecrawl API search responses into individual job listings.
- **Apify API (`apify_api_...`)**: Runs specialized LinkedIn, Indeed, and Glassdoor job scrapers on Apify.
- **Demo & Fallback Mode**: Ships pre-loaded with realistic foreign job postings (Germany, Netherlands, UK, Canada, Japan, USA, Remote) so you can use the application immediately even without API keys.

### 2. 🎯 Match Rating & Scoring Engine
Scores jobs against the candidate's active profile using a weighted algorithm (45% Skills, 25% Visa/Relocation, 15% Experience, 15% Location):
- 🔥 **90% – 100%**: **Apply Immediately** (High Priority Match with glowing emerald badge)
- 👍 **80% – 89%**: **Apply** (Strong Fit with blue badge)
- 💡 **70% – 79%**: **Consider** (Good Fit / minor skill gaps with amber badge)
- 🔍 **< 70%**: Low Match (Filterable)

### 3. 👤 Multi-Candidate Profile Engine & Yash Hardia Resume Integration
- **Pre-Loaded Resume**: Includes **Yash Hardia**'s parsed candidate profile (*Senior Full Stack Software Engineer — 9+ Yrs Experience in React, Angular, Java, Spring Boot, Node.js, AWS, Docker, Microservices, Kafka*).
- **Multi-Profile Selector**: Switch profiles with a single click in the top navigation header or search bar to dynamically re-evaluate all job match ratings.
- **Resume Parser**: Paste raw resume text or OCR to automatically extract technical skills, experience level, and target job titles into a new profile.

### 4. 🚀 Direct Application Redirects
- One-click action buttons on cards and detail modals open the original job application link (LinkedIn, Greenhouse, Lever, Workday, Indeed, etc.) directly in a new browser tab.

### 5. 📋 Application Pipeline Tracker & Scrape URL
- **Scrape URL Tab**: Paste any direct foreign job link to extract job details and score profile fit.
- **Tracker Board**: Save and track application stages (*Saved, Applied, Interviewing, Offer Received, Archived*) with one-click **CSV export**.

---

## 🛠️ Project Structure

```text
job-foreign-hunt/
├── index.html            # Standalone zero-dependency React app (runs in any browser)
├── server.js             # Node 14+ compatible local development server
├── package.json          # Node scripts and dependencies
├── src/
│   ├── App.jsx           # Main Application Component & State Management
│   ├── main.jsx          # React DOM entry point
│   ├── index.css         # Tailwind & custom CSS styles
│   ├── components/
│   │   ├── Navbar.jsx           # Top header & active profile selector
│   │   ├── ApiKeyModal.jsx      # Firecrawl & Apify key configuration modal
│   │   ├── ProfileForm.jsx      # Candidate profile & skills manager
│   │   ├── JobCard.jsx          # Match rating card with direct apply link
│   │   ├── JobDetailModal.jsx   # Full job view & breakdown modal
│   │   ├── ScrapeUrlTab.jsx     # URL scraper tab
│   │   └── TrackerBoard.jsx     # Kanban application pipeline tracker
│   └── services/
│       ├── firecrawlService.js  # Firecrawl search & payload parsing
│       ├── apifyService.js      # Apify actor search service
│       ├── matchEngine.js       # Weighted candidate-job match scoring engine
│       └── mockJobs.js          # Pre-loaded international jobs dataset
└── README.md             # Project documentation
```

---

## 🚀 Quick Start Guide

### Option 1: Instant Browser Launch (No Node required)
Simply double-click or open `index.html` directly in any web browser:
```text
file:///C:/Users/my%20pc/.gemini/antigravity/scratch/job-foreign-hunt/index.html
```

### Option 2: Run Local Server
1. Navigate to the project directory:
   ```bash
   cd "C:\Users\my pc\.gemini\antigravity\scratch\job-foreign-hunt"
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open **`http://localhost:3000`** in your browser.

---

## 📖 Usage Instructions

1. **Select Active Candidate Profile**: Use the top header dropdown to select **Yash Hardia** or create/switch to another profile.
2. **Search or Import Jobs**:
   - Search by role/skills (e.g. *Full Stack Engineer*, *React*, *Java*).
   - Filter by country (USA, Germany, Netherlands, UK, Remote) or Visa Sponsorship.
   - Click **`📋 Import Firecrawl JSON`** to paste raw API responses and extract all embedded job listings instantly.
3. **Review Rating Scores**:
   - Check the **90-100% Apply Immediately 🔥** cards.
   - View matched skills (✓) and missing skills (✕).
4. **Apply Directly**: Click **Apply Immediately 🚀** or **Apply Now 👍** to open the external job portal page in a new tab.
5. **Track Pipeline**: Click **+ Save** on any job card to add it to your Application Tracker and export your pipeline as a CSV file.

---

## 📄 License
MIT License. Created for international job hunting and automated profile matching.
