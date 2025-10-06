# KMRL Document Management System - Backend

Backend API for the KMRL Document Management System with AI processing capabilities.

## Features

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Role-based access control (Admin, Manager, Staff, Viewer)
- Document upload with metadata
- AI document processing integration
- Comment and collaboration system
- Compliance tracking
- Dashboard analytics

## Technology Stack

- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing
- Supabase Edge Functions for AI processing

## Prerequisites

- Node.js 16+ and npm
- MongoDB database (local or Atlas)
- Supabase account for AI processing

## Installation

1. Clone the repository:
```bash
git clone <backend-repo-url>
cd kmrl-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Documents
- `POST /api/documents/upload` - Upload document with metadata
- `GET /api/documents` - Get all documents (with filters)
- `GET /api/documents/:id` - Get single document
- Search and filter by department, language, keywords

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Comments
- `POST /api/comments` - Add comment to document
- `GET /api/comments/:documentId` - Get comments for document
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Compliance
- `POST /api/compliance` - Create compliance item
- `GET /api/compliance` - Get all compliance items
- `PUT /api/compliance/:id` - Update compliance item

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Models

### User
- name, email, password (hashed)
- role: admin, manager, staff, viewer
- department
- isActive status

### Document
- title, department, language
- file information (path, type, size)
- AI processing results (summary, keywords)
- uploader reference
- timestamps

### Comment
- document reference
- user reference
- content
- timestamps

### Compliance
- title, description
- status, priority
- due date
- assigned user
- related documents

### Alert
- type, priority
- message
- target user
- read status
- timestamps

## Middleware

### Authentication (`auth.middleware.js`)
Protects routes and validates JWT tokens

### Role-based Access (`role.middleware.js`)
Restricts access based on user roles:
- `authorize('admin')` - Admin only
- `authorize('admin', 'manager')` - Admin and Manager

### File Upload (`upload.middleware.js`)
Handles multipart file uploads with Multer
- Stores files in `uploads/` directory
- Validates file types and sizes

## AI Processing Integration

The backend integrates with Supabase Edge Functions for AI document processing:

1. Document uploaded via API
2. Metadata stored in MongoDB
3. File sent to AI processing service
4. AI extracts text, generates summary, identifies keywords
5. Determines department routing and criticality
6. Results stored back in database
7. Alerts generated for critical documents

## Seeding Data

Import sample data:
```bash
npm run import-data
```

Destroy all data:
```bash
npm run destroy-data
```

## Deployment

### Deploy to Vercel

1. The project includes `vercel.json` configuration
2. Install Vercel CLI: `npm install -g vercel`
3. Run: `vercel`
4. Set environment variables in Vercel dashboard

### Deploy to Heroku

1. Create Heroku app: `heroku create`
2. Set environment variables: `heroku config:set KEY=value`
3. Deploy: `git push heroku main`

### Deploy to Railway/Render

Follow platform-specific deployment guides and set environment variables.

## Project Structure

```
├── api/                    # API entry point
├── config/                 # Configuration files
│   └── db.js              # Database connection
├── controllers/           # Route controllers
├── middleware/            # Custom middleware
├── models/                # Mongoose models
├── routes/                # API routes
├── services/              # Business logic services
│   └── aiProcessor.service.js
├── uploads/               # Uploaded files storage
└── supabase/             # Supabase Edge Functions
    └── functions/
        └── process-document/

## Supabase Edge Functions

The AI processing is handled by Supabase Edge Functions located in `supabase/functions/`.

### process-document Function

Handles:
- Text extraction from uploaded documents
- AI-powered summarization
- Keyword extraction
- Department routing with confidence scores
- Critical document detection
- Alert generation

Deploy the edge function:
```bash
supabase functions deploy process-document
```

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Role-based access control
- Input validation on all endpoints
- File upload restrictions
- MongoDB injection prevention

## Environment Variables

Required environment variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT expiration time (default: 30d)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Error Handling

All API endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Success responses:
```json
{
  "success": true,
  "data": { ... }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential.
