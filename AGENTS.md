# AutoMarket Studio — Agent Architecture & Engineering Operations Guide

> This document defines how autonomous agents and pair-programmers interact with the AutoMarket Studio codebase, execute tooling, leverage agent skills, and maintain architectural and visual integrity.

---

## 1. Operating Rules & Core Constraints

### 1.1 Strictly Self-Hosted Architecture (NO CLOUD / NO USER LOGIN)
- **Zero Cloud Authentication**: The app is 100% self-hosted, offline-first, and local to the user's machine.
- **Never Add Login Forms or Auth**: Do NOT create login screens, sign-up flows, auth tokens, JWT handlers, or "Sign Out" actions.
- **Local Storage Mental Model**: All data (leads, CRM pipeline, drafts, settings) resides strictly on the local machine (e.g. `leads/leads.json`). The bottom dock avatar (`AM`) opens the **Local Studio Workspace & Offline Storage Inspector**, never an account or session manager.

### 1.2 Plain Business English (Strictly Anti-Jargon)
- All copy must read like natural human business English for non-technical clients and solo founders.
- **Prohibited Words & Mandatory Replacements**:
  - `dispatch` / `automated cross-dispatch` ➔ **publish** / **schedule** / **post** / **send**
  - `engine` / `synthesizer` ➔ **studio** / **system** / **tool** / **workspace**
  - `fluff-free tone` ➔ **direct & natural tone** / **clear tone**
  - `dispatched audits` ➔ **audits sent** / **performance reports sent**
  - `pre-compute` ➔ **prepare** / **ready**
  - `teardown` ➔ **review** / **summary** / **breakdown**
  - `outreach pitch` / `pitch` ➔ **suggested message** / **client message**
- **Zero AI Gimmicks**:
  - **No Stars / Sparkles (`✨`, `Sparkles`)**: Strictly banned.
  - **No Decorative Fake Green Dots**: Never prepend decorative colored dots before plain descriptive text (`• Plain English Voice`). Colored badges are reserved solely for actual live system states (e.g. active network connections).

### 1.3 Native Desktop Window Controls & Keyboard Shortcuts
- **`Escape` Key**: Exclusively dismisses open popovers, sheets, and modals. **`Escape` MUST NEVER exit or toggle window maximization.**
- **Window Minimize**: Minimizes the window to the OS taskbar/dock. **Never show a toast notification when the user minimizes the window.**
- **Window Maximize**: Toggles native window maximize. **Never call HTML5 browser fullscreen (`requestFullscreen`)**.

### 1.3 Desktop Typography Scale (Minimum 12px)
- **Absolute Floor**: No font size below 12px (`text-xs`) is permitted anywhere in the app.
- **Strictly Banned Classes**: `text-[9px]`, `text-[10px]`, `text-[11px]`.
- **Approved Scale**:
  - Captions, column headers, metadata tags: `text-xs font-semibold` (`12px`)
  - Body text, post copy, paragraphs: `text-sm leading-relaxed` (`14px`)
  - Subheadings & card titles: `text-[17px] font-bold` or `text-[18px] font-bold`
  - Screen titles: `text-2xl font-bold tracking-tight` (`24px`)

### 1.4 The Two Primary Design Skills
Whenever authoring, reviewing, or enhancing UI/UX across this desktop application, agents must consult and strictly adhere to two core skills:

1. **`apple-design`** (`.agents/skills/apple-design/`):
   - **WWDC Fluid Interfaces**: Physical spring curves (`stiffness`, `damping`, `mass`), velocity handoff, and immediate interruptibility.
   - **Tactile Feedback**: Every interactive surface must feature `whileHover={{ scale: 1.03 }}` and `whileTap={{ scale: 0.95 }}` micro-interactions.
   - **Restraint**: Zero artificial embellishments (no glitter stars, neon gradients, or tech jargon).
2. **`apple-design-hig`** (`.agents/skills/apple-design-hig/`):
   - **Desktop Architecture**: Frameless window management, keyboard navigation (`Escape`, `Cmd/Ctrl+K`, numeric keys `1-7`), clear visual hierarchies, and accessible touch/click boundaries.
   - **Modality & Sheets**: Semi-modal sheets with frosted glass depth (`backdrop-blur-2xl`), dismiss on backdrop click or `Escape`.

---

## 2. Context Optimization & Progressive Disclosure

To maintain model intelligence without context degradation:

### 2.1 Tier 1 — Macro Navigation via Graphify
- The project knowledge graph is indexed in `graphify-out/obsidian/` (over 4,900 nodes and 6,960 edges).
- Before touching systems, agents use macro navigation (`graphify query`, `graphify explain`, or reading Obsidian community hubs) to trace architecture and dependencies rather than blindly reading dozens of full source files.

### 2.2 Tier 2 — Surgical Code Inspection
- The graph is a map, not the source. Before editing code, agents **must** inspect the actual target source files for exact line numbers and contexts using `read_file`.
- Agents never guess or author code based solely on AST summaries.

### 2.3 Continuous Graph Synchronization
- After completing refactors or code additions, agents run:
  ```bash
  zap graphify update .
  ```
  to keep the Obsidian vault and knowledge graph synchronized at zero API cost.

### 2.4 Token-Optimized CLI via ZAP
- All shell commands must be prefixed with `zap` or `zap proxy` (e.g., `zap proxy npx playwright test`, `zap proxy npx vite build`).

---

## 3. Electron Desktop Architecture & Native Windowing

### 3.1 Preload Bundling Protocol (Critical)
- **Problem**: Electron's Chromium sandbox cannot execute native ES Module imports inside preload scripts.
- **Protocol**: `electron/preload.ts` must be compiled as CommonJS (`.cjs` format) in `vite.config.ts`:
  ```ts
  lib: {
    entry: 'electron/preload.ts',
    formats: ['cjs']
  },
  rollupOptions: {
    external: ['electron'],
    output: {
      format: 'cjs',
      entryFileNames: '[name].cjs'
    }
  }
  ```
- `electron/main.ts` resolves `preload.cjs` with `sandbox: false` to guarantee `window.electronAPI` is exposed in the renderer context.

### 3.2 Native Windows Controls & Drag Regions
- Frameless titlebars use `-webkit-app-region: drag` (`.app-drag`).
- All interactive controls inside the titlebar **must** specify `style={{ WebkitAppRegion: 'no-drag' }}` and `e.stopPropagation()` to prevent Windows from treating button clicks as window dragging.
- IPC handlers in `electron/main.ts` must dynamically resolve the target window using:
  ```ts
  const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  win?.minimize();
  ```

---

## 4. Visual Verification & E2E Testing Protocol

### 4.1 Playwright E2E Suite (`tests/app.spec.ts`)
- All 11 desktop screens and window interactions are covered by automated Playwright E2E tests:
  1. `01_studio_hub` — Studio Hub (Spline, Calendar, Focus Gauge, Campaigns)
  2. `02_content_studio` — Content Studio & Queue
  3. `03_lead_radar` — Lead Radar & CRM Prospects Table
  4. `04_social_stream` — Social Intent Stream & Proof Assets
  5. `05_growth_analytics` — Growth & Revenue Attribution
  6. `06_studio_settings` — Studio Settings & Spring Toggles
  7. `07_daily_sprint` — Daily 15-Minute Marketing Sprint
  8. `08_client_audit` — Modernization Audit Report
  9. `09_modal_new_post` — Create New Post Composer Modal
  10. `10_modal_proposal` — Send Client Proposal Modal
  11. `11_micro_components` — Local Workspace Popover & Toast Container
  12. *Window Controls Verification* — Native Minimize, Maximize, and Close Dialogs

### 4.2 Squint Test & Optical Alignment Rule
- After any UI mutation, agents run:
  ```bash
  zap proxy npx playwright test
  ```
- Agents inspect the resulting screenshots in `./screenshots/` (or the configured `SCREENSHOT_DIR`) to verify optical centering, padding, and zero text truncation.

---

## 5. Preparing for Real Data Integration

When the user gives the instruction to connect real live data:

1. **Lead Radar & Prospect Store**:
   - Primary data file: `leads/leads.json` (accessible via `window.electronAPI.getLeads()`).
   - Schema: `Lead` (`src/types.ts`) (`id`, `name`, `domain`, `category`, `healthScore`, `healthStatus`, `vulnerability`, `monthlyVisitors`, `opportunityValue`).
2. **Social Stream & Inquiries**:
   - Schema: `SocialIntent` (`src/types.ts`) (`authorName`, `authorHandle`, `platform`, `content`, `matchScore`, `estimatedBudget`).
3. **Queue & Draft Persistence**:
   - Schema: `QueuedPost` (`src/types.ts`) (`title`, `channel`, `scheduledTime`, `charCount`, `status`, `content`).
4. **Local-First Storage Guarantee**:
   - All records remain strictly on the user's local disk with zero external tracking or cloud lock-in.
