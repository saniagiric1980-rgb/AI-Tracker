# AI Expense Tracker - Architecture & Design 🏗️

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vue)                     │
│                     TailwindCSS + Vite                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    HTTP/REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Backend (Node.js + Express)                    │
│                    Port 8000                                │
├─────────────────┬────────────────────┬──────────────────────┤
│  Controllers    │  Middleware        │  Utilities           │
│  ├── Auth       │  ├── JWT Auth      │  ├── Gemini AI       │
│  ├── Insights   │  ├── Error Handler │  ├── Helpers         │
│  ├── Budgets    │  ├── Logger        │  ├── Config          │
│  └── Dashboard  │  └── Validator     │  └── Errors          │
└────────┬────────┴────────────┬───────┴──────────────────────┘
         │                     │
         │         PostgreSQL (Neon)
         │              Database
         │
      Google Gemini API
      (AI Insights)
```

## Technology Stack

### Backend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 16+ | JavaScript runtime |
| Framework | Express.js | Web framework |
| Database | PostgreSQL | Data persistence |
| Auth | JWT + bcrypt | Security |
| AI | Google Gemini 2.5 | Insights generation |
| Validation | Custom middleware | Request validation |

### Frontend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React/Vue 3 | UI framework |
| Bundler | Vite | Fast build tool |
| Styling | TailwindCSS | CSS framework |
| HTTP | Axios/Fetch | API calls |
| State | Context/Pinia | State management |
| Charts | Chart.js/D3 | Data visualization |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  description TEXT,
  transaction_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  icon VARCHAR(50),
  color VARCHAR(7),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Budgets Table
```sql
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  amount DECIMAL(10, 2) NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly',
  spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Architecture

### RESTful Endpoints Pattern
```
GET    /api/resource           - List all
GET    /api/resource/:id       - Get one
POST   /api/resource           - Create
PUT    /api/resource/:id       - Update
DELETE /api/resource/:id       - Delete
```

### AI Endpoints (Special)
```
GET    /api/insights/:userId              - 50+ metrics
GET    /api/insights/:userId/monthly      - Analysis
POST   /api/insights/:userId/generate     - Force regenerate
```

## Request/Response Flow

### Typical Flow
```
1. Client sends request
   GET /api/transactions/1
   Headers: Authorization: Bearer TOKEN

2. Express receives request
   ↓
3. Middleware chain executes
   - Logger middleware
   - Auth middleware (verifyToken)
   ↓
4. Router matches route
   ↓
5. Controller executes
   - Fetch data from database
   - Process data
   ↓
6. Response sent back
   {
     "success": true,
     "data": [...],
     "message": "Success"
   }
```

## Security Architecture

### Authentication Flow
```
1. User registers
   ↓
2. Password hashed with bcrypt (salt rounds: 10)
   ↓
3. User stored in database
   ↓
4. User logs in
   ↓
5. JWT token generated (expires in 7 days)
   ↓
6. Token sent to client
   ↓
7. Client includes token in Authorization header
   ↓
8. Server verifies token on each protected route
```

### Security Layers
- ✅ JWT tokens for stateless auth
- ✅ bcrypt for password hashing
- ✅ Parameterized SQL queries (SQL injection prevention)
- ✅ CORS for cross-origin requests
- ✅ Environment variables for secrets
- ✅ SSL/TLS for HTTPS

## AI Integration Architecture

### Gemini AI Flow
```
User Data
  ↓
Controller collects data
  ├── Transactions
  ├── Budgets
  ├── Categories
  └── Historical data
  ↓
Format into prompt
  ├── Calculate metrics
  ├── Create structured text
  └── Add constraints
  ↓
Send to Gemini API
  ├── Model: gemini-2.5-flash
  ├── Streaming: No
  └── Temperature: Default
  ↓
Parse response
  ├── Remove markdown
  ├── Parse JSON
  └── Validate structure
  ↓
Return to client
  └── Cached for 24 hours
```

### AI Features Architecture
```
generateMonthlyInsight
├── Input: income, expenses, categories, trends
├── Processing: Analyze patterns
└── Output: {summary, insights, trends, improvements}

generateBudgetAlert
├── Input: category, budget, spent, days remaining
├── Processing: Calculate severity
└── Output: {severity, title, message, suggestions}

generateSavingTips
├── Input: top categories, income
├── Processing: Analyze spending
└── Output: {overallTip, tips[]}

analyzeTransactionList
├── Input: 50 transactions
├── Processing: Pattern detection
└── Output: {insight, highlight}

analyzeBudgetList
├── Input: all budgets
├── Processing: Health analysis
└── Output: {summary, onTrack, atRisk, overspent}
```

## Caching Strategy

### What's Cached
- User categories (1 hour)
- Transaction list (15 minutes)
- Budget status (5 minutes)
- AI insights (24 hours)

### Cache Invalidation
- Manual clear on user action
- Time-based expiration
- TTL in Redis/memory

## Error Handling Strategy

### Error Levels
```
Level 1: Validation Errors (400)
  └─ Invalid input, missing fields
  
Level 2: Auth Errors (401/403)
  └─ Missing/invalid token, no permission
  
Level 3: Resource Errors (404)
  └─ Resource not found
  
Level 4: Server Errors (500)
  └─ Database error, API error
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Human readable message",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

## Performance Considerations

### Database Optimization
- ✅ Indexed user_id and category_id
- ✅ Connection pooling (10 connections)
- ✅ Prepared statements

### API Optimization
- ✅ Pagination for large datasets
- ✅ Response compression (gzip)
- ✅ Lazy loading of related data
- ✅ Request rate limiting

### AI Optimization
- ✅ Cache results
- ✅ Batch requests
- ✅ Async processing
- ✅ Timeout handling

## Scalability Plan

### Short Term (MVP)
- ✅ PostgreSQL on Neon
- ✅ Single Node.js instance
- ✅ Cloudflare CDN for frontend

### Medium Term
- 🔄 Redis for caching
- 🔄 Load balancer
- 🔄 Multiple Node instances
- 🔄 Database replication

### Long Term
- 🚀 Microservices
- 🚀 Message queue (RabbitMQ)
- 🚀 Analytics service
- 🚀 Real-time updates (WebSockets)

## Testing Strategy

### Unit Tests
- Controller logic
- Helper functions
- Validation functions

### Integration Tests
- API endpoints
- Database operations
- Auth flow

### E2E Tests
- Complete user flow
- Error handling
- Edge cases

## Monitoring & Logging

### Logs Collected
- API requests/responses
- Database queries
- Errors and exceptions
- User actions

### Monitoring Tools
- Error tracking: Sentry
- Performance: DataDog
- Logs: LogRocket

## Deployment Architecture

### Development
```
Local Machine
  ├── Node dev server (nodemon)
  ├── Local PostgreSQL
  └── Testing
```

### Production
```
Railway/Render
  ├── Node.js container
  ├── PostgreSQL managed
  ├── SSL/HTTPS
  ├── Auto-scaling
  └── Monitoring
```

## Future Enhancements

### Phase 2
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Data export (CSV, PDF)
- [ ] Advanced filtering

### Phase 3
- [ ] Investment tracking
- [ ] Social sharing
- [ ] Multi-user households
- [ ] Custom reports

### Phase 4
- [ ] Predictions
- [ ] Machine learning
- [ ] Voice commands
- [ ] Blockchain integration

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintainer**: Development Team
