const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Please specify the department'],
    },
    originalFileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String, // Path to the file in storage (e.g., AWS S3 URL or local path)
        required: true,
    },
    fileType: {
        type: String,
    },
    language: {
        type: String,
        enum: ['english', 'malayalam', 'mixed'],
        default: 'english',
    },
    summary: {
        type: String,
        default: 'Summary not yet generated.',
    },
    keywords: [String],
    uploader: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});




module.exports = mongoose.model('Document', DocumentSchema);