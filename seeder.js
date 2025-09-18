// seeder.js
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User.model.js');
const Document = require('./models/Document.model.js');
const Compliance = require('./models/Compliance.model.js');
const Comment = require('./models/Comment.model.js');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// --- Your Mock Data (Adapted for Mongoose Schema) ---
// Note: We're adding a plain text password '123456' which will be hashed.
const users = [
    { name: 'Rajesh Kumar', email: 'rajesh.kumar@kmrl.co.in', role: 'Admin', password: '123456' },
    { name: 'Priya Nair', email: 'priya.nair@kmrl.co.in', role: 'Station Controller', password: '123456' },
    { name: 'Mohammed Rashid', email: 'm.rashid@kmrl.co.in', role: 'Engineer', password: '123456' },
    { name: 'Lakshmi Menon', email: 'lakshmi.menon@kmrl.co.in', role: 'HR Officer', password: '123456' }
];

const documents = [
    {
        title: 'Safety Protocol Updates - Malayalam Version',
        department: 'Operations',
        language: 'malayalam',
        summary: 'Updated safety protocols...',
        uploader: null,
        originalFileName: 'safety-protocol-malayalam.pdf',
        filePath: 'uploads/placeholder-safety.pdf'
    },
    {
        title: 'Annual Budget Report 2024',
        department: 'Finance',
        language: 'english', // Using the lowercase, valid enum value
        summary: 'Comprehensive annual budget analysis...',
        uploader: null,
        originalFileName: 'annual-budget-2024.docx',
        filePath: 'uploads/placeholder-budget.docx'
    },
    {
        title: 'Track Maintenance Guidelines',
        department: 'Engineering',
        language: 'mixed', // Use 'none' for the document with mixed languages
        uploader: null,
        originalFileName: 'track-maintenance.pdf',
        filePath: 'uploads/placeholder-track.pdf'
    }
];

// Import data into DB
const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Document.deleteMany();
        await Compliance.deleteMany();
        await Comment.deleteMany();

        console.log('Data Destroyed...');

        // Hash passwords before inserting users
        const createdUsers = await User.create(users);
        console.log('Users Imported...');

        // Assign user IDs to documents
        documents[0].uploader = createdUsers[1]._id; // Priya Nair
        documents[1].uploader = createdUsers[0]._id; // Rajesh Kumar (Admin)
        documents[2].uploader = createdUsers[2]._id; // Mohammed Rashid

        await Document.create(documents);
        console.log('Documents Imported...');
        
        console.log('✅ Data Import Successful!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete data from DB
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Document.deleteMany();
        await Compliance.deleteMany();
        await Comment.deleteMany();
        console.log('🔥 Data Destroyed Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please use the -i flag to import data or -d to destroy data.');
    process.exit();
}