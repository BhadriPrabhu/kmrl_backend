// routes/documentRoutes.js
const express = require('express');
const { uploadDocument, getDocuments, getDocumentById } = require('../controllers/document.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const router = express.Router();

router.route('/')
    .get(protect, getDocuments);

router.route('/upload')
    .post(protect, uploadDocument);

router.route('/:id')
    .get(protect, getDocumentById);

module.exports = router;