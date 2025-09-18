// controllers/userController.js
const User = require('../models/User.model.js');

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
         res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
exports.updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};