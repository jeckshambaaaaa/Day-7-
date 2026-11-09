import type {
    Request,
    Response,
    NextFunction
} from 'express';

import type { ZodSchema } from 'zod';

import { AppError } from '../errors/app-error.js';

export const validateBody = (schema: ZodSchema) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            const messages = result.error.issues.map(
                (issue) => issue.message
            );

            return next(
                new AppError(messages.join(', '), 400)
            );
        }

        req.body = result.data;

        next();
    };
};

export const validateParams = (schema: ZodSchema) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = schema.safeParse(req.params);

        if (!result.success) {

            const messages = result.error.issues.map(
                (issue) => issue.message
            );

            return next(
                new AppError(messages.join(', '), 400)
            );
        }
        
        next();
    };
};

export const validateQuery = (schema: ZodSchema) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = schema.safeParse(req.query);

        if (!result.success) {

            const messages = result.error.issues.map(
                (issue) => issue.message
            );

            return next(
                new AppError(messages.join(', '), 400)
            );
        }

        res.locals.validatedQuery = result.data;

        next();
    };

};