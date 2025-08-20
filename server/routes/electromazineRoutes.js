const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig'); // Assuming your multer config is in this path
const {
    uploadElectromazine,
    getElectromazines,
    getElectromazineById,
    updateElectromazine,
    deleteElectromazine,
} = require('../controllers/electromazineController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Assuming your auth middleware is here

// All routes are protected and restricted to admin users.
router.use(protect, authorizeRoles('admin'));

router.route('/upload')
    .post(upload.single('image'), uploadElectromazine);

router.route('/')
    .get(getElectromazines);

router.route('/:id')
    .get(getElectromazineById)
    .put(upload.single('image'), updateElectromazine)
    .delete(deleteElectromazine);

module.exports = router;