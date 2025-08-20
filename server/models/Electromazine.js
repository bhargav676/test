const mongoose = require('mongoose');

const ElectromazineSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description.'],
        trim: true,
    },
    registrationLink: {
        type: String,
        required: [true, 'Please provide a registration link.'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Electromazine', ElectromazineSchema);