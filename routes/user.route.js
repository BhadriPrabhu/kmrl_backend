// routes/userRoutes.js
const express = require('express');
const { getUsers,updateUser, deleteUser } = require('../controllers/user.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { authorize } = require('../middleware/role.middleware.js');
const router = express.Router();

// All user routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getUsers);

router.route('/:id/role')
    .put(updateUser);

router.route('/:id')
    .delete(deleteUser);

module.exports = router;