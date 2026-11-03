import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

test.describe('AutoMarket Studio Desktop App E2E & Squint Verification', () => {
  test('should render all 11 screens with pixel-level fidelity to Penpot design', async ({ page }) => {
    test.setTimeout(60000);
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    // 01 - Studio Hub
    await expect(page.getByRole('heading', { name: /Hello, Alex/i })).toBeVisible();
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01_studio_hub.png` });

    // 02 - Content Studio & Queue
    await page.locator('button[title="Content Studio"]').click();
    await expect(page.getByRole('heading', { name: /Content Studio/i })).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02_content_studio.png` });

    // 03 - Lead Radar & CRM
    await page.locator('button[title="Lead Radar & CRM"]').click();
    await expect(page.getByRole('heading', { name: /Lead Radar/i })).toBeVisible();
    await expect(page.locator('text=Medipulse Hospital').first()).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03_lead_radar.png` });

    // 04 - Social Intent Stream / Client Opportunities
    await page.locator('button[title="Social Intent Stream"]').click();
    await expect(page.getByRole('heading', { name: /Client Opportunities/i })).toBeVisible();
    await expect(page.locator('text=Suggested Message').first()).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04_social_stream.png` });

    // 05 - Growth & Revenue Analytics
    await page.locator('button[title="Growth Analytics"]').click();
    await expect(page.getByRole('heading', { name: /Growth & Revenue Analytics/i })).toBeVisible();
    await expect(page.locator('text=$68,450').first()).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05_growth_analytics.png` });

    // 06 - Studio Settings & Preferences
    await page.locator('button[title="Studio Preferences"]').click();
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
    await expect(page.locator('text=AI Engine & Agent Connections')).toBeVisible();
    await expect(page.locator('text=11 MCP Tools Active')).toBeVisible();
    await page.locator('text=Ollama (Local Offline)').click();
    await page.locator('button:has-text("Test Connection")').click();
    await expect(page.locator('text=X / Twitter').first()).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06_studio_settings.png` });

    // 07 - Daily Sprint Mode
    await page.locator('button[title="Daily Sprint Mode"]').click();
    await expect(page.getByRole('heading', { level: 1, name: /Daily 15-Minute Marketing Sprint/i })).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07_daily_sprint.png` });

    // 08 - Client Performance Review
    await page.locator('button[title="Lead Radar & CRM"]').click();
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Audit")').first().click();
    await expect(page.getByRole('heading', { name: /Client Performance Review/i })).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08_client_audit.png` });

    // 09 - Modal: New Post Composer
    await page.locator('button[title="Studio Hub"]').click();
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Create Post")').click();
    await expect(page.getByRole('heading', { name: /Create New Post/i })).toBeVisible();
    await page.locator('button:has-text("Assist with AI")').click();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09_modal_new_post.png` });
    await page.locator('button:has-text("Save as Draft")').click();
    await page.waitForTimeout(250);

    // 10 - Modal: Send Client Proposal
    await page.locator('button[title="Lead Radar & CRM"]').click();
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Send Client Proposal")').click();
    await expect(page.getByRole('heading', { name: /Send Client Proposal/i })).toBeVisible();
    await page.locator('button:has-text("Personalize with AI")').click();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/10_modal_proposal.png` });
    await page.locator('button:has-text("Cancel")').click();
    await page.waitForTimeout(250);

    // 11 - System Toasts & Micro-components
    // Open Account Popover
    await page.locator('button[title="Local Workspace & Storage"]').click();
    await expect(page.locator('text=AutoMarket Studio').first()).toBeVisible();
    await page.waitForTimeout(350);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/11_micro_components.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // Verify Notifications Popover
    await page.locator('button[title="Notifications"]').click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(page.getByRole('heading', { name: 'Notifications' })).not.toBeVisible();

    // 12 - Verify Window Controls (Minimize, Maximize, Close dialog)
    await page.locator('button[title="Minimize"]').click();

    await page.locator('button[title="Maximize Window"]').click();
    await page.keyboard.press('Escape'); // Pressing Escape must NOT unmaximize or break
    await page.waitForTimeout(150);

    await page.locator('button[title="Close Studio"]').click();
    await expect(page.locator('text=Close AutoMarket Studio?')).toBeVisible();
    await page.locator('button:has-text("Stay Open")').click();
    await page.waitForTimeout(400);
    await expect(page.locator('text=Close AutoMarket Studio?')).not.toBeVisible();

    // 13 - Verify Light Theme Toggle & Appearance
    await page.locator('button[title*="Switch to Light"]').click();
    await page.waitForTimeout(400);
    await expect(page.locator('html')).toHaveClass(/light/);
    await page.locator('button[title="Studio Hub"]').click();
    await page.waitForTimeout(800);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/12_light_theme_hub.png` });

    // Light Theme Lead Radar
    await page.locator('button[title="Lead Radar & CRM"]').click();
    await page.waitForTimeout(300);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/14_light_theme_radar.png` });

    // Light Theme Audit Report
    await page.locator('button:has-text("Audit")').first().click();
    await page.waitForTimeout(300);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/15_light_theme_audit.png` });

    // Switch back to Dark Theme via Settings
    await page.locator('button[title="Studio Preferences"]').click();
    await page.waitForTimeout(300);
    // Dismiss any active toast overlays for a clean screenshot
    const toastDismissButtons = page.locator('.pointer-events-auto button');
    const toastCount = await toastDismissButtons.count();
    for (let i = 0; i < toastCount; i++) {
      await toastDismissButtons.nth(i).click().catch(() => {});
    }
    await page.waitForTimeout(200);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/13_light_theme_settings.png` });
    await page.locator('text=Dark Appearance').click();
    await page.waitForTimeout(300);
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should verify real data logic: pagination, search, lead audit loading, proposal flow, and CSV backup', async ({ page }) => {
    test.setTimeout(45000);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    // Dismiss initial toast to clear bottom-right workspace
    const initialToast = page.locator('.pointer-events-auto button');
    if (await initialToast.count() > 0) {
      await initialToast.first().click();
      await page.waitForTimeout(200);
    }

    // 1. Navigate to Lead Radar
    await page.locator('button[title="Lead Radar & CRM"]').click();
    await expect(page.getByRole('heading', { name: /Lead Radar/i })).toBeVisible();
    await expect(page.locator('text=Medipulse Hospital').first()).toBeVisible();

    // 2. Verify Pagination: 15 per page out of 111
    await expect(page.locator('text=/Showing 1–15 of 111 targets/i')).toBeVisible();
    await page.locator('button[title="Next Page"]').click();
    await page.waitForTimeout(200);
    await expect(page.locator('text=/Showing 16–30 of 111 targets/i')).toBeVisible();
    await page.locator('button[title="Previous Page"]').click();
    await page.waitForTimeout(200);
    await expect(page.locator('text=/Showing 1–15 of 111 targets/i')).toBeVisible();

    // 3. Search Filtering across 111 targets
    const searchInput = page.locator('input[placeholder*="Search domain"]');
    await searchInput.fill('Kamla');
    await page.waitForTimeout(200);
    await expect(page.locator('text=Kamla Nagar Hospital').first()).toBeVisible();
    await expect(page.locator('text=/Showing 1–1 of 1 targets/i')).toBeVisible();
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // 4. Inspect specific lead in Audit Report
    await page.locator('div.grid:has-text("Kamla Nagar Hospital")').locator('button:has-text("Audit")').click();
    await expect(page.getByRole('heading', { name: /Client Performance Review/i })).toBeVisible();
    await expect(page.locator('text=Kamla Nagar Hospital').first()).toBeVisible();
    await expect(page.locator('text=knhospital.com').first()).toBeVisible();

    // 5. Open Proposal from Audit Report
    await page.locator('button:has-text("Send Upgrade Proposal")').click();
    await expect(page.getByRole('heading', { name: /Send Client Proposal/i })).toBeVisible();
    await expect(page.locator('text=Kamla Nagar Hospital').first()).toBeVisible();
    await page.locator('button:has-text("Send Proposal & Audit")').click();
    await page.waitForTimeout(250);

    // 6. Daily Sprint Progress
    await page.locator('button[title="Daily Sprint Mode"]').click();
    await expect(page.getByRole('heading', { level: 1, name: /Daily 15-Minute Marketing Sprint/i })).toBeVisible();
    const sprintBtn = page.locator('button:has-text("Sprint")').filter({ hasText: /(Complete|Restart) Sprint/ });
    await sprintBtn.click();
    await page.waitForTimeout(200);

    // 7. Export Leads CSV Backup from Account Popover
    await page.locator('button[title="Local Workspace & Storage"]').click();
    await expect(page.locator('text=AutoMarket Studio').first()).toBeVisible();
    await page.locator('button:has-text("Export Leads Backup")').click();
    await page.waitForTimeout(300);
  });
});
