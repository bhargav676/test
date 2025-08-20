// D:\iete\server\controllers\pastEventController.js

// --- 1. CRITICAL: Ensure the Model is imported at the top ---
const Past = require('../models/PastEvent');
const cloudinary = require('cloudinary').v2;

// --- 2. THE WORKING UPLOAD FUNCTION (from your reference) ---
const uploadPastEvent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const { link, description, clubName } = req.body;

        if (!description || !clubName) {
            return res.status(400).json({ success: false, message: 'Description and Club Name are required fields.' });
        }

        const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(uploadSource, {
            folder: 'past_events',
            resource_type: 'auto'
        });

        // --- 3. THIS LINE USES THE 'Past' MODEL, WHICH IS NOW DEFINED ---
        const newPastEvent = new Past({
            public_id: result.public_id,
            url: result.secure_url,
            link,
            description,
            clubName,
        });

        await newPastEvent.save();

        res.status(201).json({
            success: true,
            message: 'Past event uploaded successfully!',
            data: newPastEvent,
        });

    } catch (error) {
        console.error('Error uploading past event:', error);
        res.status(500).json({ success: false, message: 'Past event upload failed.', error: error.message });
    }
};


// --- 4. ALL OTHER CONTROLLER FUNCTIONS FOR THIS ROUTE ---

const getPastEvents = async (req, res) => {
    try {
        const events = await Past.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while fetching past events." });
    }
};

const getPastEventById = async (req, res) => {
    try {
        const event = await Past.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Past event not found." });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while fetching past event." });
    }
};

const updatePastEvent = async (req, res) => {
     try {
        const { description, link, clubName } = req.body;
        const event = await Past.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.description = description || event.description;
        event.link = link !== undefined ? link : event.link;
        event.clubName = clubName || event.clubName;

        if (req.file) {
            await cloudinary.uploader.destroy(event.public_id);
            const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(uploadSource, { folder: 'past_events' });
            event.public_id = result.public_id;
            event.url = result.secure_url;
        }

        const updatedEvent = await event.save();
        res.status(200).json({ message: 'Event updated successfully', data: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Server error during event update', error: error.message });
    }
};

const deletePastEvent = async (req, res) => {
    try {
        const event = await Past.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        await cloudinary.uploader.destroy(event.public_id);
        await event.deleteOne();
        res.status(200).json({ success: true, message: "Past event deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while deleting event", error: error.message });
    }
};


// --- 5. EXPORT ALL FUNCTIONS ---
module.exports = {
    uploadPastEvent,
    getPastEvents,
    getPastEventById,
    updatePastEvent,
    deletePastEvent
};