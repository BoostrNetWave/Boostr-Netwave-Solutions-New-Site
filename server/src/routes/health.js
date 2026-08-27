/**
 * Health Check Route
 * GET /api/health
 *
 * Used by:
 *  - Render's health check (keep the service awake)
 *  - Uptime monitors
 *  - Load balancers
 *
 * Returns the app name, environment, uptime, and current timestamp.
 * Does NOT require authentication.
 */

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  // 0 = disconnected | 1 = connected | 2 = connecting | 3 = disconnecting
  const dbStatusMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

  res.status(200).json({
    success: true,
    status: "ok",
    app: process.env.APP_NAME || "Boostr Netwave Solutions API",
    environment: process.env.NODE_ENV,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: dbStatusMap[dbStatus] || "unknown",
  });
});

module.exports = router;
