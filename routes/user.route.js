// routes/userRoutes.js
const express = require('express');
const { getUsers, updateUserRole } = require('../controllers/user.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { authorize } = require('../middleware/role.middleware.js');
const router = express.Router();

// All user routes are protected and admin-only
router.use(protect);
router.use(authorize('Admin'));

router.route('/')
    .get(getUsers);

router.route('/:id/role')
    .put(updateUserRole);

module.exports = router;