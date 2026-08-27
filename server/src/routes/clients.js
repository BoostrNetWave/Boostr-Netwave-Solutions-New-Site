/**
 * Clients Routes
 * GET    /api/clients      — Public: list all clients
 * POST   /api/clients      — Admin: create [STUB]
 * PUT    /api/clients/:id  — Admin: update [STUB]
 * DELETE /api/clients/:id  — Admin: delete [STUB]
 */

const express = require("express");
const router = express.Router();

router.get("/",       (req, res) => res.status(501).json({ success: false, message: "Clients controller not yet implemented." }));
router.post("/",      (req, res) => res.status(501).json({ success: false, message: "Clients controller not yet implemented." }));
router.put("/:id",    (req, res) => res.status(501).json({ success: false, message: "Clients controller not yet implemented." }));
router.delete("/:id", (req, res) => res.status(501).json({ success: false, message: "Clients controller not yet implemented." }));

module.exports = router;
