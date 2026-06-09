# Contributing to AI Expense Tracker 🤝

We love your input! We want to make contributing to this project as easy and transparent as possible.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/AI.git`
3. Create a branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Push to your fork: `git push origin feature/your-feature`
6. Open a Pull Request

## Code Style

### JavaScript/Node.js
- Use ES6+ syntax
- 4 spaces indentation
- Semicolons required
- camelCase for variables and functions
- PascalCase for classes
- UPPER_CASE for constants

### Example
```javascript
import pool from '../db.js';

export const getUserById = async (userId) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};
```

## Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat(auth): add JWT token refresh endpoint
fix(insights): resolve null pointer in calculateMonthlyMetrics
docs(api): update authentication examples
```

## Testing

Before submitting:
```bash
# Run all tests
npm test

# Test specific route
npm test -- --grep "transactions"
```

## PR Checklist

- [ ] Code follows style guidelines
- [ ] Changes are well-commented
- [ ] No breaking changes (or documented)
- [ ] Tests pass
- [ ] Updated documentation
- [ ] No console.log left (except errors)
- [ ] Meaningful commit messages

## Reporting Bugs

Include:
1. **Description** - What's the bug?
2. **Steps to reproduce** - How to trigger it?
3. **Expected behavior** - What should happen?
4. **Actual behavior** - What happens?
5. **Environment** - OS, Node version, etc.
6. **Screenshots** - If applicable

Example:
```
## Bug: Transaction amount shows NaN

### Steps to reproduce
1. Create a new transaction
2. Enter amount as "50.99"
3. Submit form

### Expected
Amount displays as 50.99

### Actual
Amount displays as NaN

### Environment
- Node 18.12.0
- macOS 13.1
```

## Feature Requests

Include:
1. **Use case** - Why is this needed?
2. **Proposed solution** - How should it work?
3. **Alternatives** - Other approaches?
4. **Additional context** - Any screenshots?

Example:
```
## Feature: Export transactions as CSV

### Use case
Users want to backup their transactions or analyze in Excel

### Proposed solution
Add `/api/transactions/export` endpoint that returns CSV

### Alternatives
- JSON export
- PDF report

### Context
Requested by 3 users on GitHub discussions
```

## Development Workflow

### 1. Create feature branch
```bash
git checkout -b feature/add-export-csv
```

### 2. Make changes and test
```bash
npm run dev
# Test your changes
```

### 3. Commit with meaningful messages
```bash
git add .
git commit -m "feat(export): add CSV export for transactions"
```

### 4. Keep branch up to date
```bash
git fetch origin
git rebase origin/main
```

### 5. Push and create PR
```bash
git push origin feature/add-export-csv
```

## Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Code Review

### For reviewers
- ✅ Approve if code quality is good
- 📝 Request changes if issues found
- 💬 Comment for suggestions
- ✨ Praise good work!

### For contributors
- 🤝 Be respectful of feedback
- 📚 Ask for clarification if needed
- 🔄 Make requested changes
- ✔️ Mark conversations as resolved

## Coding Standards

### Database Queries
```javascript
// ✅ Good - Parameterized query
const user = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ❌ Bad - SQL injection risk
const user = await pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### Error Handling
```javascript
// ✅ Good
try {
  const result = await operation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new AppError('Operation failed', 500);
}

// ❌ Bad
const result = await operation();
return result;
```

### Async/Await
```javascript
// ✅ Good
export const fetchData = async (id) => {
  const data = await db.query(id);
  return process(data);
};

// ❌ Bad
export const fetchData = (id) => {
  return db.query(id).then(data => process(data));
};
```

## Documentation

Update docs when you:
- Add a new API endpoint
- Change existing behavior
- Add new configuration
- Fix a bug with unclear cause

Update:
- `README.md` - API changes
- Code comments - Complex logic
- `.env.example` - New variables

## Community

- 💬 Discussions: GitHub Discussions
- 🐛 Issues: GitHub Issues
- 💡 Ideas: GitHub Discussions

## Questions?

Feel free to ask in:
- GitHub Issues
- GitHub Discussions
- Email: [contact info]

---

**Thank you for contributing! 🎉**

Every contribution helps make this project better for everyone.
