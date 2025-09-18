const Document = require('../models/Document.model.js');
const User = require('../models/User.model.js');
const Compliance = require('../models/Compliance.model.js');
const Alert = require('../models/Alert.model.js'); // We will create this model next

// @desc    Get all data for the main dashboard
// @route   GET /api/dashboard
exports.getDashboardData = async (req, res, next) => {
    try {
        const totalDocuments = await Document.countDocuments();
        const pendingReviews = await Document.countDocuments({ status: 'processing' });
        const complianceIssues = await Compliance.countDocuments({ status: 'overdue' });
        const activeUsers = await User.countDocuments({ isActive: true });

        // Fetch recent documents, limiting to 5
        const recentDocuments = await Document.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('uploader', 'name');

        // Fetch recent alerts, limiting to 5
        const alerts = await Alert.find({ isRead: false })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalDocuments,
                    pendingReviews,
                    complianceIssues,
                    activeUsers,
                    aiSummariesGenerated: 189 // Mocked for now
                },
                recentDocuments,
                alerts
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
