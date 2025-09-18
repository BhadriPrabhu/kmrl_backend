const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    document: { type: mongoose.Schema.ObjectId, ref: 'Document', required: true },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Comment', CommentSchema);