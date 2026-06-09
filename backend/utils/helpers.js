// Helper to send standardized success responses
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

// Helper to send standardized error responses
export const sendError = (res, error, message = 'An error occurred', statusCode = 500) => {
    console.error('Error:', error);
    res.status(statusCode).json({
        success: false,
        message,
        error: error.message || error,
    });
};

// Validate required fields in request body
export const validateRequired = (data, fields) => {
    const missing = fields.filter((field) => !data[field]);
    return missing.length > 0 ? missing : null;
};

// Format currency amount
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

// Calculate percentage change
export const calculatePercentChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

// Calculate date range (start and end of month/week)
export const getDateRange = (type = 'month') => {
    const now = new Date();

    if (type === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
    }

    if (type === 'week') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { start, end };
    }

    if (type === 'year') {
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return { start, end };
    }

    return { start: now, end: now };
};

// Parse pagination params
export const getPagination = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};
