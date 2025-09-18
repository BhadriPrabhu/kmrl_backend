// controllers/documentController.js
const Document = require('../models/Document.model.js');
const uploadMiddleware = require('../middleware/upload.middleware.js');
const { summarizeDocument } = require('../services/aiProcessor.service.js');

// @desc    Upload a document
// @route   POST /api/documents/upload
exports.uploadDocument = (req, res, next) => {
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err });
        }
        if (req.file == undefined) {
            return res.status(400).json({ success: false, message: 'Error: No File Selected!' });
        }

        const { title, department, language } = req.body;
        if (!title || !department) {
            return res.status(400).json({ success: false, message: 'Please provide title and department.' });
        }

        try {
            // Create document metadata in DB
            const newDoc = await Document.create({
                title,
                department,
                language,
                originalFileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                uploader: req.user.id,
            });

            // Trigger AI summarization (asynchronously)
            summarizeDocument(req.file.path, language).then(async ({ summary, keywords }) => {
                await Document.findByIdAndUpdate(newDoc._id, { summary, keywords });
                console.log(`Updated document ${newDoc._id} with AI summary.`);
                // Here you can also trigger a WebSocket event to notify clients
            });

            res.status(201).json({
                success: true,
                message: 'File uploaded successfully. Summarization in progress.',
                data: newDoc,
            });
        } catch (dbErr) {
            res.status(500).json({ success: false, message: dbErr.message });
        }
    });
};

// @desc    Get all documents with search and filter
// @route   GET /api/documents
exports.getDocuments = async (req, res, next) => {
    let query;
    const { search, department, language, page = 1, limit = 10 } = req.query;
    
    let queryStr = {};
    
    if (department) queryStr.department = department;
    if (language) queryStr.language = language;
    if (search) {
        queryStr.$text = { $search: search };
    }
    
    try {
        const documents = await Document.find(queryStr)
            .populate('uploader', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Document.countDocuments(queryStr);
        
        res.status(200).json({
            success: true,
            count: documents.length,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: documents
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get a single document
// @route   GET /api/documents/:id
exports.getDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id).populate('uploader', 'name email');
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        res.status(200).json({ success: true, data: document });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};