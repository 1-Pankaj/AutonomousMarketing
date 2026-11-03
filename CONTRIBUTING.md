# Contributing to AutoMarket Studio

Thank you for your interest in contributing to AutoMarket Studio! We welcome community contributions that help solo founders, consultants, and engineers streamline their marketing with clean, private, and beautifully crafted software.

---

## 1. Core Principles

Before submitting a pull request, please review these foundational rules that guide the project:

### 1.1 Strictly Self-Hosted (No Cloud / No User Auth)
- The application is 100% local-first and offline-capable.
- **Never add user login, signup flows, session cookies, JWT handlers, or cloud authentication.**
- All user data belongs exclusively on the user's machine (stored in local files such as `leads/leads.json`).

### 1.2 Plain Business English (Anti-Jargon)
- All user-facing copy must read like natural, professional business English.
- Avoid tech buzzwords, AI hype, and robotic terminology.
  - Use **publish**, **schedule**, or **send** instead of *dispatch*.
  - Use **studio**, **tool**, or **system** instead of *engine* or *synthesizer*.
  - Use **review**, **summary**, or **breakdown** instead of *teardown*.
  - Use **suggested message** or **client message** instead of *outreach pitch*.

### 1.3 Zero AI Gimmicks
- **No Sparkles / Stars (`✨`)**: Strictly prohibited.
- **No Decorative Status Dots**: Never place colored dots before plain descriptive text. Colored indicators are reserved exclusively for live system or network states.

### 1.4 Typography & Readability (Minimum 12px)
- **Absolute Floor**: No font size below 12px (`text-xs`) is permitted anywhere in the app.
- Classes like `text-[9px]`, `text-[10px]`, or `text-[11px]` will fail code review.

---

## 2. Apple Human Interface Guidelines & Motion

Our interface adheres to Apple Human Interface Guidelines for desktop apps:

1. **Fluid Spring Dynamics**: Use Framer Motion / Motion springs (`stiffness: 450`, `damping: 30`, `mass: 1`) instead of linear or ease-in-out CSS transitions.
2. **Tactile Micro-Interactions**: All interactive surfaces must provide subtle press states:
   ```tsx
   <motion.button
     whileHover={{ scale: 1.03 }}
     whileTap={{ scale: 0.95 }}
     transition={{ type: 'spring', stiffness: 450, damping: 25 }}
   >
     ...
   </motion.button>
   ```
3. **Desktop Window Discipline**:
   - The `Escape` key must exclusively dismiss open modals, sheets, and popovers. It must never exit window maximization.
   - Titlebar drag regions must use `-webkit-app-region: drag`, and all nested buttons must set `style={{ WebkitAppRegion: 'no-drag' }}`.

---

## 3. Development Workflow

### 3.1 Setup
```bash
git clone https://github.com/1-pankaj/AutoMarketStudio.git
cd AutoMarketStudio
npm install
npm run dev
```

#### AI Pair-Programming Skills for Contributors
If you develop or review code using AI coding agents (Antigravity, Cursor, Claude Code, Windsurf), install the design and animation skills:
```bash
# Apple HIG desktop design standards
npx skills add dickwu/apple-design-skill

# Fluid motion, spring dynamics & UI polish
npx skills@latest add emilkowalski/skills
```

### 3.2 Pre-Submission Verification
Before opening a pull request, ensure that all checks pass cleanly:

1. **TypeScript Typecheck**:
   ```bash
   npm run lint
   ```
2. **Production Build**:
   ```bash
   npm run build
   ```
3. **Playwright E2E Test Suite**:
   ```bash
   npm run test:e2e
   ```

---

## 4. Pull Request Checklist

When submitting a PR, please ensure:
- [ ] No cloud auth or login screens have been introduced.
- [ ] All copy uses plain, natural human business English (no prohibited words).
- [ ] No sparkle icons or decorative fake dots are present.
- [ ] No typography below 12px (`text-xs`) has been added.
- [ ] Interactive elements feature fluid spring feedback.
- [ ] `npm run lint` and `npm run test:e2e` pass with 0 errors.
- [ ] Commits are clean, descriptive, and atomic.
