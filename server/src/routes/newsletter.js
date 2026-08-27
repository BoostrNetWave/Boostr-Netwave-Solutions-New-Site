/**
 * Newsletter Route
 * POST /api/newsletter — Public: subscribe to newsletter (strict rate-limited)
 *
 * Will eventually: validate email, check for duplicates, save subscriber.
 */

const express = require("express");
const { strictLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

router.post("/", strictLimiter, (req, res) => {
  res.status(501).json({ success: false, message: "Newsletter controller not yet implemented." });
});

module.exports = router;
