

const mongoose = require('mongoose');

const ourTeamJourneySchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('OurTeamJourney', ourTeamJourneySchema);
