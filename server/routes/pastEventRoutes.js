const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig');
const { 
    uploadPastEvent, 
    getPastEvents,
    getPastEventById, 
    updatePastEvent,  
    deletePastEvent   
} = require('../controllers/pastEventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/upload', protect, authorizeRoles('admin'), upload.single('image'), uploadPastEvent);
router.get('/', protect, authorizeRoles('admin'), getPastEvents);
router.get('/:id', protect, authorizeRoles('admin'), getPastEventById);
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updatePastEvent);
router.delete('/:id', protect, authorizeRoles('admin'), deletePastEvent);

module.exports = router;