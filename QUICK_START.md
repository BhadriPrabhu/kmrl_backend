# KMRL System - Quick Start Reference

## Prerequisites Checklist

- [ ] Node.js 16+ installed
- [ ] MongoDB database ready
- [ ] Supabase account created
- [ ] Git installed

## Backend Quick Start

```bash
# 1. Navigate to backend
cd kmrl-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cat > .env << EOF
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
EOF

# 4. Deploy Supabase Edge Function
supabase login
supabase functions deploy process-document

# 5. Start server
npm run dev
```

Server will run on: http://localhost:5000

## Frontend Quick Start

```bash
# 1. Navigate to frontend
cd kmrl

# 2. Install dependencies
npm install

# 3. Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
EOF

# 4. Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

## Deploy Edge Function

```bash
# One-time setup
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy
cd kmrl-backend
supabase functions deploy process-document
```

## Production Deploy - Vercel

```bash
# Backend
cd kmrl-backend
vercel
# Set environment variables in dashboard

# Frontend
cd kmrl
vercel
# Set environment variables in dashboard
```

## Common Commands

### Backend
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run import-data  # Seed sample data
npm run destroy-data # Remove all data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Supabase
```bash
supabase functions list                    # List deployed functions
supabase functions deploy process-document # Deploy edge function
supabase functions delete process-document # Delete function
supabase functions logs process-document   # View logs
```

## Environment Variables Quick Reference

### Backend `.env`
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kmrl
JWT_SECRET=random_secure_string_here
JWT_EXPIRE=30d
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### Frontend `.env`
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document

### Users (Admin only)
- `GET /api/users` - List users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Comments
- `POST /api/comments` - Add comment
- `GET /api/comments/:documentId` - Get comments

### Dashboard
- `GET /api/dashboard/stats` - Dashboard stats

## Testing Document Upload

1. Start both backend and frontend
2. Open http://localhost:5173
3. Navigate to "Document Upload"
4. Upload image/PDF with text
5. Fill in details
6. Click "Process Document"
7. Wait for AI processing
8. View results

## Troubleshooting Quick Fixes

### MongoDB won't connect
```bash
# Check connection string format
# Verify IP whitelist in MongoDB Atlas
# Test with MongoDB Compass
```

### Port already in use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
rm -rf dist node_modules
npm install
npm run build
```

### Edge Function not working
```bash
supabase functions deploy process-document
# Check logs
supabase functions logs process-document
```

## System Health Check

```bash
# Backend health
curl http://localhost:5000/api/auth/me

# Frontend running
curl http://localhost:5173

# MongoDB connection
# Check backend console for "MongoDB connected"

# Edge Function
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/process-document \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"extractedText":"test","department":"Operations"}'
```

## Default Test Users (After Seeding)

```
Admin:
Email: admin@kmrl.com
Password: password123

Manager:
Email: manager@kmrl.com
Password: password123

Staff:
Email: staff@kmrl.com
Password: password123
```

## File Structure Overview

```
kmrl-backend/
├── api/              # API entry point
├── controllers/      # Route logic
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Auth & upload
├── services/         # Business logic
└── supabase/         # Edge functions

kmrl/ (frontend)
├── src/
│   ├── components/   # React components
│   ├── services/     # API clients
│   ├── hooks/        # React hooks
│   └── types/        # TypeScript types
└── public/           # Static assets
```

## Helpful Links

- MongoDB Atlas: https://cloud.mongodb.com
- Supabase Dashboard: https://app.supabase.com
- Vercel Dashboard: https://vercel.com/dashboard
- Tesseract.js Docs: https://tesseract.projectnaptha.com

## Emergency Contacts

For production issues:
1. Check server logs
2. Review error tracking (if configured)
3. Check database status
4. Verify Supabase status: https://status.supabase.com

## Quick Maintenance

```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Clean install
rm -rf node_modules package-lock.json
npm install

# Database backup (if local)
mongodump --uri="mongodb://localhost:27017/kmrl" --out=./backup
```

## Performance Optimization

```bash
# Frontend production build
npm run build
# Output in dist/ folder

# Backend PM2 (production)
pm2 start api/index.js --name kmrl-backend
pm2 save
pm2 monit
```

That's it! You're ready to go! 🚀
