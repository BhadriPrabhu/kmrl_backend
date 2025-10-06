# KMRL Document Management System - Complete Setup Guide

This guide will walk you through setting up the complete KMRL Document Management System from scratch.

## System Overview

The system consists of three main components:
1. **Frontend** - React + TypeScript + Vite application
2. **Backend** - Node.js + Express + MongoDB API
3. **AI Processing** - Supabase Edge Functions for document processing

## Prerequisites

Before starting, ensure you have:
- Node.js 16+ and npm installed
- Git installed
- MongoDB database (MongoDB Atlas account or local installation)
- Supabase account (free tier works)
- Text editor (VS Code recommended)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Sign up or login
3. Click "New Project"
4. Fill in project details:
   - Name: KMRL-Documents
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be created (2-3 minutes)

### 1.2 Get Supabase Credentials

1. Go to Project Settings > API
2. Copy and save:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

### 1.3 Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Click "Create Bucket"
3. Name: `documents`
4. Make it Public
5. Click Create

### 1.4 Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Navigate to backend project
cd kmrl-backend

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the edge function
supabase functions deploy process-document
```

## Step 2: MongoDB Setup

### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login
3. Create a FREE cluster:
   - Choose cloud provider (AWS recommended)
   - Choose region (closest to you)
   - Cluster tier: M0 (Free)
4. Create Database User:
   - Go to Database Access
   - Add New Database User
   - Username: kmrl_admin
   - Password: (generate and save securely)
5. Whitelist IP Address:
   - Go to Network Access
   - Add IP Address
   - Allow Access from Anywhere: 0.0.0.0/0 (for development)
6. Get Connection String:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `kmrl`

### Option B: Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Connection string for local:
# mongodb://localhost:27017/kmrl
```

## Step 3: Backend Setup

### 3.1 Clone Backend Repository

```bash
git clone <backend-repo-url>
cd kmrl-backend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

Create `.env` file in backend root:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://kmrl_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kmrl?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace:
- `YOUR_PASSWORD` with your MongoDB password
- `your_super_secret_jwt_key_change_this_in_production` with a random secure string
- Supabase URL and key from Step 1.2

### 3.4 Test Backend

```bash
# Start development server
npm run dev

# You should see:
# Server running on port 5000
# MongoDB connected
```

### 3.5 Seed Sample Data (Optional)

```bash
npm run import-data
```

## Step 4: Frontend Setup

### 4.1 Clone Frontend Repository

```bash
cd ..
git clone https://github.com/rahul-prakash-y/kmrl.git
cd kmrl
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Configure Environment Variables

Create `.env` file in frontend root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Use the same credentials from Step 1.2

### 4.4 Test Frontend

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## Step 5: Verify Integration

### 5.1 Test Document Upload

1. Open frontend in browser (http://localhost:5173)
2. Navigate to "Document Upload" page
3. Upload a test image or PDF
4. Fill in document details:
   - Title: Test Document
   - Department: Operations
   - Type: Policy Document
   - Language: English
5. Click "Process Document"
6. Wait for processing to complete
7. Verify you see:
   - AI Summary
   - Keywords
   - Department routing
   - Criticality assessment

### 5.2 Test OCR

1. Upload an image with text (screenshot, photo of document, etc.)
2. The system should extract text using Tesseract.js
3. Progress bar should show extraction progress
4. Verify extracted text is used for AI processing

### 5.3 Test Critical Document Detection

1. Upload a document with critical keywords like:
   - "urgent safety hazard"
   - "emergency protocol required"
   - "immediate compliance deadline"
2. System should mark as critical
3. Alert should be generated

## Step 6: Production Deployment

### 6.1 Deploy Backend

See `DEPLOYMENT.md` in backend for detailed options.

Quick deploy to Vercel:
```bash
cd kmrl-backend
vercel
# Follow prompts
# Set environment variables in Vercel dashboard
```

### 6.2 Deploy Frontend

See `DEPLOYMENT.md` in frontend for detailed options.

Quick deploy to Vercel:
```bash
cd kmrl
vercel
# Follow prompts
# Set environment variables in Vercel dashboard
```

### 6.3 Update Frontend to Use Production Backend

If backend is deployed separately, update frontend API calls to use production backend URL.

## Troubleshooting

### MongoDB Connection Issues

**Problem**: "Failed to connect to MongoDB"

**Solutions**:
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions
- Try connection string without `&w=majority`

### Supabase Edge Function Not Working

**Problem**: "Failed to process document"

**Solutions**:
- Verify Edge Function is deployed: `supabase functions list`
- Check Supabase credentials in `.env`
- Review Edge Function logs in Supabase dashboard
- Redeploy function: `supabase functions deploy process-document`

### OCR Not Extracting Text

**Problem**: No text extracted from images

**Solutions**:
- Check browser console for errors
- Verify image file size (< 5MB works best)
- Try different image formats (PNG works best)
- Ensure image has clear, readable text
- Check internet connection (Tesseract downloads language files)

### Frontend Not Connecting to Backend

**Problem**: API calls failing

**Solutions**:
- Verify backend is running
- Check CORS configuration in backend
- Ensure environment variables are set
- Check browser console for detailed errors
- Verify API endpoint URLs

### Build Errors

**Problem**: Build fails with TypeScript errors

**Solutions**:
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist

# Try building again
npm run build
```

## System Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  React Frontend │◄──────────┐
│  (Port 5173)    │           │
└────────┬────────┘           │
         │                    │
         │ API Calls          │ File Upload
         ▼                    │
┌────────────────────┐        │
│  Express Backend   │        │
│  (Port 5000)       │◄───────┘
└─────────┬──────────┘
          │
          │ Store Files & Metadata
          ▼
    ┌─────────────┐
    │  MongoDB    │
    └─────────────┘
          │
          │ Process with AI
          ▼
┌──────────────────────┐
│ Supabase Edge        │
│ Functions            │
│ - OCR               │
│ - Summarization     │
│ - Dept Routing      │
│ - Critical Detection│
└──────────────────────┘
```

## Default Users (After Seeding)

If you ran `npm run import-data`, you have these test users:

- **Admin**: admin@kmrl.com / password123
- **Manager**: manager@kmrl.com / password123
- **Staff**: staff@kmrl.com / password123

## Next Steps

1. ✅ Customize department list for your organization
2. ✅ Configure critical keyword detection rules
3. ✅ Set up email notifications for alerts
4. ✅ Customize UI branding and colors
5. ✅ Set up backups for MongoDB
6. ✅ Configure SSL certificates for production
7. ✅ Set up monitoring and logging

## Support and Resources

- Backend API Documentation: See `README.md` in backend
- Frontend Documentation: See `README.md` in frontend
- Deployment Guides: See `DEPLOYMENT.md` in both repos
- Supabase Docs: https://supabase.com/docs
- MongoDB Docs: https://docs.mongodb.com

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong passwords** for MongoDB and JWT secrets
3. **Rotate credentials** regularly in production
4. **Enable MongoDB authentication** in production
5. **Use HTTPS** for all production deployments
6. **Implement rate limiting** for API endpoints
7. **Regular security audits**: `npm audit`
8. **Keep dependencies updated**: `npm update`

## Maintenance

### Weekly Tasks
- Check server logs for errors
- Monitor disk space usage
- Review uploaded documents

### Monthly Tasks
- Update npm packages: `npm update`
- Security audit: `npm audit fix`
- Database backup verification
- Review and archive old documents

### Quarterly Tasks
- Rotate JWT secrets and API keys
- Performance optimization review
- User access audit
- Storage cleanup

## Conclusion

You now have a fully functional KMRL Document Management System with:
- ✅ AI-powered document processing
- ✅ OCR text extraction (Tesseract.js)
- ✅ Intelligent department routing
- ✅ Critical document detection
- ✅ Alert system for urgent documents
- ✅ Multilingual support
- ✅ User authentication and authorization
- ✅ Collaboration features

Enjoy using your new document management system!
