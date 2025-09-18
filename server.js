const express = require('express');
const dotenv =require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth.route.js');
const documentRoutes = require('./routes/document.route.js');
const userRoutes = require('./routes/user.route.js');
const complianceRoutes = require('./routes/compliance.route.js');
const commentRoutes = require('./routes/comment.route.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');


const app = express();

// Body parser & CORS
app.use(express.json());
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});