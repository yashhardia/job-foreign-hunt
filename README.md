# 🌍 GlobalHunt AI - Foreign Job Finder & Multi-Profile Match Engine

**GlobalHunt AI** is an intelligent web application built to search, score, and track international software engineering jobs with **Firecrawl API**, **Apify API**, and **Curly LLM Web Search API** integrations. 

It evaluates candidate profiles against foreign job requirements—prioritizing technical skills, experience alignment, **Visa Sponsorship**, and **Relocation packages**—with a strict match rating system and one-click direct application redirects.

---

## 🌟 Key Features

### 1. 🔑 Multi-API Integrations (Firecrawl, Apify & Curly LLM Search)
- **Firecrawl API (`fc-...`)**: Deep web search across global tech job portals, company career pages, and URL scraping. Includes a smart JSON payload extractor that parses raw Firecrawl API search responses into individual job listings.
- **Apify API (`apify_api_...`)**: Runs specialized LinkedIn, Indeed, and Glassdoor job scrapers on Apify.
- **Curly LLM Web Search API (`curly-search.html`)**: A dedicated separate page to test and evaluate structured web search JSON outputs for AI agents.
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

### 4. ⚡ Dedicated Curly API Tester Page (`/curly-search.html`)
- Test search queries specifically designed for AI agents and LLM sources.
- Displays full JSON structure with syntax highlighting.
- Features an **AI Agent Audit Panel** evaluating missing features (Full Markdown Extraction, Entity Schemas, Rate Limit Headers).

---

## 🛠️ Project Structure

```text
job-foreign-hunt/
├── index.html            # Standalone zero-dependency React app (runs in any browser)
├── curly-search.html     # Dedicated Curly LLM Search API tester & AI Agent evaluation page
├── server.js             # Node 14+ compatible local development server
├── package.json          # Node scripts and dependencies
├── src/
│   ├── App.jsx           # Main Application Component & State Management
│   ├── main.jsx          # React DOM entry point
│   ├── index.css         # Tailwind & custom CSS styles
│   └── services/         # Firecrawl, Apify, and match engine services
└── README.md             # Project documentation
```

---

## 🚀 Quick Start Guide

1. Navigate to the project directory:
   ```bash
   cd "C:\Users\my pc\.gemini\antigravity\scratch\job-foreign-hunt"
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open in your browser:
   - **Main App**: [`http://localhost:3000`](http://localhost:3000)
   - **Curly API Tester Page**: [`http://localhost:3000/curly-search.html`](http://localhost:3000/curly-search.html)
