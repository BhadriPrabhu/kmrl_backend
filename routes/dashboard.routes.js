const express = require('express');
const { getDashboardData } = require('../controllers/dashboard.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const router = express.Router();

// All dashboard routes are protected
router.use(protect);

router.route('/').get(getDashboardData);

module.exports = router;
