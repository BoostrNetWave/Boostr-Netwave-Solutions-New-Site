const express = require('express');
const router = express.Router();

const Service = require('../models/Service');
const Product = require('../models/Product');
const ClientProject = require('../models/ClientProject');
const Blog = require('../models/Blog');
const Career = require('../models/Career');

const BASE_URL = process.env.PUBLIC_SITE_URL || 'https://boostrnetwave.com';

router.get('/sitemap.xml', async (req, res) => {
  try {
    const [services, products, projects, posts, careers] = await Promise.all([
      Service.find({}, 'slug updatedAt'),
      Product.find({}, 'slug updatedAt'),
      ClientProject.find({ isVisible: true }, 'slug updatedAt'),
      Blog.find({ isPublished: true }, 'slug updatedAt'),
      Career.find({ isActive: true }, 'slug updatedAt'),
    ]);

    const staticRoutes = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/services', priority: '0.9', changefreq: 'weekly' },
      { url: '/products', priority: '0.9', changefreq: 'weekly' },
      { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/careers', priority: '0.7', changefreq: 'weekly' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    ];

    const dynamicRoutes = [
      ...services.map((s) => ({ url: `/services/${s.slug}`, updatedAt: s.updatedAt, priority: '0.8' })),
      ...products.map((p) => ({ url: `/products/${p.slug}`, updatedAt: p.updatedAt, priority: '0.8' })),
      ...projects.map((c) => ({ url: `/case-studies/${c.slug}`, updatedAt: c.updatedAt, priority: '0.7' })),
      ...posts.map((b) => ({ url: `/blog/${b.slug}`, updatedAt: b.updatedAt, priority: '0.6' })),
      ...careers.map((j) => ({ url: `/careers/${j.slug}`, updatedAt: j.updatedAt, priority: '0.6' })),
    ];

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.url}</loc>
    ${r.updatedAt ? `<lastmod>${new Date(r.updatedAt).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap Generation Error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml`);
});

module.exports = router;
