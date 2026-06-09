# AI Expense Tracker 💰

A modern expense tracking application with AI-powered financial insights using Google Gemini API.

## Features ✨

- 👤 **User Authentication** - Secure JWT-based auth with bcrypt password hashing
- 💳 **Transaction Management** - Track income and expenses with categories
- 💰 **Budget Tracking** - Set and monitor budget limits per category
- 📊 **Dashboard Analytics** - Visual insights into spending patterns
- 🤖 **AI Insights** - Powered by Google Gemini:
  - Monthly financial analysis
  - Budget alerts and recommendations
  - Personalized saving tips
  - Transaction pattern analysis
- 🏷️ **Category Management** - Customizable expense categories with icons
- 💱 **Multi-Currency Support** - Track expenses in different currencies

## Tech Stack 🛠️

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **PostgreSQL** (Neon) - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google GenAI** - AI-powered insights

### Frontend (Coming Soon)
- React/Vue.js
- TailwindCSS
- Real-time chart updates

## Project Structure 📁

```
AI/
├── backend/
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── budgetController.js
│   │   ├── categoryController.js
│   │   ├── dashboardController.js
│   │   └── insightController.js (AI-powered)
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & custom middleware
│   ├── utils/           # Helper functions & AI integration
│   ├── scripts/         # Database migrations & seeds
│   ├── db.js           # Database connection
│   ├── server.js       # Express app setup
│   └── package.json    # Dependencies
└── frontend/           # React/Vue frontend (TBD)
```

## Installation 🚀

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone <repo-url>
cd AI
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Setup database**
```bash
npm run migrate          # Run migrations
npm run seed            # Populate default data (optional)
```

5. **Start the server**
```bash
npm run dev             # Development with nodemon
npm start               # Production
```

The server will run on `http://localhost:8000`

## API Documentation 📚

### Authentication
```
POST /api/auth/register          - Create new user
POST /api/auth/login             - User login
POST /api/auth/logout            - User logout
POST /api/auth/refresh-token     - Refresh JWT token
```

### Transactions
```
GET  /api/transactions/:userId   - Get all transactions
POST /api/transactions           - Create transaction
PUT  /api/transactions/:id       - Update transaction
DELETE /api/transactions/:id     - Delete transaction
```

### Categories
```
GET  /api/categories/:userId     - Get user categories
POST /api/categories             - Create category
PUT  /api/categories/:id         - Update category
DELETE /api/categories/:id       - Delete category
```

### Budgets
```
GET  /api/budgets/:userId        - Get user budgets
POST /api/budgets                - Create budget
PUT  /api/budgets/:id            - Update budget
DELETE /api/budgets/:id          - Delete budget
```

### Dashboard
```
GET  /api/dashboard/:userId      - Get dashboard summary
GET  /api/dashboard/:userId/stats - Get detailed statistics
```

### AI Insights 🤖
```
GET  /api/insights/:userId                    - Get all 50+ metrics
GET  /api/insights/:userId/monthly            - Monthly analysis
GET  /api/insights/:userId/budgets            - Budget alerts
GET  /api/insights/:userId/tips               - Saving tips

POST /api/insights/:userId/generate           - Force regenerate all insights
POST /api/insights/:userId/monthly            - Generate monthly analysis
POST /api/insights/:userId/budgets            - Generate budget alerts
POST /api/insights/:userId/tips               - Generate saving tips
```

## Environment Variables 🔐

```env
# Server
PORT=8000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database_name

# JWT
JWT_SECRET=your_secret_key_min_32_characters

# Google Gemini AI
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

## Database Schema 💾

### Users
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email
- `password_hash` - Bcrypt hashed password
- `currency` - Preferred currency (USD, EUR, etc.)
- `created_at` - Registration timestamp

### Transactions
- `id` - Primary key
- `user_id` - Foreign key to users
- `category_id` - Foreign key to categories
- `amount` - Transaction amount
- `type` - 'income' or 'expense'
- `description` - Transaction details
- `transaction_date` - Date of transaction
- `created_at` - Created timestamp

### Budgets
- `id` - Primary key
- `user_id` - Foreign key to users
- `category_id` - Foreign key to categories
- `amount` - Budget limit
- `period` - 'monthly', 'weekly', etc.
- `spent` - Current spending
- `created_at` - Created timestamp

### Categories
- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Category name
- `type` - 'income' or 'expense'
- `icon` - Icon identifier
- `color` - Hex color code
- `is_default` - System category flag

## AI Features 🤖

### Monthly Insights
Analyzes user's financial data and provides:
- Financial health summary
- Actionable saving recommendations
- Positive spending trends
- Areas for improvement

### Budget Alerts
Real-time alerts for budget status:
- Info level (< 70% spent)
- Warning level (70-100% spent)
- Critical level (> 100% spent)

### Saving Tips
Personalized tips based on top expense categories:
- Realistic savings estimates
- Category-specific advice
- Prioritized recommendations

### Transaction Analysis
Analyzes spending patterns:
- Pattern detection
- Spending anomalies
- Actionable insights

## Development 🔧

### Scripts
```bash
npm run dev              # Start with hot reload
npm start               # Production start
npm run migrate         # Run DB migrations
npm run seed            # Populate sample data
```

### Adding New Features
1. Create controller in `controllers/`
2. Add routes in `routes/`
3. Import and use in `server.js`
4. Update database schema if needed

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly message"
}
```

## Security 🔒

- ✅ JWT token authentication
- ✅ Bcrypt password hashing (10 rounds)
- ✅ CORS enabled
- ✅ SQL injection prevention via parameterized queries
- ✅ Environment variable protection

## Future Enhancements 🚀

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Data export (CSV, PDF)
- [ ] Recurring transactions
- [ ] Investment tracking
- [ ] Social expense sharing
- [ ] Email verification
- [ ] 2FA support
- [ ] Advanced analytics
- [ ] Custom reports

## Contributing 🤝

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License 📄

MIT License

## Support 💬

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, PostgreSQL, and Google Gemini AI**
