# AutoMarket Studio

> **An open-source, local-first marketing & lead intelligence desktop app for solo technical founders, consultants, and freelance developers.**

AutoMarket Studio turns your past technical case studies and engineering results into an inbound client acquisition pipeline. Designed for builders who want consistent client revenue without paying for bloated cloud CRMs, spamming cold emails, or spending hours writing marketing copy.

---

## Why AutoMarket Studio?

* **100% Local & Private**: No cloud accounts, no third-party tracking, and no external servers. All prospective client data, CRM records, and scheduled drafts remain stored on your machine in `leads/leads.json`.
* **Zero Marketing Fluff**: Replaces generic AI sales pitches with proof-driven technical case studies and concrete website modernization audits.
* **15-Minute Daily Habit**: A guided 4-step morning sprint lets you review high-fit client requests, approve proof posts, and send audit summaries before your workday begins.
* **Native Desktop Experience**: Built with frameless window management, keyboard shortcuts (`1-7`, `Cmd/Ctrl+K`, `Escape`), and fluid physical motion.

---

## Core Features

### 1. Studio Hub
Your daily marketing dashboard. Displays your current pipeline focus score, a weekly client reach chart, scheduled campaigns, and rapid actions to draft updates or send proposals.

### 2. Lead Radar & CRM Database
A local offline database of target businesses scored by web performance health:
* **Critical Gaps**: Slow mobile load speeds (>4s), high bounce rates, and outdated frontends.
* **Modernization Opportunities**: Businesses with high monthly visitors whose tech stack is ripe for an overhaul.
* **Healthy Systems**: Maintained web applications with low optimization urgency.

### 3. Client Opportunities & Inbound Intent Feed
Monitors buyer signals across social channels (such as Twitter/X and Bluesky). When a founder or director posts about a slow patient portal, Shopify checkout drop-offs, or legacy system overhauls, AutoMarket Studio matches the post with your relevant past case study and drafts a natural, suggested client message.

### 4. Content Studio & Scheduled Queue
Write, format, and preview multi-channel updates with built-in character limit validation. Drafts can be scheduled for specific morning publishing slots or saved locally.

### 5. Two-Page Modernization Audit Report
Generates an executive-ready performance summary for any prospective client:
* Mobile load speed diagnostic (e.g. 5.1s down to 0.7s potential).
* Estimated revenue impact and bounce rate attribution.
* Recommended engineering steps (edge caching, database indexing, Next.js migration).

### 6. Daily 15-Minute Marketing Sprint
A structured, step-by-step workflow:
1. Approve today's case study post.
2. Review and send the top healthcare/inbound opportunity message.
3. Queue an e-commerce checkout optimization summary.
4. Sync your local CRM pipeline.

### 7. Growth & Revenue Attribution
Track real business attribution from cold website audit reviews to signed engineering contracts, average sales cycle durations, and top-performing case study assets.

---

## Agentic Skills for Automated Marketing

When operating AutoMarket Studio with an autonomous agent (such as Antigravity, Claude Code, or Cursor), the app leverages specialized agentic skills to perform marketing tasks autonomously:

| Skill | Purpose & Application in AutoMarket Studio |
|---|---|
| **`scrapling-official`** | **Web Scraping & Performance Auditing**: Crawls prospective client websites, extracts DOM structures, measures real mobile load latency, inspects frontend tech stacks, and flags form/checkout bottlenecks without triggering anti-bot hurdles. Powers the **Lead Radar** and **Audit Report** generator. |
| **`last30days`** | **Social Intent & Buyer Signal Discovery**: Scans recent discussions across X/Twitter, Bluesky, Reddit, and Hacker News for founders actively seeking senior engineers, migrations, or speed fixes. Feeds the **Client Opportunities** stream with real buyer requests from the past 30 days. |
| **`playwright-cli`** | **Browser Automation & Visual Proofs**: Controls headless Chromium to generate high-resolution mobile screenshots, test responsive layouts, and verify visual alignment for 2-page client audit attachments. |
| **`humanizer`** | **Natural Voice & Anti-Fluff Writing**: Rewrites suggested messages and social posts to eliminate robotic AI clichés, marketing buzzwords, and sales tropes—ensuring every outreach message reads like a direct, senior engineer speaking to a business owner. |
| **`automation`** | **Daily Morning Routine Scheduler**: Manages background cron triggers to automatically prepare your daily post draft and top 3 client opportunities every morning at 9:00 AM. |

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0 or higher)
* npm or pnpm

### 1. Installation
```bash
git clone https://github.com/1-pankaj/AutoMarketStudio.git
cd AutoMarketStudio
npm install
```

### 2. Launch Development App
```bash
npm run dev
```
This starts the local Vite dev server and launches the Electron desktop application.

### 3. Customize Your Profile & Settings
1. Open **Studio Preferences** (`6` or via the gear icon).
2. Enter your name, specialty (e.g., *Full-Stack Web Optimization Specialist*), and connected platforms.
3. Your local preferences are saved instantly to your machine.

### 4. Import or Edit Local Leads
Target contacts and prospect records reside locally in:
```
leads/leads.json
```
You can edit or extend this JSON file with your own prospective clients, domain names, monthly visitor counts, and category tags.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `1` | Open **Studio Hub** |
| `2` | Open **Content Studio** |
| `3` | Open **Lead Radar** |
| `4` | Open **Client Opportunities** |
| `5` | Open **Growth Analytics** |
| `6` | Open **Studio Settings** |
| `7` | Open **Daily 15-Minute Sprint** |
| `Cmd` / `Ctrl` + `K` | Open Command Search |
| `Escape` | Dismiss any open modal, sheet, or popover |

---

## Contributing & Development

We welcome contributions from designers, solo founders, and open-source engineers!

### Development Commands
```bash
# Type check TypeScript
npm run lint

# Run Playwright visual & behavioral E2E tests
npm run test:e2e

# Build production bundle
npm run build
```

For design guidelines, Apple Human Interface standards, and PR workflows, please read [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

AutoMarket Studio is open source software licensed under the [MIT License](LICENSE).
