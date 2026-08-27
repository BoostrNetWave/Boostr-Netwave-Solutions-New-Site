/**
 * Environment Configuration
 * Validates all required environment variables at boot time using Joi.
 * The server will REFUSE to start if any required variable is missing or invalid.
 * This prevents "undefined is not a function" errors at runtime.
 */

const Joi = require("joi");

const envSchema = Joi.object({
  // --- App ---
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(5000),
  APP_NAME: Joi.string().default("Boostr Netwave Solutions API"),

  // --- Database ---
  MONGODB_URI: Joi.string().required().description("MongoDB Atlas connection URI"),

  // --- JWT ---
  JWT_SECRET: Joi.string().min(32).required().description("JWT signing secret (min 32 chars)"),
  JWT_EXPIRES_IN: Joi.string().default("7d"),

  // --- CORS ---
  CLIENT_ORIGIN: Joi.string().required().description("Frontend origin URL(s) for CORS (single or comma-separated)"),

  // --- Cloudinary (optional — upload feature degrades gracefully if missing) ---
  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),

  // --- Email (Resend) — optional — emails fire-and-forget, never crash the server ---
  RESEND_API_KEY: Joi.string().optional(),
  CONTACT_ALERT_EMAIL: Joi.string().email().optional(),
  EMAIL_FROM: Joi.string().optional(),

  // --- Rate Limiting ---
  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: Joi.number().default(100),
})
  .unknown() // allow extra env vars (e.g., system ones) without throwing
  .required();

const { error, value: env } = envSchema.validate(process.env);

if (error) {
  // Intentional crash — better to fail loudly at boot than silently at runtime
  console.error(`\n❌  Environment validation failed:\n   ${error.message}\n`);
  console.error("   Check your .env file against .env.example and fix the missing/invalid values.\n");
  process.exit(1);
}

module.exports = env;
