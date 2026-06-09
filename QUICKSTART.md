# Quick Start Guide 🚀

## 5-Minute Setup

### Prerequisites
- Node.js 16+
- PostgreSQL
- npm or yarn

### Step 1: Clone & Setup
```bash
cd backend
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env
# Edit .env with your values
```

### Step 3: Database Setup
```bash
npm run migrate
```

### Step 4: Start Server
```bash
npm run dev
```

Server running at `http://localhost:8000` ✅

---

## Quick API Test

### 1. Register User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the token from response!**

### 2. Create Transaction
```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user_id": 1,
    "category_id": 1,
    "amount": 50,
    "type": "expense",
    "description": "Coffee"
  }'
```

### 3. Get AI Insights
```bash
curl http://localhost:8000/api/insights/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Troubleshooting

### Port 8000 already in use
```bash
# Find and kill process
lsof -i :8000
kill -9 <PID>
```

### Database connection error
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials

### JWT errors
- Check JWT_SECRET is set
- Token may be expired (7 days)
- Check Authorization header format

### Gemini API errors
- Verify GOOGLE_GENAI_API_KEY
- Check API quota
- Ensure key has proper permissions

---

## Project Structure

```
backend/
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth & validation
├── utils/           # Helpers & config
├── scripts/         # DB migrations
├── db.js           # Database config
└── server.js       # Main app
```

---

## Common Commands

```bash
npm start           # Production
npm run dev         # Development (hot reload)
npm run migrate     # Run DB migrations
npm run seed        # Populate sample data
npm run logs        # View logs
```

---

## Next Steps

1. **Add transactions** - /api/transactions
2. **Create budgets** - /api/budgets
3. **Get insights** - /api/insights/:userId
4. **Build frontend** - React/Vue app

---

## Documentation

- **Full API Docs** → see README.md
- **API Testing** → see API_TESTING.md
- **Deployment** → see DEPLOYMENT.md

---

Need help? Check the logs:
```bash
tail -f logs/app.log
```

Happy coding! 💻
