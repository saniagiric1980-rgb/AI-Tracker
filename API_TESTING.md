# API Testing Guide

## Using curl or Postman

### 1. Authentication

#### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "currency": "USD"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Transactions

#### Get all transactions
```bash
curl -X GET http://localhost:8000/api/transactions/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create transaction
```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1,
    "category_id": 1,
    "amount": 50.00,
    "type": "expense",
    "description": "Grocery shopping",
    "transaction_date": "2024-01-15"
  }'
```

### 3. Categories

#### Get categories
```bash
curl -X GET http://localhost:8000/api/categories/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create category
```bash
curl -X POST http://localhost:8000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1,
    "name": "Entertainment",
    "type": "expense",
    "icon": "🎬",
    "color": "#FF5733"
  }'
```

### 4. Budgets

#### Get budgets
```bash
curl -X GET http://localhost:8000/api/budgets/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create budget
```bash
curl -X POST http://localhost:8000/api/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1,
    "category_id": 1,
    "amount": 500.00,
    "period": "monthly"
  }'
```

### 5. AI Insights

#### Get all user insights (50+ metrics)
```bash
curl -X GET http://localhost:8000/api/insights/1?currency=USD \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get monthly insights
```bash
curl -X GET http://localhost:8000/api/insights/1/monthly?currency=USD \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get budget alerts
```bash
curl -X GET http://localhost:8000/api/insights/1/budgets?currency=USD \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get saving tips
```bash
curl -X GET http://localhost:8000/api/insights/1/tips?currency=USD \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Generate insights (POST)
```bash
curl -X POST http://localhost:8000/api/insights/1/generate?currency=USD \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Dashboard

#### Get dashboard summary
```bash
curl -X GET http://localhost:8000/api/dashboard/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get detailed statistics
```bash
curl -X GET http://localhost:8000/api/dashboard/1/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Email or password is incorrect"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request successful |
| 201  | Created - Resource created |
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Missing/invalid token |
| 403  | Forbidden - Access denied |
| 404  | Not Found - Resource not found |
| 500  | Server Error - Internal error |

## Testing with Postman

1. Import the requests above
2. Set `{{base_url}}` to `http://localhost:8000`
3. Set `{{token}}` after login response
4. Use `Authorization: Bearer {{token}}` header

## Environment Variables for Testing

Create a `.env.test` file:
```env
PORT=8000
DATABASE_URL=postgresql://test:test@localhost:5432/expense_tracker_test
JWT_SECRET=test_secret_key_min_32_characters_long
GOOGLE_GENAI_API_KEY=test_key
NODE_ENV=test
```
