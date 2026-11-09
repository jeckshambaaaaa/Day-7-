import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';

export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    const statusCode =
        error instanceof AppError
            ? error.statusCode
            : 500;

    if (statusCode >= 500) {
        console.error(error);
    }

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? 'Internal Server Error'
                : error.message
    });
};