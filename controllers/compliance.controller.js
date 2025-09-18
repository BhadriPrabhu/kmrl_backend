const Compliance = require('../models/Compliance.model.js');
const Document = require('../models/Document.model.js');

// @desc    Create a new compliance task
// @route   POST /api/compliance
exports.createComplianceTask = async (req, res) => {
    const { documentId, taskName, deadline, assignedTo } = req.body;
    try {
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        const task = await Compliance.create({
            document: documentId,
            taskName,
            deadline,
            assignedTo,
        });
        // Optionally, send a notification to the assigned user here
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all compliance tasks (with filtering)
// @route   GET /api/compliance
exports.getComplianceTasks = async (req, res) => {
    try {
        // Build query based on request parameters (e.g., ?status=Pending)
        const query = { ...req.query };
        const tasks = await Compliance.find(query)
            .populate('document', 'title')
            .populate('assignedTo', 'name email');
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a compliance task's status
// @route   PUT /api/compliance/:id
exports.updateComplianceTask = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Compliance.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true,
        });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // A user can only update tasks assigned to them, unless they are an Admin
        if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'Admin') {
             return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};