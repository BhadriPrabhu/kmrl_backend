# Deployment Guide - KMRL Backend

## Prerequisites

1. MongoDB database (MongoDB Atlas or local)
2. Node.js 16+ installed
3. Supabase account for Edge Functions
4. Environment variables configured

## Deployment Options

### Option 1: Vercel (Serverless)

The backend is configured for Vercel deployment with the included `vercel.json`.

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `JWT_EXPIRE`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Option 2: Railway

Railway provides easy deployment for Node.js applications.

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set MONGO_URI=your_mongo_uri
   railway variables set JWT_SECRET=your_jwt_secret
   # Add all other environment variables
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Option 3: Render

1. **Create a `render.yaml` file**
   ```yaml
   services:
     - type: web
       name: kmrl-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: MONGO_URI
           sync: false
         - key: JWT_SECRET
           sync: false
   ```

2. **Connect GitHub repo** in Render dashboard

3. **Set Environment Variables** in Render dashboard

4. **Deploy** automatically on push

### Option 4: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create kmrl-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI=your_mongo_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set JWT_EXPIRE=30d
   heroku config:set VITE_SUPABASE_URL=your_supabase_url
   heroku config:set VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 5: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     api:
       build: .
       ports:
         - "5000:5000"
       environment:
         - MONGO_URI=${MONGO_URI}
         - JWT_SECRET=${JWT_SECRET}
         - JWT_EXPIRE=${JWT_EXPIRE}
       restart: unless-stopped
   ```

3. **Build and Run**
   ```bash
   docker-compose up -d
   ```

### Option 6: VPS (DigitalOcean, AWS EC2, etc.)

1. **Connect to VPS**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js and MongoDB**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd kmrl-backend
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Set Environment Variables**
   ```bash
   nano .env
   # Add all environment variables
   ```

6. **Install PM2**
   ```bash
   npm install -g pm2
   ```

7. **Start Application**
   ```bash
   pm2 start api/index.js --name kmrl-backend
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (or allow from anywhere: 0.0.0.0/0)
5. Get connection string
6. Set as `MONGO_URI` environment variable

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string: `mongodb://localhost:27017/kmrl`

## Supabase Edge Function Deployment

The AI processing functionality requires Supabase Edge Functions.

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link to your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy Edge Function**
   ```bash
   supabase functions deploy process-document
   ```

5. **Verify Deployment**
   ```bash
   supabase functions list
   ```

## Environment Variables

Create a `.env` file with these variables:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kmrl?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_random_secure_secret_key_here
JWT_EXPIRE=30d

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Post-Deployment Checklist

- [ ] Verify MongoDB connection
- [ ] Test user registration and login
- [ ] Test document upload endpoint
- [ ] Verify AI processing integration
- [ ] Test authentication middleware
- [ ] Check role-based access control
- [ ] Test all API endpoints
- [ ] Verify file upload works
- [ ] Check Supabase Edge Function connectivity
- [ ] Monitor server logs for errors
- [ ] Set up automatic backups for MongoDB

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` file
   - Use secure secrets for JWT_SECRET
   - Rotate keys regularly

2. **MongoDB**
   - Use strong passwords
   - Enable authentication
   - Restrict IP access when possible
   - Regular backups

3. **API Security**
   - Rate limiting (consider adding express-rate-limit)
   - CORS configuration
   - Input validation
   - SQL injection prevention (using Mongoose)

4. **File Uploads**
   - Validate file types
   - Limit file sizes
   - Scan for malware (consider adding ClamAV)

## Monitoring and Logging

1. **PM2 Monitoring** (if using PM2)
   ```bash
   pm2 monit
   pm2 logs kmrl-backend
   ```

2. **Error Tracking**
   - Consider integrating Sentry
   - Set up error alerting

3. **Performance Monitoring**
   - Monitor API response times
   - Track database query performance
   - Set up uptime monitoring

## Backup Strategy

1. **MongoDB Backups**
   - MongoDB Atlas: Automatic backups enabled
   - Self-hosted: Set up regular mongodump backups
   ```bash
   mongodump --uri="mongodb://localhost:27017/kmrl" --out=/backup/$(date +%Y%m%d)
   ```

2. **Uploaded Files**
   - Regular backup of `uploads/` directory
   - Consider using cloud storage (S3, Google Cloud Storage)

## Scaling

1. **Horizontal Scaling**
   - Use load balancer (Nginx, AWS ALB)
   - Multiple server instances
   - Session management with Redis

2. **Database Scaling**
   - MongoDB Atlas auto-scaling
   - Read replicas for read-heavy operations
   - Sharding for large datasets

3. **Caching**
   - Implement Redis for API response caching
   - Cache frequently accessed documents

## Troubleshooting

### Issue: Cannot connect to MongoDB
- Check connection string
- Verify IP whitelist
- Check network connectivity

### Issue: 500 errors
- Check server logs
- Verify environment variables
- Check MongoDB connection

### Issue: File uploads failing
- Check disk space
- Verify upload directory permissions
- Check file size limits

### Issue: AI processing not working
- Verify Supabase Edge Function is deployed
- Check Supabase credentials
- Review Edge Function logs

## Maintenance

1. **Regular Updates**
   ```bash
   npm update
   npm audit fix
   ```

2. **Database Maintenance**
   - Regular backups
   - Index optimization
   - Clean up old documents

3. **Log Rotation**
   - Set up log rotation
   - Archive old logs
   - Monitor disk space

## Support

For issues or questions:
- Check logs first
- Review error messages
- Consult MongoDB documentation
- Check Supabase status page
