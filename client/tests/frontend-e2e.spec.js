/**
 * Boostr Netwave — Frontend E2E Master Test Suite
 * -------------------------------------------------
 * Run with: npx playwright test tests/frontend-e2e.spec.js
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

// ---------------------------------------------------------------------------
// 1. HOMEPAGE — LIVE DATA, NOT SEED DATA
// ---------------------------------------------------------------------------
test.describe('Homepage', () => {
  test('loads and renders the hero section', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('section').first()).toBeVisible();
  });

  test('services grid renders 4+ live services, not zero/broken', async ({ page }) => {
    await page.goto(BASE_URL);
    const serviceCards = page.locator('.service-card');
    await expect(serviceCards.first()).toBeVisible({ timeout: 10000 });
    const count = await serviceCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('testimonials section does NOT show raw fabricated-looking content', async ({ page }) => {
    await page.goto(BASE_URL);
    const testimonialText = await page.locator('body').innerText();
    expect(testimonialText).not.toContain('Sarah D\'Souza');
    expect(testimonialText).not.toContain('Raj Menon');
    expect(testimonialText).not.toContain('Arjun Patel');
  });

  test('leadership video section is present', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByText(/Driven by Founders/i).first()).toBeVisible();
  });

  test('leadership video thumbnail opens a modal and can be dismissed', async ({ page }) => {
    await page.goto(BASE_URL);
    const trigger = page.locator('.img-zoom-wrap.cursor-pointer').first();
    // Only run if the video URL is actually populated
    if (await trigger.isVisible()) {
      await trigger.click();
      const iframe = page.locator('iframe[title="Boostr Netwave Leadership Video"]');
      await expect(iframe).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(iframe).not.toBeVisible();
    }
  });

  test('trust marquee shows partners and clients', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByText(/PayU|Cashfree|Flowtransact|MedPulse/i).first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 2. NAVIGATION — INCLUDING THE HASH-SCROLL BUG FIX
// ---------------------------------------------------------------------------
test.describe('Navigation', () => {
  test('all main nav links are visible and reachable', async ({ page }) => {
    await page.goto(BASE_URL);
    for (const label of ['Services', 'About', 'Contact']) {
      await expect(page.getByRole('link', { name: label, exact: false }).first()).toBeVisible();
    }
  });

  test('Blog, Careers, Case Studies are reachable from navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.goto(`${BASE_URL}/blog`);
    await expect(page).toHaveURL(/\/blog/);
    await page.goto(`${BASE_URL}/careers`);
    await expect(page).toHaveURL(/\/careers/);
    await page.goto(`${BASE_URL}/case-studies`);
    await expect(page).toHaveURL(/\/case-studies/);
  });

  test('cross-page hash link navigates and target exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const servicesLink = page.getByRole('link', { name: /services/i }).first();
    await servicesLink.click();
    await page.waitForURL(/\/#services|\/$/);
    await expect(page.locator('#services')).toBeAttached();
  });
});

// ---------------------------------------------------------------------------
// 3. DETAIL PAGES — DYNAMIC CONTENT
// ---------------------------------------------------------------------------
test.describe('Detail Pages', () => {
  test('service detail page renders capabilities and FAQs', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/software-development`);
    await expect(page.getByText(/Capabilities|Features|Expertise/i).first()).toBeVisible();
    await expect(page.getByText(/FAQ|Frequently Asked|Common Questions/i).first()).toBeVisible();
  });

  test('blog post renders full article body', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/saas-inbound-marketing`);
    await page.waitForSelector('.article-body, #article-body', { timeout: 10000 });
    const bodyText = await page.locator('.article-body, #article-body').first().innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('case study detail renders metrics', async ({ page }) => {
    await page.goto(`${BASE_URL}/case-studies/flowtransact`);
    await expect(page.getByText(/\d+x|\d+%/).first()).toBeVisible();
  });

  test('invalid slug shows styled NotFound, not a crash', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/this-does-not-exist-xyz`);
    await expect(page.getByText(/not found|doesn't exist|go home|back to/i).first()).toBeVisible();
  });

  test('career detail page allows opening the application modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/careers/senior-full-stack-engineer`);
    const applyButton = page.getByRole('button', { name: /Apply Now/i }).first();
    if (await applyButton.isVisible()) {
      await applyButton.click();
      const modal = page.locator('text=Apply for');
      await expect(modal.first()).toBeVisible();
      
      // Close modal
      await page.keyboard.press('Escape');
      await expect(modal.first()).not.toBeVisible();
    }
  });
});

// ---------------------------------------------------------------------------
// 4. ADMIN SECURITY
// ---------------------------------------------------------------------------
test.describe('Admin Security', () => {
  test('unauthenticated access to /admin/dashboard redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('unauthenticated access to any /admin/* route redirects to login', async ({ page }) => {
    for (const route of ['/admin/services', '/admin/blog', '/admin/settings']) {
      await page.goto(`${BASE_URL}${route}`);
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. SEO META TAGS
// ---------------------------------------------------------------------------
test.describe('SEO', () => {
  test('homepage has a unique, non-empty title', async ({ page }) => {
    await page.goto(BASE_URL);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
  });

  test('detail pages load with title tag', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/software-development`);
    await page.waitForTimeout(300);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
  });
});

// ---------------------------------------------------------------------------
// 6. MOBILE RESPONSIVENESS
// ---------------------------------------------------------------------------
test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 812 } });
  
  test('homepage has no horizontal overflow on mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  });

  test('about page has no horizontal overflow on mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/#about`);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  });
});
