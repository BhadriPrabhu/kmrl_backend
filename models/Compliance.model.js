const mongoose = require('mongoose');
const ComplianceSchema = new mongoose.Schema({
    document: { type: mongoose.Schema.ObjectId, ref: 'Document', required: true },
    taskName: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'In-Progress', 'Completed', 'Overdue'], default: 'Pending' },
    assignedTo: { type: mongoose.Schema.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Compliance', ComplianceSchema);