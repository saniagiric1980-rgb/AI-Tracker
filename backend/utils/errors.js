// Custom error class
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.timestamp = new Date();
    }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[${err.timestamp || new Date().toISOString()}] Error:`, {
        status: statusCode,
        message,
        path: req.path,
        method: req.method,
        userId: req.userId,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            status: statusCode,
            timestamp: err.timestamp || new Date().toISOString(),
        },
    });
};

// 404 handler
export const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.path} not found`,
            status: 404,
        },
    });
};

// Async wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Logger middleware
export const logger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });

    next();
};

// Request validator middleware
export const validateRequest = (schema) => (req, res, next) => {
    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }
        req.validatedData = value;
        next();
    } catch (err) {
        next(err);
    }
};
