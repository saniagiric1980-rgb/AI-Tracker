export const config = {
    // Server
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // JWT
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: '7d',

    // Gemini AI
    GEMINI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
    GEMINI_MODEL: 'gemini-2.5-flash',

    // Defaults
    DEFAULT_CURRENCY: 'USD',
    DEFAULT_TIMEZONE: 'UTC',
    MAX_RESULTS_PER_PAGE: 100,
    DEFAULT_PAGE_SIZE: 20,

    // Budget alerts
    BUDGET_ALERT_THRESHOLDS: {
        INFO: 0.7,      // 70%
        WARNING: 1.0,   // 100%
        CRITICAL: 1.1,  // 110%
    },

    // Constraints
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 128,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_CATEGORY_NAME_LENGTH: 50,

    // Validation
    VALID_TRANSACTION_TYPES: ['income', 'expense'],
    VALID_BUDGET_PERIODS: ['weekly', 'monthly', 'yearly'],
    VALID_CURRENCIES: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'],
};

export default config;
