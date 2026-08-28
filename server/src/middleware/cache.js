const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Default TTL 5 mins

/**
 * Cache Middleware for GET requests
 */
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Do not cache preview requests or admin requests
    if (req.query.preview || req.originalUrl.includes('/api/admin')) {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }

    // Monkey patch res.json to capture the response body
    const originalJson = res.json;
    res.json = (body) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, JSON.stringify(body), duration);
      }
      originalJson.call(res, body);
    };

    next();
  };
};

const { triggerVercelDeploy } = require('../utils/triggerDeploy');

/**
 * Utility to flush cache on Admin writes (POST, PUT, DELETE)
 */
const clearCacheMiddleware = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const originalJson = res.json;
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Exclude public non-content writes from flushing cache and triggering deploy
        const ignoredPaths = ['/contact', '/newsletter', '/applications', '/auth', '/upload'];
        const isIgnored = ignoredPaths.some(p => req.originalUrl.includes(p));
        
        if (!isIgnored) {
          cache.flushAll(); 
          console.log('🧹 Cache flushed and deploy triggered due to admin write operation:', req.method, req.originalUrl);
          
          // Trigger Vercel static rebuild to keep prerendered pages and sitemap fresh
          triggerVercelDeploy();
        }
      }
      originalJson.call(res, body);
    };
  }
  next();
};

module.exports = {
  cacheMiddleware,
  clearCacheMiddleware,
  cache
};
