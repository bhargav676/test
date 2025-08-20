const cloudinary = require('cloudinary').v2;
const Electromazine = require('../models/Electromazine');

// @desc    Upload a new electromazine
// @route   POST /api/electromazine/upload
// @access  Private/Admin
const uploadElectromazine = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const { description, registrationLink } = req.body;

        const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(uploadSource, {
            folder: 'electromazine',
            resource_type: 'auto'
        });

        const newElectromazine = new Electromazine({
            public_id: result.public_id,
            url: result.secure_url,
            description: description,
            registrationLink: registrationLink,
        });

        await newElectromazine.save();

        res.status(201).json({
            success: true,
            message: 'Electromazine uploaded successfully!',
            data: newElectromazine,
        });

    } catch (error) {
        console.error('Error uploading electromazine:', error);
        res.status(500).json({ success: false, message: 'Electromazine upload failed.', error: error.message });
    }
};

// @desc    Get all electromazine entries
// @route   GET /api/electromazine
// @access  Private/Admin
const getElectromazines = async (req, res) => {
    try {
        const magazines = await Electromazine.find({});
        res.status(200).json({ success: true, count: magazines.length, data: magazines });
    } catch (error) {
        console.error('Error fetching electromazines:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch electromazines.', error: error.message });
    }
};

// @desc    Get a single electromazine by ID
// @route   GET /api/electromazine/:id
// @access  Private/Admin
const getElectromazineById = async (req, res) => {
    try {
        const { id } = req.params;
        const magazine = await Electromazine.findById(id);

        if (!magazine) {
            return res.status(404).json({ success: false, message: 'Electromazine not found.' });
        }
        res.status(200).json({ success: true, data: magazine });
    } catch (error) {
        console.error(`Error fetching electromazine by ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to fetch electromazine.', error: error.message });
    }
};

// @desc    Update an electromazine
// @route   PUT /api/electromazine/:id
// @access  Private/Admin
const updateElectromazine = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, registrationLink } = req.body;
        let updateData = { description, registrationLink };

        const existingMagazine = await Electromazine.findById(id);
        if (!existingMagazine) {
            return res.status(404).json({ success: false, message: 'Electromazine not found.' });
        }

        if (req.file) {
            if (existingMagazine.public_id) {
                await cloudinary.uploader.destroy(existingMagazine.public_id);
            }

            const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(uploadSource, {
                folder: 'electromazine',
                resource_type: 'auto'
            });

            updateData.public_id = result.public_id;
            updateData.url = result.secure_url;
        }

        const updatedElectromazine = await Electromazine.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedElectromazine) {
            return res.status(500).json({ success: false, message: 'Failed to update electromazine in database.' });
        }

        res.status(200).json({
            success: true,
            message: 'Electromazine updated successfully!',
            data: updatedElectromazine,
        });

    } catch (error) {
        console.error('Error updating electromazine:', error);
        res.status(500).json({ success: false, message: 'Electromazine update failed.', error: error.message });
    }
};

// @desc    Delete an electromazine
// @route   DELETE /api/electromazine/:id
// @access  Private/Admin
const deleteElectromazine = async (req, res) => {
    try {
        const { id } = req.params;

        const magazine = await Electromazine.findById(id);
        if (!magazine) {
            return res.status(404).json({ success: false, message: 'Electromazine not found.' });
        }

        if (magazine.public_id) {
            await cloudinary.uploader.destroy(magazine.public_id);
        }

        await Electromazine.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Electromazine deleted successfully!' });

    } catch (error) {
        console.error('Error deleting electromazine:', error);
        res.status(500).json({ success: false, message: 'Electromazine deletion failed.', error: error.message });
    }
};

module.exports = {
    uploadElectromazine,
    getElectromazines,
    getElectromazineById,
    updateElectromazine,
    deleteElectromazine,
};