// models/MoodEntry.js

const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    emotion: {
        type: String,
        required: true,
        trim: true
    },
    note: {
        type: String,
        required: false,
        maxlength: 500
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);