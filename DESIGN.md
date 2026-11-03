# AutoMarket Studio — UI/UX Design System Specification

> Grounded in **Apple Human Interface Guidelines (HIG)** and **WWDC Fluid Interface** principles.
> Designed specifically for offline-first, self-hosted desktop workflows on macOS and Windows 11.

---

## 1. Core Architecture & Operating Principles

AutoMarket Studio is a high-speed, local-first marketing command center built for solo founders, independent software engineers, and technical consultants. The app adheres to four foundational architecture rules:

### 1.1 Self-Hosted & Local-First (Zero Cloud / No User Auth)
- **No User Login / Sign Out**: The application is strictly self-hosted and offline-first. There are no cloud user accounts, login portals, password fields, or sign-out buttons.
- **Local Data Storage Guarantee**: All lead lists, CRM records, scheduled posts, and outreach templates live directly on the user's computer (e.g. `leads/leads.json`).
- **Dock Workspace Inspector**: The bottom avatar button in the navigation dock (`AM`) opens the **Local Studio Workspace & Offline Database Inspector**, showing offline record counts, local preferences, and lead backup export—not an account session manager.

### 1.2 Plain Business English (Strictly Anti-Jargon)
- All copy is written in clear, natural business English that any small business owner or founder immediately understands.
- Developer jargon, automated buzzwords, and machine slang are strictly prohibited across all screens and notifications:

| Prohibited Jargon / AI Slang | Mandatory Plain English Replacement |
| :--- | :--- |
| **Dispatch / Automated Cross-Dispatch** | **Publish / Schedule / Post / Send** |
| **Engine / AI Synthesizer** | **Studio / System / Tool / Workspace** |
| **Fluff-Free Tone / 98% Fluff-Free** | **Direct & Natural Tone / Clear Tone** |
| **Dispatched Audits / Dispatched Teardowns** | **Audits Sent / Performance Reports Sent** |
| **Dispatch Post** | **Publish Now / Schedule Post / Share Now** |
| **Pre-compute** | **Prepare / Ready** |
| **Teardown** | **Review / Summary / Breakdown** |
| **Outreach Pitch / Pitch** | **Suggested Message / Client Message** |
| **Sign Out / User Auth** | **Local Storage Inspector / Offline Workspace** |

### 1.3 Zero AI Gimmicks & Banned Embellishments
- **No Star / Sparkle Icons (`✨`, `Sparkles`)**: Banned entirely. They create visual fatigue and scream low-effort AI generation.
- **No Decorative Fake Status Dots**: Colored green/lime dots preceding standard English descriptive text (such as `• Plain English Voice` or `• Cites concrete benchmarks...`) are banned. Colored status dots are reserved solely for live system connection states.
- **Restraint Over Decoration**: Clean containers, crisp borders, and subtle contrast rather than arbitrary badge clutter.

### 1.4 Native Desktop Window Management & Keyboard Rules
- **Escape Key (`Esc`)**: Exclusively dismisses open semi-modal sheets, popovers, and dialogs (`ModalNewPost`, `ModalSendProposal`, `AccountPopover`, `NotificationsPopover`). **`Esc` must NEVER exit or toggle window maximization.**
- **Window Minimize**: Minimizes the desktop window directly to the OS taskbar/dock. **Never show a toast notification on minimize** (silence is golden for window controls per Apple HIG).
- **Window Maximize**: Toggles between windowed state and maximized desktop workspace. **Never invoke HTML5 browser fullscreen (`requestFullscreen`)**.

### 1.5 Strict Desktop Typography Scale (Minimum 12px)
Text smaller than 12px (`text-[10px]`, `text-[11px]`) causes visual strain and fails accessibility standards on desktop monitors:

| Typography Role | Tailwind Class | Font Size / Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Screen Title (H1)** | `text-2xl font-bold tracking-tight` | `24px` / Bold | Primary view header (Studio Hub, Content Studio, Lead Radar). |
| **Section Title (H2)** | `text-[18px] font-bold tracking-tight` | `18px` / Bold | Major card group titles (Scheduled Campaigns, Metric headers). |
| **Card Heading (H3)** | `text-[17px] font-bold tracking-tight` | `17px` / Bold | Primary card header (Weekly Reach Spline, Content Schedule). |
| **Item Title / Row Name** | `text-sm font-semibold tracking-tight` | `14px` / Semibold | Lead names, post titles, pitch recipient names. |
| **Body / Paragraphs** | `text-sm text-[#D1D5DB] leading-relaxed` | `14px` / Regular | Post draft body, audit explanations, pitch copy. |
| **Captions / Form Labels** | `text-xs font-medium text-[#9CA3AF]` | `12px` / Medium | Subtitles, inputs, table column headers, status badges. |
| **Metadata / Timestamps** | `text-xs font-semibold text-[#8A8F9E]` | `12px` / Semibold | Scheduled times, post character counts, channel tags. |
| **ABSOLUTE MINIMUM** | `text-xs` (`12px`) | **12px** | **No font size below 12px is permitted anywhere in the app.** |

---

## 2. Color Palette & Dual Theme Hierarchy (Apple HIG)

The interface supports both Dark and Light appearances calibrated to Apple Human Interface Guidelines:

### 2.1 Obsidian Dark Appearance (Default)
| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#18191D` | Deep matte charcoal canvas. Prevents desktop eye fatigue. |
| **Card & Recessed Surface** | `#202227` | Primary surface for cards, modals, and tables. Border: `#2E313A`. |
| **Surface Elevate / Hover** | `#25272F` | Interactive hover state and popover menus. |
| **Border / Delimiter** | `#2E313A` | Subtle structural dividers and container outlines. |
| **Primary Accent (Lime)** | `#D2F83D` | High-energy accent for active nav dock indicator, primary buttons, and key peaks. |
| **Secondary Accent (Cobalt)** | `#3B66F5` | Brand identity, calendar card background, primary actions, and proposal triggers. |
| **Text - Primary** | `#FFFFFF` | High-contrast headings, numeric values, and primary labels. |
| **Text - Secondary** | `#8A8F9E` | Secondary metadata, explanatory copy, and timestamps. |
| **Text - Muted** | `#656A78` | Search placeholders and inactive indicators. |
| **Critical / High Friction** | `#EF4444` / `#F87171` | Health vulnerabilities, latency warnings. Container: `#2A1618`, border `#7F1D1D]/40`. |
| **Moderate / Warning** | `#F59E0B` / `#FBBF24` | Qualified opportunities and moderate health scores. Container: `#2B2114`. |
| **Fair / Healthy** | `#10B981` / `#34D399` | Optimal system health and high conversion metrics. Container: `#14261C`. |

### 2.2 Silver Daylight Light Appearance
| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#F5F6F8` | Clean, subtle off-white macOS canvas. Glare-free daylight environment. |
| **Card & Navigation Dock** | `#FFFFFF` | Pure white elevated surfaces with Apple subtle drop shadow. Border: `#E2E4E9`. |
| **Surface Recess / Well** | `#F0F2F5` | Inset wells, inactive pills, logo containers, and hover states. |
| **Border / Delimiter** | `#E2E4E9` | Crisp, low-contrast structural borders (`1px`). |
| **Primary Accent (Lime)** | `#D2F83D` | Retains high-energy brand accent with `#18191D` dark text for high contrast. |
| **Secondary Accent (Cobalt)** | `#3B66F5` | Primary action buttons and selected date highlights with white text. |
| **Text - Primary** | `#111827` | Deep slate/almost-black for headings and primary content. |
| **Text - Secondary** | `#64748B` | Balanced slate for metadata, captions, and dock icons. |
| **Text - Muted** | `#94A3B8` | Subtle hints, placeholders, and inactive dates. |
| **Critical Badge** | `#FEF2F2` / `#DC2626` | Soft pastel red container with bold crimson text and `#FECACA` border. |
| **Moderate Badge** | `#FFFBEB` / `#D97706` | Soft pastel amber container with amber text and `#FDE68A` border. |
| **Fair Badge** | `#F0FDF4` / `#16A34A` | Soft pastel emerald container with green text and `#BBF7D0` border. |
| **Healthy Badge** | `#EFF6FF` / `#2563EB` | Soft pastel blue container with cobalt text and `#BFDBFE` border. |

---

## 3. WWDC Fluid Interface & Animation Standards

Every interactive element incorporates Apple-grade fluid physical motion:

| Component / Action | Physics Config | Micro-Interaction Behavior |
| :--- | :--- | :--- |
| **Dock Active Pill** | `layoutId="activeDockPill"`<br>`stiffness: 480, damping: 34, mass: 0.8` | Continuous gliding lime pill that slides with natural momentum behind the active dock icon. |
| **Screen Navigation** | `duration: 0.24, ease: [0.16, 1, 0.3, 1]` | Apple fluid entrance (`opacity: 0 -> 1, y: 6 -> 0, scale: 0.996 -> 1`). |
| **Modal Sheets** | `stiffness: 450, damping: 30` | Frosted semi-modal sheet with `backdrop-blur-2xl bg-[#202227]/95`. Dismiss on `Escape` or backdrop click. |
| **Interactive Buttons** | `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.95 }}` | Tactile depression giving instant physical press feedback. |
| **Window Controls** | `whileHover={{ scale: 1.08 }}`, `whileTap={{ scale: 0.90 }}` | Native frameless titlebar buttons with unblocked drag regions (`WebkitAppRegion: 'no-drag'`). |
| **Toasts** | `stiffness: 420, damping: 28` | Tactile spring entry from bottom-right (`y: 14 -> 0, scale: 0.94 -> 1`) with horizontal slide exit. |
| **Social Reaction Heart** | Keyframe Spring | `scale: [1, 1.35, 1], duration: 0.25` pop on post favorite interaction. |

---

## 4. Screen-by-Screen Anatomy

### 01. Studio Hub
- **Header**: Founder greeting, search pill with instant clear button, and `+ Create Post` primary button.
- **Weekly Audience Reach Spline**: Interactive 7-day spline curve showing Audience Views (Lime peak at `8 745`), People Engaged (Amber peak at `700`), and Optimal Post Timing (Purple peak at `6 PM Peak`).
- **Content Schedule Calendar**: Cobalt card (`#3B66F5`) with interactive month dropdown, week grid, and spring day selection.
- **Focus Time & Outreach Goals**: Circular 270° SVG gauge (`7.5h / 8.0h`) paired with a progress bar (`16 / 20 Audits Sent`).
- **Scheduled Campaigns**: Categorized cards for Social Media and Client Outreach with clear channel tags and `+ New Draft` quick trigger.

### 02. Content Studio & Queue
- **Publication Queue**: Left column with filter pills (`All Posts`, `Social Updates`, `Direct Outreach`) and staged/ready status indicators.
- **Story Inspector & Live Simulator**: Real-time channel preview for Bluesky, X/Twitter, LinkedIn, and Tech Blog with live character counts.
- **Tactile Reaction Row**: Interactive reaction badges (`Replies`, `Reposts`, `Likes`) with spring scale pops.
- **Quality Check Banner**: Natural tone verification (`Written in clean, natural English • High authenticity score`) and `Ready to Share` status.
- **Publish Action**: Tactile `Publish Now` controls that move posts from staged to published with instant toast notification.

### 03. Lead Radar & CRM
- **Pipeline Metric Cards**: 4 summary cards (`Scanned Pipeline (2,174 Targets)`, `Critical Gaps (32 Urgent)`, `Modernization Candidates (45 Qualified)`, `Healthy Systems (64 Monitored)`).
- **Interactive Filter Tabs**: Filter between All, Critical Gaps, Modernization Opportunities, and Healthy Systems.
- **CRM Table**: Clear column headers (`TARGET / DOMAIN`, `DIGITAL HEALTH`, `DETECTED GAP / ISSUE`, `ACTION`).
- **Digital Health Meters**: Fixed-width `96px` (`w-24`) smooth rounded progress tracks paired with numerical score pills (`32 Critical`). Zero clipping.
- **Actions**: Tactile `Audit` (opens full website review) and `Proposal ↗` (opens customized proposal modal) buttons.

### 04. Social Intent Stream
- **Live Inbound Feed**: Filterable feed of prospective clients requesting developer assistance (`Dr. Elena Rostova`, `Marcus Vance`, `Liam Chen`, `Sarah Jenkins`) with verified match scores and budget estimates.
- **Relevant Case Studies**: Side-by-side benchmark proof cards (`Northstar Health Portal Modernization`, `Stride Gear Checkout Optimization`).
- **Suggested Message**: Pre-composed, natural client message tailored to the prospect's exact architectural flaw, with 1-click clipboard copy (`Copy Message`).
- **Send Proposal Trigger**: Primary action button to immediately open the proposal and audit report package.

### 05. Growth & Revenue Analytics
- **Financial Metric Cards**: Attributed Revenue (`$68,450`), Average Package Value (`$9,780`), Audit-to-Close Rate (`18.4%`), and Active Retainers (`6 Clients`).
- **Client Acquisition Funnel**: Clear conversion stages from `Audits & Reviews Sent` (142) -> `Direct Replies & Discovery Calls` (58) -> `Proposal Packages Sent` (26) -> `Closed Modernization Sprints` (12).
- **Top Revenue Assets**: High-performing case studies ranked by attributed revenue and win rate.

### 06. Studio Settings & Preferences
- **Appearance & Theme**: Instant switching between Obsidian Dark and Silver Daylight modes with live previews.
- **Channel Integrations**: Toggle cards for X/Twitter, Bluesky, GitHub, and Local Leads Database with authentic macOS spring toggle switches.
- **Tone & Match Calibration**: Range sliders for Direct Natural Tone and Relevance Matching.
- **Daily Morning Routine**: Scheduled preparation of daily draft queue and high-fit client messages.

### 07. Daily 15-Minute Marketing Sprint
- **4-Step Execution Checklist**:
  1. *Publish Today's Case Study* (3 min)
  2. *Review High-Intent Inquiries* (4 min)
  3. *Send Client Message* (5 min)
  4. *Verify Tomorrow's Schedule* (3 min)
- **Active Task Workspace**: Context-aware workspace showing the active message, attached 2-page PDF audit report, and 1-click completion button.

### 08. Client Modernization Audit Report
- **Executive Diagnostic Header**: Client domain, overall score (`32/100`), and `Export PDF` action.
- **Revenue Friction Callout**: High-impact revenue loss estimation (`$14,200/mo`) caused by mobile booking friction.
- **Three Core Diagnostics**:
  1. *Mobile Load Time*: 4.2s vs <1.2s benchmark (3.5x slower).
  2. *Mobile Usability*: 28/100 viewport touch collision failure.
  3. *Database Query Delay*: 0.8s unindexed slot query wait.
- **Fixed-Scope Solution Package**: Clear 14-day execution plan ($9,500 fixed scope).

### 09. Modals & Overlays
- **Create New Post**: Frosted modal (`backdrop-blur-2xl bg-[#202227]/95`) with target channel selector, clean text editor, plain English tip banner, and save/schedule actions.
- **Send Client Proposal**: Client recipient header, package tier selector, scope summary, and fixed pricing send button.
- **Local Workspace Popover**: Offline database inspector displaying local records (`leads.json`), preferences, and CSV backup export.
- **Exit Studio Confirmation**: Friendly offline safety prompt ensuring no data is lost upon closing.

---

## 5. Verification & Squint Testing Protocols

Before deploying or committing UI changes:
1. **Font Size Check**: Ensure zero instances of `text-[9px]`, `text-[10px]`, or `text-[11px]`. All text must be `text-xs` (12px) or larger.
2. **Jargon Check**: Ensure zero instances of `dispatch`, `fluff`, `engine`, `synthesiz`, or fake decorative dots.
3. **Playwright E2E Suite**: Run `zap proxy npx playwright test` to verify all 11 screens and capture fresh visual proof screenshots.
4. **Squint Test Inspection**: Inspect resulting screenshots in `./screenshots/` (or the configured `SCREENSHOT_DIR`) to verify optical centering, padding balance, and baseline alignment.
