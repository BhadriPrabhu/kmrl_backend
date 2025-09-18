const Comment = require('../models/Compliance.model.js');
const Document = require('../models/Document.model.js');

// @desc    Add a comment to a document
// @route   POST /api/comments
exports.addComment = async (req, res) => {
    const { documentId, text } = req.body;
    try {
        // Check if document exists
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        
        const comment = await Comment.create({
            document: documentId,
            user: req.user.id,
            text,
        });

        // Here you could trigger a WebSocket event to notify others viewing the document
        res.status(201).json({ success: true, data: comment });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all comments for a document
// @route   GET /api/comments/document/:documentId
exports.getCommentsForDocument = async (req, res) => {
    try {
        const comments = await Comment.find({ document: req.params.documentId })
            .populate('user', 'name role')
            .sort({ createdAt: 'asc' });
        
        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};