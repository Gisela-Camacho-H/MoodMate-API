// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address'],
    },
    profileImageUrl: {
        type: String,
        required: false
    },
    birthday: {
        type: Date,
        required: false
    },
    createAt: {
        type: Date,
        default: Date.mow
    }
});

module.exports = mongoose.model('User', UserSchema);