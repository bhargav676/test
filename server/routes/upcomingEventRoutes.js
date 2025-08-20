const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig');
const {
    uploadUpcomingEvent,
    getUpcomingEvents,
    getUpcomingEventById, // New import 
    updateUpcomingEvent,  // New import
    deleteUpcomingEvent   // New import
} = require('../controllers/upcomingEventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Assuming authMiddleware applies to these too

router.post('/upload', protect, authorizeRoles('admin'), upload.single('image'), uploadUpcomingEvent);
router.get('/', protect, authorizeRoles('admin'), getUpcomingEvents);
router.get('/:id', protect, authorizeRoles('admin'), getUpcomingEventById); // New route
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateUpcomingEvent); // New route
router.delete('/:id', protect, authorizeRoles('admin'), deleteUpcomingEvent); // New route

module.exports = router;