/**
 * Rate Limiters
 *
 * Two limiter configs:
 *  1. globalLimiter   — Applied to all /api/* routes (100 req / 15 min per IP)
 *  2. strictLimiter   — Applied to auth + form submission routes (10 req / 15 min per IP)
 *
 * Both return structured JSON (not HTML) so the frontend can handle them gracefully.
 */

const rateLimit = require("express-rate-limit");

// ─── Response handler (always JSON, never HTML) ───────────────────────────────
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP. Please try again later.",
    data: null,
  });
};

const isDev = process.env.NODE_ENV !== 'production';

// ─── Global limiter — all API routes ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
  skip: () => isDev,
});

// ─── Strict limiter — auth + contact/newsletter forms ────────────────────────
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  message: "Too many attempts from this IP. Please wait 15 minutes before trying again.",
});

module.exports = { globalLimiter, strictLimiter };
