const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const {
    uploadOurTeamJourneyImage,
    getOurTeamJourneyImages,
    deleteOurTeamJourneyImage,
    getimage
} = require('../controllers/ourTeamJourneyController');

router.post('/upload', protect, authorizeRoles('admin'), upload.single('image'), uploadOurTeamJourneyImage);
router.get('/', getOurTeamJourneyImages); 
router.delete('/:id', protect, authorizeRoles('admin'), deleteOurTeamJourneyImage);
router.get('/image',getimage);

module.exports = router;
