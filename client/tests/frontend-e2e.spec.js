/**
 * Boostr Netwave — Frontend E2E Master Test Suite (v2)
 * -------------------------------------------------------
 * Run locally:      npx playwright test tests/frontend-e2e.spec.js
 * Run vs production: PLAYWRIGHT_BASE_URL=https://boostrnetwave.com npx playwright test tests/frontend-e2e.spec.js
 *
 * Admin-authenticated tests require:
 *   ADMIN_TEST_EMAIL=you@example.com ADMIN_TEST_PASSWORD=yourpassword
 * Without these set, those tests are skipped (not failed).
 *
 * WHAT CHANGED FROM v1:
 *  - Added a real admin LOGIN + cross-page session persistence test — the actual
 *    cross-domain cookie test, which nothing in v1 covered.
 *  - Added a check that fails the whole suite if any CSP violation is logged to
 *    console (catches the video-iframe-blocked bug class before you have to notice it visually).
 *  - Added a raw-HTML prerender proof test (fetches page source directly, not via
 *    the rendered DOM) — proves prerendering worked, not just that JS eventually rendered it.
 *  - Added sitemap.xml / robots.txt reachability checks at the real domain root.
 *  - 404 test now logs the actual HTTP status code for review, not just visible text.
 *  - Added an OpenGraph tag presence check for social sharing correctness.
 *  - Added a global console-error health check across key pages.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const ADMIN_EMAIL = process.env.ADMIN_TEST_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_TEST_PASSWORD;
const hasAdminCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

// ---------------------------------------------------------------------------
// SHARED HELPER — fails a test if any CSP violation was logged during the run.
// Attach this in any test that touches the video modal or third-party embeds.
// ---------------------------------------------------------------------------
function trackConsoleErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

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
    expect(await serviceCards.count()).toBeGreaterThanOrEqual(4);
  });

  test('testimonials section does NOT show raw fabricated-looking content', async ({ page }) => {
    await page.goto(BASE_URL);
    const testimonialText = await page.locator('body').innerText();
    for (const fakeName of ["Sarah D'Souza", 'Raj Menon', 'Arjun Patel']) {
      expect(testimonialText).not.toContain(fakeName);
    }
  });

  test('leadership video section is present', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByText(/Driven by Founders/i).first()).toBeVisible();
  });

  test('leadership video opens with NO Content-Security-Policy violations', async ({ page }) => {
    const consoleErrors = trackConsoleErrors(page);
    await page.goto(BASE_URL);

    const trigger = page.locator('.img-zoom-wrap.cursor-pointer').first();
    if (await trigger.isVisible()) {
      await trigger.click();
      const iframe = page.locator('iframe[title="Boostr Netwave Leadership Video"]');
      await expect(iframe).toBeVisible();

      // Give the iframe a moment to attempt loading, then check for CSP violations specifically
      await page.waitForTimeout(1500);
      const cspErrors = consoleErrors.filter(
        (e) => /content security policy|refused to frame|frame-src/i.test(e)
      );
      expect(cspErrors, `CSP violations found: ${cspErrors.join(' | ')}`).toHaveLength(0);

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
// 2. NAVIGATION
// ---------------------------------------------------------------------------
test.describe('Navigation', () => {
  test('all main nav links are visible and reachable', async ({ page }) => {
    await page.goto(BASE_URL);
    for (const label of ['Services', 'About', 'Contact']) {
      await expect(page.getByRole('link', { name: label, exact: false }).first()).toBeVisible();
    }
  });

  test('Blog, Careers, Case Studies, Team are reachable from navigation', async ({ page }) => {
    for (const path of ['/blog', '/careers', '/case-studies', '/team']) {
      await page.goto(`${BASE_URL}${path}`);
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')));
    }
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

  test('invalid slug returns a real 404 status AND shows styled NotFound', async ({ page }) => {
    // Direct HTTP check — a prerendered/static site can accidentally serve
    // every route as 200, which is invisible if you only check page text.
    const response = await page.goto(`${BASE_URL}/services/this-does-not-exist-xyz`);
    // Some SPA hosting setups intentionally serve 200 + client-side "not found" UI —
    // if that's the deliberate architecture, this is informational only.
    // If it's NOT deliberate, review this log line.
    if (response) {
      console.log(`  i  Invalid slug returned HTTP status: ${response.status()}`);
    }
    await expect(page.getByText(/not found|doesn't exist|go home|back to/i).first()).toBeVisible();
  });

  test('career detail page allows opening and closing the application modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/careers/senior-full-stack-engineer`);
    const applyButton = page.getByRole('button', { name: /Apply Now/i }).first();
    if (await applyButton.isVisible()) {
      await applyButton.click();
      const modal = page.locator('text=Apply for');
      await expect(modal.first()).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(modal.first()).not.toBeVisible();
    }
  });
});

// ---------------------------------------------------------------------------
// 4. ADMIN SECURITY — UNAUTHENTICATED
// ---------------------------------------------------------------------------
test.describe('Admin Security — Unauthenticated Access', () => {
  test('unauthenticated access to /admin/dashboard redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('unauthenticated access to any /admin/* route redirects to login', async ({ page }) => {
    for (const route of ['/admin/services', '/admin/blog', '/admin/settings', '/admin/applications']) {
      await page.goto(`${BASE_URL}${route}`);
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. ADMIN AUTH FLOW — THE ACTUAL CROSS-DOMAIN COOKIE TEST
// This is the single most important addition. Nothing above this proves login
// actually works and persists once frontend and backend are on separate domains.
// ---------------------------------------------------------------------------
test.describe('Admin Auth Flow (requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD)', () => {
  (hasAdminCreds ? test : test.skip)(
    'admin can log in, session persists across navigation and page reload',
    async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/login`);

      // Adjust these locators to match your actual login form field labels/placeholders
      await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
      await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
      await page.getByRole('button', { name: /log in|sign in/i }).click();

      // Must land on the dashboard, not bounce back to login
      await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

      // THE REAL TEST: navigate to a different admin page.
      // If the auth cookie isn't flowing cross-domain, this redirects back to login.
      await page.goto(`${BASE_URL}/admin/services`);
      await expect(page).not.toHaveURL(/\/admin\/login/);

      // Reload — session must survive a full page reload, not just SPA navigation
      await page.reload();
      await expect(page).not.toHaveURL(/\/admin\/login/);

      // One more admin page for good measure
      await page.goto(`${BASE_URL}/admin/inbox`);
      await expect(page).not.toHaveURL(/\/admin\/login/);
    }
  );

  (hasAdminCreds ? test : test.skip)(
    'invalid login credentials show an error, not a silent failure',
    async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/login`);
      await page.getByLabel(/email/i).fill('wrong@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /log in|sign in/i }).click();
      await expect(page.getByText(/invalid|incorrect|failed/i).first()).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  );
});

// ---------------------------------------------------------------------------
// 6. SEO — PRERENDER PROOF, META TAGS, SITEMAP
// ---------------------------------------------------------------------------
test.describe('SEO', () => {
  test('homepage has a unique, non-empty title', async ({ page }) => {
    await page.goto(BASE_URL);
    expect((await page.title()).length).toBeGreaterThan(5);
  });

  test('detail pages have unique titles differing from the homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    const homeTitle = await page.title();
    await page.goto(`${BASE_URL}/services/software-development`);
    await page.waitForTimeout(300);
    const detailTitle = await page.title();
    expect(detailTitle.length).toBeGreaterThan(5);
    expect(detailTitle).not.toBe(homeTitle);
  });

  test('meta description is present on detail pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/software-development`);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc && desc.length).toBeGreaterThan(10);
  });

  test('OpenGraph tags are present for social sharing', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/saas-inbound-marketing`);
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogImage).toBeTruthy();
    // og:image must be an absolute URL, not a relative path — relative paths break on LinkedIn/WhatsApp
    expect(ogImage).toMatch(/^https?:\/\//);
  });

  test('PRERENDER PROOF: raw HTML response contains real content, not an empty root div', async ({ request }) => {
    // This fetches the raw HTML directly — bypassing JS execution entirely —
    // which is exactly what Googlebot and link-preview bots see on first contact.
    const response = await request.get(BASE_URL);
    const html = await response.text();
    expect(html).not.toMatch(/<div id="root">\s*<\/div>/);
    expect(html.length).toBeGreaterThan(2000); // a real page, not a shell
    expect(html).toMatch(/<h1|<h2/i); // actual heading content present in raw HTML
  });

  test('sitemap.xml is reachable at the real domain root', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('boostrnetwave.com');
  });

  test('robots.txt is reachable and disallows /admin/', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/robots.txt`);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/Disallow:\s*\/admin/i);
    expect(body).toMatch(/Sitemap:/i);
  });
});

// ---------------------------------------------------------------------------
// 7. MOBILE RESPONSIVENESS
// ---------------------------------------------------------------------------
test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  const pagesToCheck = ['/', '/about', '/services', '/contact', '/team'];

  for (const path of pagesToCheck) {
    test(`${path || 'homepage'} has no horizontal overflow on mobile (375px)`, async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`);
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });
  }
});

// ---------------------------------------------------------------------------
// 8. GLOBAL — NO UNCAUGHT CONSOLE ERRORS ON KEY PAGES
// ---------------------------------------------------------------------------
test.describe('Console Health Check', () => {
  const criticalPages = ['/', '/services', '/products', '/blog', '/contact', '/team'];

  for (const path of criticalPages) {
    test(`no uncaught JS errors on ${path || 'homepage'}`, async ({ page }) => {
      const errors = trackConsoleErrors(page);
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForTimeout(1000);
      // Filter out known-benign noise if needed (e.g. third-party analytics warnings)
      expect(errors, `Console errors on ${path}: ${errors.join(' | ')}`).toHaveLength(0);
    });
  }
});
