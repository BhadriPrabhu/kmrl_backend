const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
// NOTE: connectDB must be available in this environment.
// For Vercel, database connections should be handled within the Serverless Function lifecycle.
const connectDB = require('../config/db.js'); 

// Load env vars
// NOTE: Vercel manages .env variables through its Dashboard settings.
// This dotenv.config() line is mainly for local development.
dotenv.config();

// Connect to database
// You should ensure connectDB handles connection pooling efficiently in a serverless environment.
connectDB();

// Route files
const authRoutes = require('../routes/auth.route.js');
const documentRoutes = require('../routes/document.route.js');
const userRoutes = require('../routes/user.route.js');
const complianceRoutes = require('../routes/compliance.route.js');
const commentRoutes = require('../routes/comment.route.js');
const dashboardRoutes = require('../routes/dashboard.routes.js');


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
// IMPORTANT: Vercel often struggles with dynamic file uploads outside of its build process.
// For production, you should migrate file storage to a cloud service (e.g., AWS S3, Google Cloud Storage).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ===============================================
// VERCEL DEPLOYMENT CHANGE:
// Remove app.listen() and export the app instance.
// Vercel handles the listening process automatically.
// ===============================================

// For local development, this still helps define the port, 
// but it is not used when deployed to Vercel.
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`); });

module.exports = app; 