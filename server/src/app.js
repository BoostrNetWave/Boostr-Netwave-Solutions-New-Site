/**
 * Express Application
 *
 * This file configures and exports the Express app.
 * It does NOT call app.listen() — that lives in server.js.
 * This separation makes the app independently testable.
 *
 * Middleware order:
 *  1. Load .env (must be first)
 *  2. HTTP logger (Morgan → Winston)
 *  3. Security stack (helmet, cors, compression, sanitize, xss, hpp)
 *  4. Body parsers
 *  5. Global rate limiter
 *  6. API routes
 *  7. 404 handler
 *  8. Global error handler (must be last)
 */

require("dotenv").config();

// Validate environment variables at boot time — crashes loudly if misconfigured
require("./config/env");

const express = require("express");
const cookieParser = require("cookie-parser");
const { httpLogger } = require("./utils/logger");
const { applySecurityMiddleware } = require("./middleware/security");
const { globalLimiter } = require("./middleware/rateLimiter");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const apiRoutes = require("./routes/index");
const sitemapRouter = require("./routes/sitemap");

const app = express();

// ── 1. HTTP request logging ───────────────────────────────────────────────────
app.use(httpLogger);

// ── 2. Security middleware stack ──────────────────────────────────────────────
applySecurityMiddleware(app);

// ── 3. Body parsers & cookies ────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ── 4. Trust proxy (for accurate IP behind Render/Vercel/Nginx) ───────────────
app.set("trust proxy", 1);

// ── 5. Global rate limiter ────────────────────────────────────────────────────
app.use("/api", globalLimiter);

// ── 6. API routes ─────────────────────────────────────────────────────────────
app.use("/api", apiRoutes);
app.use("/", sitemapRouter);

// ── 7. 404 handler (must be after all routes) ─────────────────────────────────
app.use(notFoundHandler);

// ── 8. Global error handler (must be the very last middleware) ────────────────
app.use(errorHandler);

module.exports = app;