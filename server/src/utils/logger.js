/**
 * Winston Logger + Morgan HTTP logger setup.
 *
 * - In production: logs JSON to rotating daily files (logs/combined-YYYY-MM-DD.log)
 *   and errors to a separate file (logs/error-YYYY-MM-DD.log).
 * - In all envs: logs to the console with a clean, colorized format.
 * - Morgan HTTP logs stream INTO Winston so everything goes through one pipeline.
 */

const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const morgan = require("morgan");
const path = require("path");

const { combine, timestamp, printf, colorize, errors, json } = format;

// ─── Console format (human-readable) ─────────────────────────────────────────
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  const base = `${timestamp}  [${level}]  ${message}`;
  return stack ? `${base}\n${stack}` : base;
});

// ─── Transports ───────────────────────────────────────────────────────────────
const logTransports = [
  new transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: "HH:mm:ss" }),
      errors({ stack: true }),
      consoleFormat
    ),
  }),
];

// File transports only when not in test environment
if (process.env.NODE_ENV !== "test") {
  logTransports.push(
    new transports.DailyRotateFile({
      filename: path.join("logs", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "30d",
      zippedArchive: true,
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new transports.DailyRotateFile({
      filename: path.join("logs", "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

// ─── Logger instance ──────────────────────────────────────────────────────────
const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: logTransports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// ─── Morgan → Winston stream ──────────────────────────────────────────────────
// Strips the trailing newline Morgan appends before handing to Winston
const morganStream = {
  write: (message) => logger.http(message.trim()),
};

/**
 * Returns a Morgan middleware instance configured to stream into Winston.
 * Use "dev" format in development for colored short output,
 * "combined" in production for full Apache-style logs.
 */
const httpLogger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev",
  { stream: morganStream }
);

module.exports = { logger, httpLogger };
