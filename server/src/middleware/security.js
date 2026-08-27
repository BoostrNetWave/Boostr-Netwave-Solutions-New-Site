/**
 * Security Middleware Stack
 *
 * Applied globally in app.js before any routes.
 * Order matters — applied top to bottom:
 *  1. helmet        — Sets secure HTTP headers
 *  2. cors          — Restricts cross-origin requests to CLIENT_ORIGIN
 *  3. compression   — Gzip all responses
 *  4. mongoSanitize — Strips MongoDB operators from req.body/params (manual, Express v5 safe)
 *  5. xssSanitize   — Strips HTML tags from string values in req.body (manual, Express v5 safe)
 *  6. hpp           — Prevents HTTP Parameter Pollution attacks
 *
 * NOTE on Express v5 compatibility:
 *   Express v5 made req.query a read-only getter. Both xss-clean and express-mongo-sanitize
 *   try to mutate req.query and crash. We implement both as manual body/params-only middleware.
 *   xss-clean is replaced by the 'xss' package (actively maintained, no req mutation).
 */

const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const hpp = require("hpp");

// ─── Recursive XSS sanitizer for plain objects ───────────────────────────────
const sanitizeObject = (obj) => {
  if (typeof obj === "string") {
    return xss(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeObject(value)])
    );
  }
  return obj;
};

/**
 * @param {import('express').Application} app
 */
const applySecurityMiddleware = (app) => {
  // ── Helmet — secure HTTP response headers ─────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://storage.googleapis.com"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameSrc: ["'self'", "https://www.youtube.com", "https://player.vimeo.com"],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow Cloudinary embeds
    })
  );

  // ── CORS — allow only the configured frontend origin ─────────────────────
  app.use(
    cors({
      origin: (origin, callback) => {
        const rawOrigins = (process.env.CLIENT_ORIGIN || "")
          .split(",")
          .map((s) => s.trim().replace(/\/$/, ""))
          .filter(Boolean);

        const normalizedOrigin = origin ? origin.replace(/\/$/, "") : origin;

        const isAllowed =
          !normalizedOrigin ||
          rawOrigins.includes(normalizedOrigin) ||
          (process.env.NODE_ENV === "development" && (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")));

        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error(`CORS policy violation: origin ${origin} not allowed`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // ── Compression — gzip all responses above 1KB ───────────────────────────
  app.use(compression());

  // ── NoSQL Injection Prevention ────────────────────────────────────────────
  // Manual middleware — avoids Express v5 req.query read-only crash
  app.use((req, _res, next) => {
    if (req.body) {
      mongoSanitize.sanitize(req.body, { allowDots: true });
    }
    if (req.params) {
      mongoSanitize.sanitize(req.params, { allowDots: true });
    }
    next();
  });

  // ── XSS Prevention ────────────────────────────────────────────────────────
  // Sanitizes string values in req.body recursively using the 'xss' package.
  // Only req.body is sanitized — query params are validated per-route via express-validator.
  app.use((req, _res, next) => {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }
    next();
  });

  // ── HTTP Parameter Pollution ──────────────────────────────────────────────
  // Whitelist fields that legitimately appear multiple times (e.g., filter arrays)
  app.use(hpp({ whitelist: ["sort", "fields", "category", "tag"] }));
};

module.exports = { applySecurityMiddleware };
