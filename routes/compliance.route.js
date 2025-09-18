const express = require('express');
const {
    createComplianceTask,
    getComplianceTasks,
    updateComplianceTask
} = require('../controllers/compliance.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { authorize } = require('../middleware/role.middleware.js');
const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
    .post(authorize('Admin', 'Executive Director'), createComplianceTask)
    .get(getComplianceTasks);

router.route('/:id')
    .put(updateComplianceTask); // Authorization handled within controller

module.exports = router;