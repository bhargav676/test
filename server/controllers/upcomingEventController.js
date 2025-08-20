const cloudinary = require('cloudinary').v2;
const UpcomingEvent = require('../models/UpcomingEvent');

const uploadUpcomingEvent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const { link, description, registration, eventDate } = req.body;

        if (!eventDate) {
            return res.status(400).json({ success: false, message: 'Event date is required.' });
        }

        const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(uploadSource, {
            folder: 'upcoming_events',
            resource_type: 'auto'
        });

        const newUpcomingEvent = new UpcomingEvent({
            public_id: result.public_id,
            url: result.secure_url,
            link,
            description,
            registration,
            eventDate: new Date(eventDate),  // Convert to Date
        });

        await newUpcomingEvent.save();

        res.status(201).json({
            success: true,
            message: 'Upcoming event uploaded successfully!',
            data: newUpcomingEvent,
        });

    } catch (error) {
        console.error('Error uploading upcoming event:', error);
        res.status(500).json({ success: false, message: 'Upcoming event upload failed.', error: error.message });
    }
};

const getUpcomingEvents = async (req, res) => {
    try {
        const events = await UpcomingEvent.find({});
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch upcoming events.', error: error.message });
    }
};

const getUpcomingEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await UpcomingEvent.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Upcoming event not found.' });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        console.error(`Error fetching upcoming event by ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to fetch upcoming event.', error: error.message });
    }
};

const updateUpcomingEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { link, description, registration } = req.body;
        let updateData = { link, description, registration };

        const existingEvent = await UpcomingEvent.findById(id);
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: 'Upcoming event not found.' });
        }

        if (req.file) {
            if (existingEvent.public_id) {
                await cloudinary.uploader.destroy(existingEvent.public_id)
                    .catch(destroyError => console.error('Error deleting old upcoming event image from Cloudinary:', destroyError));
            }

            const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(uploadSource, {
                folder: 'upcoming_events',
                resource_type: 'auto'
            });

            updateData.public_id = result.public_id;
            updateData.url = result.secure_url;
        }

        const updatedEvent = await UpcomingEvent.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedEvent) {
            return res.status(500).json({ success: false, message: 'Failed to update upcoming event in database.' });
        }

        res.status(200).json({
            success: true,
            message: 'Upcoming event updated successfully!',
            data: updatedEvent,
        });

    } catch (error) {
        console.error('Error updating upcoming event:', error);
        res.status(500).json({ success: false, message: 'Upcoming event update failed.', error: error.message });
    }
};

const deleteUpcomingEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await UpcomingEvent.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Upcoming event not found.' });
        }

        if (event.public_id) {
            await cloudinary.uploader.destroy(event.public_id)
                .catch(destroyError => console.error('Error deleting upcoming event image from Cloudinary:', destroyError));
        }

        await UpcomingEvent.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Upcoming event deleted successfully!' });

    } catch (error) {
        console.error('Error deleting upcoming event:', error);
        res.status(500).json({ success: false, message: 'Upcoming event deletion failed.', error: error.message });
    }
};

module.exports = {
    uploadUpcomingEvent,
    getUpcomingEvents,
    getUpcomingEventById,
    updateUpcomingEvent,
    deleteUpcomingEvent,
};