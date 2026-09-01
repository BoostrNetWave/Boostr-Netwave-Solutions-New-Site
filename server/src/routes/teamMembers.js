const express = require('express');
const { getTeamMembers, getTeamMemberById, getAllAdmin, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamMembersController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Static
router.get('/', getTeamMembers);

// Admin-only routes
router.use(protect);
router.get('/admin/all', getAllAdmin);
router.post('/', restrictTo('superadmin', 'editor'), createTeamMember);
router.put('/:id', restrictTo('superadmin', 'editor'), updateTeamMember);   // kept for backward compat
router.patch('/:id', restrictTo('superadmin', 'editor'), updateTeamMember); // used by admin panel
router.delete('/:id', restrictTo('superadmin'), deleteTeamMember);

// Public Dynamic - Must be last
router.get('/:id', getTeamMemberById);

module.exports = router;
