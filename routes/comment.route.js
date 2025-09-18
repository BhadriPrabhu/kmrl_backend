const express = require('express');
const { addComment, getCommentsForDocument } = require('../controllers/comment.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
    .post(addComment);

router.route('/document/:documentId')
    .get(getCommentsForDocument);

module.exports = router;