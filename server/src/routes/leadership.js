/**
 * Leadership Routes
 * GET  /api/leadership     — Public: get leadership content
 * PUT  /api/leadership/:id — Admin: update [STUB]
 */

const express = require("express");
const router = express.Router();

router.get("/",     (req, res) => res.status(501).json({ success: false, message: "Leadership controller not yet implemented." }));
router.put("/:id",  (req, res) => res.status(501).json({ success: false, message: "Leadership controller not yet implemented." }));

module.exports = router;
