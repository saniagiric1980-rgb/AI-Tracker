# Deployment Guide

## Deployment Options

### 1. Heroku (Deprecated - Use Railway or Render instead)

### 2. Railway.app (Recommended)

#### Setup
1. Create account at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Add PostgreSQL plugin
5. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `JWT_SECRET`
   - `GOOGLE_GENAI_API_KEY`
   - `NODE_ENV=production`

#### Deploy
Railway auto-deploys on git push. No additional steps needed.

### 3. Render.com

#### Setup
1. Create account at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Select Node environment
5. Set build command: `npm install && npm run migrate`
6. Set start command: `npm start`
7. Add PostgreSQL database
8. Set environment variables

#### Deploy
```bash
git push origin main
```
Render auto-deploys on git push.

### 4. DigitalOcean App Platform

#### Setup
1. Create account at https://www.digitalocean.com
2. Create App
3. Connect GitHub
4. Configure settings:
   - Build command: `npm install`
   - Run command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

### 5. Docker Deployment

#### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/expense_tracker
      - JWT_SECRET=your_secret_key
      - GOOGLE_GENAI_API_KEY=your_api_key
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=expense_tracker
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Deploy with Docker
```bash
docker-compose up -d
```

### 6. Vercel (For Frontend) + Render/Railway (For Backend)

## Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run: `npm run migrate`
- [ ] Test API endpoints locally
- [ ] Update API URLs in frontend
- [ ] Enable CORS for your domain
- [ ] Set up SSL/HTTPS
- [ ] Configure logging
- [ ] Test payment processing (if applicable)

## Environment Variables for Production

```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_strong_secret_key_min_32_chars
GOOGLE_GENAI_API_KEY=your_production_api_key
```

## Database Migration in Production

```bash
# SSH into your server
ssh user@server

# Navigate to project
cd /var/www/expense-tracker

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed
```

## Monitoring & Logging

### Set up logging service
- **Sentry.io** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - Performance monitoring

### Example Sentry setup
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

## Performance Optimization

### 1. Enable caching
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 2. Use connection pooling
- Already configured in db.js

### 3. Add compression
```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

### 4. Rate limiting
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api/', limiter);
```

## SSL/HTTPS

Most platforms (Railway, Render) provide automatic SSL.

For custom domains:
- Use Let's Encrypt (free)
- Configure with your domain provider

## Backup Strategy

### PostgreSQL Backups
```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Automated backups
- Railway: auto-backup included
- Render: manual backups available
- DigitalOcean: managed backups available

## Rollback Plan

1. Keep previous version deployed
2. Use blue-green deployment
3. Maintain database backups
4. Document breaking changes

## Monitoring Checklist

- [ ] Error rates < 1%
- [ ] API response time < 200ms
- [ ] Database connection health
- [ ] Memory usage < 500MB
- [ ] CPU usage < 50%
- [ ] 99.9% uptime target

## Support & Issues

If deployment fails:
1. Check logs: `npm run logs` or platform dashboard
2. Verify environment variables
3. Check database connection
4. Review recent code changes
5. Contact platform support

## Useful Commands

```bash
# View production logs
npm run logs

# Restart service
npm run restart

# Check health
curl https://your-domain.com/

# Monitor database
psql $DATABASE_URL
\dt  # List tables
\d users  # Describe table
```

---

**Happy deploying! 🚀**
