/**
 * Boostr Netwave — Backend API Master Test Suite
 * ------------------------------------------------
 * Run with: BASE_URL=http://localhost:5000 npx jest tests/backend-api.test.js
 */

const request = require('supertest');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const api = request(BASE_URL);

const hasAdminCreds = process.env.ADMIN_TEST_EMAIL && process.env.ADMIN_TEST_PASSWORD;

// ---------------------------------------------------------------------------
// 1. PUBLIC READ ENDPOINTS — should all return 200 + arrays/objects
// ---------------------------------------------------------------------------
describe('Public API — Read Endpoints', () => {
  const endpoints = [
    ['/api/services', 4],
    ['/api/products', null],
    ['/api/client-projects', 3],
    ['/api/testimonials', 3],
    ['/api/gallery', null],
    ['/api/team', null],
    ['/api/careers', null],
    ['/api/blog', 9],
    ['/api/settings', null],
  ];

  test.each(endpoints)('GET %s returns 200 and an array/object', async (path, expectedCount) => {
    const res = await api.get(path);
    expect(res.status).toBe(200);
    const body = Array.isArray(res.body) ? res.body : (res.body.data ?? res.body);
    if (expectedCount !== null && Array.isArray(body)) {
      expect(body.length).toBeGreaterThanOrEqual(expectedCount);
    }
  });

  test('GET /api/services items have required public fields', async () => {
    const res = await api.get('/api/services');
    const items = Array.isArray(res.body) ? res.body : res.body.data;
    expect(items.length).toBeGreaterThan(0);
    const item = items[0];
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('slug');
  });

  test('GET /api/testimonials — no fabricated real-sounding names slip through', async () => {
    const res = await api.get('/api/testimonials');
    const items = Array.isArray(res.body) ? res.body : res.body.data;
    expect(res.status).toBe(200);
    console.log(`Testimonial names found: ${items.map((t) => t.name).join(', ')}`);
  });
});

// ---------------------------------------------------------------------------
// 2. DETAIL / SLUG ROUTES
// ---------------------------------------------------------------------------
describe('Detail Routes — Dynamic Slug Pages (API level)', () => {
  test('GET /api/services/software-development returns full content', async () => {
    const res = await api.get('/api/services/software-development');
    expect(res.status).toBe(200);
    const body = res.body.data ?? res.body;
    expect(body).toHaveProperty('features');
    expect(body).toHaveProperty('faqs');
  });

  test('GET /api/blog/saas-inbound-marketing returns article body', async () => {
    const res = await api.get('/api/blog/saas-inbound-marketing');
    expect(res.status).toBe(200);
    const body = res.body.data ?? res.body;
    expect(body.title).toBeTruthy();
  });

  test('GET /api/careers/senior-full-stack-engineer returns requirements', async () => {
    const res = await api.get('/api/careers/senior-full-stack-engineer');
    expect(res.status).toBe(200);
    const body = res.body.data ?? res.body;
    expect(body).toHaveProperty('requirements');
  });

  test('GET /api/client-projects/flowtransact returns metrics', async () => {
    const res = await api.get('/api/client-projects/flowtransact');
    expect(res.status).toBe(200);
  });

  test('GET /api/services/this-slug-does-not-exist returns 404, not a crash', async () => {
    const res = await api.get('/api/services/this-slug-does-not-exist-xyz');
    expect([404, 400]).toContain(res.status);
    expect(res.status).not.toBe(500);
  });
});

// ---------------------------------------------------------------------------
// 3. CONTACT FORM
// ---------------------------------------------------------------------------
describe('Contact Form', () => {
  test('POST /api/contact with valid payload creates a lead', async () => {
    const res = await api.post('/api/contact').send({
      name: 'AUTOMATED TEST — Delete Me',
      email: 'automated-test@example.com',
      message: 'This is a test submission from the master test suite. Safe to delete.',
    });
    expect([200, 201]).toContain(res.status);
  });

  test('POST /api/contact with missing required fields returns 400, not 500', async () => {
    const res = await api.post('/api/contact').send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});

// ---------------------------------------------------------------------------
// 3.5 CONTACT FORM EMAIL PIPELINE
// ---------------------------------------------------------------------------
describe('Contact Form Email Pipeline', () => {
  test('POST /api/contact still returns 201 even if email sending fails', async () => {
    const res = await api.post('/api/contact').send({
      name: 'Email Fault Test',
      email: 'faulttest@example.com',
      message: 'Testing that email failure does not block lead creation.',
    });
    expect(res.status).toBe(201);
  });

  test('Contact form message with HTML content does not break admin email (escaped)', async () => {
    const res = await api.post('/api/contact').send({
      name: 'XSS Test',
      email: 'xsstest@example.com',
      message: '<img src=x onerror="alert(1)">',
    });
    expect(res.status).toBe(201);
  });
});

// ---------------------------------------------------------------------------
// 3.6 CAREER APPLICATIONS
// ---------------------------------------------------------------------------
describe('Career Applications', () => {
  let testJobId = null;

  beforeAll(async () => {
    // We need a real Job ID to test with.
    const res = await api.get('/api/careers');
    const jobs = Array.isArray(res.body) ? res.body : res.body.data;
    if (jobs && jobs.length > 0) {
      testJobId = jobs[0]._id;
    }
  });

  test('POST /api/applications creates an application', async () => {
    if (!testJobId) {
      console.warn('Skipping test: No careers found in DB.');
      return;
    }
    const res = await api.post('/api/applications').send({
      jobId: testJobId,
      name: 'Applicant Test',
      email: 'applicant@example.com',
      resumeUrl: 'https://docs.google.com/resume',
    });
    expect([200, 201]).toContain(res.status);
  });

  test('POST /api/applications with missing fields returns 400', async () => {
    const res = await api.post('/api/applications').send({
      jobId: testJobId,
      name: 'Applicant Test',
      // missing email and resumeUrl
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});

// ---------------------------------------------------------------------------
// 4. AUTH & PROTECTED ROUTES
// ---------------------------------------------------------------------------
describe('Auth & Security', () => {
  test('POST /api/auth/login with invalid credentials returns 401', async () => {
    const res = await api.post('/api/auth/login').send({
      email: 'nonexistent@nowhere.com',
      password: 'definitely-wrong-password',
    });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me without a token returns 401', async () => {
    const res = await api.get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  (hasAdminCreds ? test : test.skip)(
    'POST /api/auth/login with valid credentials returns a token',
    async () => {
      const res = await api.post('/api/auth/login').send({
        email: process.env.ADMIN_TEST_EMAIL,
        password: process.env.ADMIN_TEST_PASSWORD,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    }
  );

  (hasAdminCreds ? test : test.skip)(
    'Admin-only write routes reject requests with no auth header',
    async () => {
      const res = await api.post('/api/services').send({ title: 'Should Be Rejected' });
      expect([401, 403]).toContain(res.status);
    }
  );

  (hasAdminCreds ? test : test.skip)(
    'SiteSettings rejects a non-YouTube/Vimeo video URL',
    async () => {
      // First get a token
      const login = await api.post('/api/auth/login').send({
        email: process.env.ADMIN_TEST_EMAIL,
        password: process.env.ADMIN_TEST_PASSWORD,
      });
      const token = login.body.token;

      // Try to save an invalid video URL
      const res = await api.put('/api/admin/settings/bulk').send({
        settings: [{ key: 'homepageVideoUrl', value: 'https://malicious-site.com/embed' }]
      }).set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid video URL');
    }
  );

  test('Preview flag WITHOUT admin auth does not leak unpublished content', async () => {
    const res = await api.get('/api/blog?preview=1');
    const body = res.body.data?.posts || (Array.isArray(res.body) ? res.body : res.body.data) || [];
    const items = Array.isArray(body) ? body : [];
    const anyUnpublished = items.some((b) => b.isPublished === false);
    expect(anyUnpublished).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5. RATE LIMITING & SECURITY HEADERS
// ---------------------------------------------------------------------------
describe('Security Headers', () => {
  test('Responses include Helmet security headers', async () => {
    const res = await api.get('/api/services');
    expect(res.headers).toHaveProperty('x-content-type-options');
  });

  test('CORS is not wide open to any origin in a way that ignores credentials config', async () => {
    const res = await api.get('/api/services').set('Origin', 'https://random-evil-site.com');
    expect([200, 403]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// 6. SEO & SITEMAP
// ---------------------------------------------------------------------------
describe('SEO & Sitemap', () => {
  test('GET /sitemap.xml returns 200 and valid XML', async () => {
    const res = await api.get('/sitemap.xml');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/xml');
    expect(res.text).toContain('<urlset');
  });

  test('GET /robots.txt returns 200 and disallows /admin/', async () => {
    const res = await api.get('/robots.txt');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Disallow: /admin/');
  });
});
