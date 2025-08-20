const mongoose = require('mongoose');

const pastEventSchema = new mongoose.Schema({
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
    clubName: {
        type: String,
        required: true,
        enum: ['AI build club', 'Technical club', 'Electromazine club']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('PastEvent', pastEventSchema);