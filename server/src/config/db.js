/**
 * MongoDB Atlas connection with retry logic.
 *
 * - On success: logs the host name (not the full URI which contains credentials)
 * - On failure: retries up to MAX_RETRIES times with exponential backoff
 * - After MAX_RETRIES: throws an Error (caller decides whether to exit or continue)
 * - Uses an iterative Promise-based loop so retries properly propagate back to await
 */

const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 1000; // doubles each attempt

/** Promise-based sleep helper */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`✅  MongoDB connected — host: ${conn.connection.host}`);
      return; // Success — exit the loop
    } catch (err) {
      lastError = err;
      logger.error(
        `❌  MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
      );

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.warn(`🔄  Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      }
    }
  }

  // All retries exhausted — throw so the caller handles it
  logger.error("💀  Maximum DB connection retries reached. Giving up.");
  throw new Error(
    `MongoDB connection failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
};

// ─── Mongoose connection event listeners ──────────────────────────────────────
mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️   MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  logger.info("✅  MongoDB reconnected.");
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});

module.exports = { connectDB };
