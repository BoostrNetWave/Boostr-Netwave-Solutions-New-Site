/**
 * Certifications Routes
 * GET    /api/certifications      — Public: list all certifications
 * POST   /api/certifications      — Admin: create [STUB]
 * PUT    /api/certifications/:id  — Admin: update [STUB]
 * DELETE /api/certifications/:id  — Admin: delete [STUB]
 */

const express = require("express");
const router = express.Router();

router.get("/",       (req, res) => res.status(501).json({ success: false, message: "Certifications controller not yet implemented." }));
router.post("/",      (req, res) => res.status(501).json({ success: false, message: "Certifications controller not yet implemented." }));
router.put("/:id",    (req, res) => res.status(501).json({ success: false, message: "Certifications controller not yet implemented." }));
router.delete("/:id", (req, res) => res.status(501).json({ success: false, message: "Certifications controller not yet implemented." }));

module.exports = router;
