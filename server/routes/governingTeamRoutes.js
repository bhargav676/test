
const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig');
const {
    uploadGoverningTeamMember,
    getGoverningTeamMembers,
    getGoverningTeamMemberById, // New import
    updateGoverningTeamMember,  // New import
    deleteGoverningTeamMember   // New import
} = require('../controllers/governingTeamController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Assuming authMiddleware applies to these too

router.post('/upload', protect, authorizeRoles('admin'), upload.single('image'), uploadGoverningTeamMember);
router.get('/', protect, authorizeRoles('admin'), getGoverningTeamMembers);
router.get('/:id', protect, authorizeRoles('admin'), getGoverningTeamMemberById); // New route
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateGoverningTeamMember); // New route
router.delete('/:id', protect, authorizeRoles('admin'), deleteGoverningTeamMember); // New route

module.exports = router;