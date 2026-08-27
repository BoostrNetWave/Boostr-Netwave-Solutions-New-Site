/**
 * Master Route Index
 *
 * Single import point for app.js — all route modules mount here.
 * This keeps app.js clean and makes route organization self-documenting.
 *
 * Route stubs marked [STUB] respond with 501 Not Implemented until
 * their controllers are built. They exist now so the full API surface
 * is visible and consistent from day one.
 */

const express = require("express");
const router = express.Router();
const { cacheMiddleware, clearCacheMiddleware } = require("../middleware/cache");

// ── Operational ───────────────────────────────────────────────────────────────
const healthRouter = require("./health");

// ── Auth ──────────────────────────────────────────────────────────────────────
const authRouter = require("./auth");

// ── Public Content ────────────────────────────────────────────────────────────
const servicesRouter = require("./services");
const productsRouter = require("./products");
const clientsRouter = require("./clients");
const testimonialsRouter = require("./testimonials");
const galleryRouter = require("./gallery");
const certificationsRouter = require("./certifications");
const leadershipRouter = require("./leadership");
const blogRouter = require("./blog");
const careersRouter = require("./careers");
const settingsRouter = require("./settings");

// ── Form Submissions ──────────────────────────────────────────────────────────
const contactRouter = require("./contact");
const newsletterRouter = require("./newsletter");
const clientProjectsRouter = require("./clientProjects");
const teamMembersRouter = require("./teamMembers");
const uploadRouter = require("./upload");
const applicationsRouter = require("./applications");

// ── Mount ─────────────────────────────────────────────────────────────────────
// Attach global cache management
router.use(clearCacheMiddleware);
router.use(cacheMiddleware(300));

router.use("/health",          healthRouter);
router.use("/auth",            authRouter);
router.use("/services",        servicesRouter);
router.use("/products",        productsRouter);
router.use("/clients",         clientsRouter);
router.use("/testimonials",    testimonialsRouter);
router.use("/gallery",         galleryRouter);
router.use("/certifications",  certificationsRouter);
router.use("/leadership",      leadershipRouter);
router.use("/blog",            blogRouter);
router.use("/careers",         careersRouter);
router.use("/settings",        settingsRouter);
router.use("/team",            teamMembersRouter);
router.use("/contact",         contactRouter);
router.use("/newsletter",      newsletterRouter);
router.use("/client-projects", clientProjectsRouter);
router.use("/upload",          uploadRouter);
router.use("/applications",    applicationsRouter);

module.exports = router;
