const express = require('express');
const { getTeamMembers, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamMembersController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getTeamMembers);
router.get('/:id', getTeamMemberById);

// Admin-only routes
router.use(protect);
router.post('/', restrictTo('superadmin', 'editor'), createTeamMember);
router.put('/:id', restrictTo('superadmin', 'editor'), updateTeamMember);
router.delete('/:id', restrictTo('superadmin'), deleteTeamMember);

module.exports = router;
