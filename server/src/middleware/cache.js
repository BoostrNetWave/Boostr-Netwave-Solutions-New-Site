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

/**
 * Utility to flush cache on Admin writes (POST, PUT, DELETE)
 */
const clearCacheMiddleware = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // Monkey patch to flush after successful operation
    const originalJson = res.json;
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.flushAll(); // Flush entire cache to prevent stale relational data
        console.log('🧹 Cache flushed due to admin write operation:', req.method, req.originalUrl);
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
