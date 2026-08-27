const express = require('express');
const router = express.Router();
const { getAll, getAllAdmin, upsert, bulkUpsert } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/', getAll);

// Admin
router.use(protect);
router.get('/admin', getAllAdmin);
router.put('/bulk', bulkUpsert);
router.put('/:key', upsert);

module.exports = router;
