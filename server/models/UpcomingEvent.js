const mongoose = require('mongoose');

const upcomingEventSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    registration: {
        type: String,
        default: '',
    },
    eventDate: {            // <-- New field
        type: Date,
        required: true,     // Ensure every event has a date
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('UpcomingEvent', upcomingEventSchema);
