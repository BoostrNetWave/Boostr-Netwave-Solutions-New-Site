import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { preview } from 'vite';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
let PREVIEW_URL = 'http://localhost:4173';

// Retry helper — retries up to `retries` times with a delay between attempts.
// Prevents silently baking broken pages when the backend is slow to start during build.
async function withRetry(fn, retries = 3, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i < retries - 1) {
        console.warn(`  ⚠️  Attempt ${i + 1} failed: ${err.message}. Retrying in ${delayMs}ms...`);
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
}

async function getDynamicRoutes() {
  const routes = ['/', '/about', '/contact', '/services', '/products', '/case-studies', '/careers', '/blog', '/team'];

  try {
    // Retry API fetches up to 3 times — handles slow backend startup during CI
    const [services, products, cases, careers, blogs] = await withRetry(() =>
      Promise.all([
        axios.get(`${API_URL}/services`, { timeout: 15000 }),
        axios.get(`${API_URL}/products`, { timeout: 15000 }),
        axios.get(`${API_URL}/client-projects`, { timeout: 15000 }),
        axios.get(`${API_URL}/careers`, { timeout: 15000 }),
        axios.get(`${API_URL}/blog`, { timeout: 15000 }),
      ])
    );

    services.data.data?.forEach(item => item.slug && routes.push(`/services/${item.slug}`));
    products.data.data?.forEach(item => item.slug && routes.push(`/products/${item.slug}`));
    cases.data.data?.forEach(item => item.slug && routes.push(`/case-studies/${item.slug}`));
    careers.data.data?.forEach(item => item.slug && routes.push(`/careers/${item.slug}`));

    const blogData = blogs.data.data?.posts || blogs.data.data || [];
    blogData.forEach(item => {
      if (item.isPublished && item.slug) routes.push(`/blog/${item.slug}`);
    });

  } catch (err) {
    console.error('❌ Failed to fetch dynamic routes after 3 retries:', err.message);
    console.warn('⚠️  Prerendering static routes only — dynamic slug pages will be client-rendered.');
  }

  return [...new Set(routes)]; // deduplicate
}

async function prerender() {
  console.log('🚀 Starting static prerendering...');

  const routes = await getDynamicRoutes();
  console.log(`📌 Found ${routes.length} routes to prerender.`);

  // BUG 1 FIX: Generate sitemap.xml UNCONDITIONALLY, before Playwright even tries to launch
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>\n    <loc>https://boostrnetwave.com${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;
  // Ensure dist exists before writing sitemap
  fs.mkdirSync(path.join(process.cwd(), 'dist'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'dist', 'sitemap.xml'), sitemapXml);
  console.log('  ✅ Generated sitemap.xml');

  // Add the 404 route for prerendering AFTER sitemap is generated (we don't want /404 in the sitemap)
  const prerenderRoutes = [...routes, '/404'];

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    console.warn(`⚠️  Playwright Chromium not available (${err.message}).`);
    console.warn('   Skipping prerender step — standard client-side bundle is built and ready in dist/.');
    return;
  }
  const context = await browser.newContext();

  console.log('Spinning up Vite preview server...');
  const previewServer = await preview({ preview: { port: 4173 } });
  PREVIEW_URL = previewServer.resolvedUrls.local[0];
  console.log(`Preview server running at ${PREVIEW_URL}`);

  let success = 0;
  let failed = 0;

  for (const route of prerenderRoutes) {
    const page = await context.newPage();
    console.log(`Prerendering ${route}...`);

    try {
      await page.goto(`${PREVIEW_URL}${route === '/' ? '' : route}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait for React loading spinners to disappear (catches async data fetches)
      await page.waitForFunction(
        () => !document.querySelector('.animate-spin'),
        { timeout: 15000 }
      ).catch(() =>
        console.warn(`    ⚠️  Spinner still present after 15s on ${route} — capturing anyway.`)
      );

      await page.waitForTimeout(300);

      const html = await page.content();

      // Content integrity check — warn if captured HTML looks like a skeleton/loading state
      if (html.length < 1000) {
        console.warn(`    ⚠️  WARNING: ${route} only ${html.length} bytes — may be a loading skeleton! Skipping.`);
        failed++;
      } else {
        let relativePath;
        if (route === '/') {
          relativePath = 'index.html';
        } else if (route === '/404') {
          relativePath = '404.html';
        } else {
          relativePath = `${route}/index.html`;
        }

        const filePath = path.join(process.cwd(), 'dist', relativePath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, html);
        console.log(`  ✅ Saved ${route} (${Math.round(html.length / 1024)}KB)`);
        success++;
      }
    } catch (err) {
      console.error(`  ❌ Failed to prerender ${route}:`, err.message);
      failed++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  previewServer.httpServer.close();

  console.log(`\n🎉 Prerendering complete! ✅ ${success} succeeded, ❌ ${failed} failed.`);
  if (failed > 0) {
    console.warn('⚠️  Some pages failed. Check output above — those routes fall back to client-side rendering.');
  }
}

prerender();
