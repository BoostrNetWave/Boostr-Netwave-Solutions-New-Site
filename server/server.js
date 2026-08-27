/**
 * server.js — Process Entry Point
 *
 * Responsibilities:
 *  1. Start the HTTP server
 *  2. Connect to MongoDB Atlas
 *  3. Handle graceful shutdown on SIGTERM and SIGINT
 *     (Render sends SIGTERM on deploy/restart — we drain in-flight requests
 *      before exiting instead of dropping them)
 *
 * Do NOT add Express configuration here — that belongs in src/app.js.
 */

const http = require("http");
const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { logger } = require("./src/utils/logger");

const PORT = process.env.PORT || 5000;

// Create the raw HTTP server (keeps a reference for graceful shutdown)
const server = http.createServer(app);

// ─── Start ────────────────────────────────────────────────────────────────────
const start = async () => {
  // Attempt DB connection.
  // In production: if all retries fail, connectDB() calls process.exit(1).
  // In development: we catch the error and let the server boot anyway —
  //   useful for working on routes/middleware without Atlas credentials.
  try {
    await connectDB();
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      logger.error("DB connection failed in production — exiting.");
      process.exit(1);
    } else {
      logger.warn("⚠️  DB not connected — server will run in DB-less mode (dev only).");
    }
  }

  server.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀  Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    logger.info(`    Health check: http://localhost:${PORT}/api/health`);
  });
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = (signal) => {
  logger.info(`\n🔴  ${signal} received — shutting down gracefully...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info("   HTTP server closed.");

    try {
      const mongoose = require("mongoose");
      await mongoose.connection.close();
      logger.info("   MongoDB connection closed.");
      logger.info("   Shutdown complete. Goodbye.\n");
      process.exit(0);
    } catch (err) {
      logger.error(`   Error during shutdown: ${err.message}`);
      process.exit(1);
    }
  });

  // Force exit if graceful shutdown takes more than 10 seconds
  setTimeout(() => {
    logger.error("   Graceful shutdown timed out — forcing exit.");
    process.exit(1);
  }, 10_000);
};

// ─── Process Signal Handlers ──────────────────────────────────────────────────
// SIGTERM — sent by Render, Docker, systemd on controlled shutdown
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// SIGINT — Ctrl+C in development
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Catch unhandled promise rejections (async errors that weren't caught)
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection:", { reason, promise });
  // In production, let the process manager restart us rather than continuing in a bad state
  gracefulShutdown("unhandledRejection");
});

// Catch synchronous uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  gracefulShutdown("uncaughtException");
});

// ─── Launch ───────────────────────────────────────────────────────────────────
start();
