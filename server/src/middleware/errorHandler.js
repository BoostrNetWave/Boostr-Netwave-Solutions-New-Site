/**
 * Centralized Error Handler
 *
 * This is the LAST middleware registered in app.js.
 * All errors (thrown ApiErrors, unhandled async rejections, Mongoose errors,
 * Joi validation errors, JWT errors, etc.) flow here through next(err).
 *
 * Guarantees:
 *  - Always returns JSON, never an Express HTML error page
 *  - Hides internal stack traces from production responses
 *  - Maps common Mongoose and JWT errors to meaningful HTTP status codes
 */

const { logger } = require("../utils/logger");
const { ApiError } = require("../utils/ApiError");

/**
 * Catches requests to routes that don't exist.
 * Must be placed AFTER all route registrations, BEFORE errorHandler.
 */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Global error handler middleware.
 * Accepts 4 arguments — Express requires all 4 to treat it as error middleware.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // ── Wrap non-ApiError instances into ApiError ──────────────────────────────

  // Mongoose: invalid ObjectId (e.g., /api/services/not-an-id)
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose: duplicate key (e.g., duplicate slug or email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error = new ApiError(409, `Duplicate value for field: ${field}`);
  }

  // Mongoose: schema validation failure
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, "Validation failed", messages);
  }

  // JWT: token is malformed or expired
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid or malformed token. Please log in again.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Session expired. Please log in again.");
  }

  // CORS policy violation
  if (err.message && err.message.includes("CORS policy violation")) {
    error = new ApiError(403, err.message);
  }

  // Fallback: if it's still not an ApiError, create a generic 500
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      500,
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error"
    );
  }

  // ── Log the error ──────────────────────────────────────────────────────────
  if (error.statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} — ${error.message}`, {
      statusCode: error.statusCode,
      stack: err.stack,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} — ${error.message}`, {
      statusCode: error.statusCode,
    });
  }

  // ── Send response ──────────────────────────────────────────────────────────
  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors?.length ? error.errors : undefined,
    // Stack trace only in development — never in production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFoundHandler, errorHandler };
