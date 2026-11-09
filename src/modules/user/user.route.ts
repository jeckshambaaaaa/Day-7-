import { Router } from 'express';

import { UserHandler } from './user.handler.js';

import { registerUserSchema, userIdSchema } from './user.validation.js';

import { validateBody, validateParams } from '../../shared/middlewares/validate.js';

import { asyncHandler } from '../../shared/utils/async-handler.js';

import { updateUserSchema } from './user.validation.js';

import { paginationSchema } from '../../shared/pagination/pagination.validation.js';

import { validateQuery } from '../../shared/middlewares/validate.js';

export const createUserRoutes = (
    userHandler: UserHandler
) => {

    const router = Router();

    // Register
    router.post(
        '/register',
        validateBody(registerUserSchema),
        asyncHandler(userHandler.register)
    );

    // Get All
    router.get(
        '/:id',
        validateParams(userIdSchema),
        asyncHandler(userHandler.getUserById),
    );

    // Get Singel
    router.get(
        '/',
        validateQuery(paginationSchema),
        asyncHandler(userHandler.getAll)
    );

    // Update
    router.patch(
        '/:id',
        validateParams(userIdSchema),
        validateBody(updateUserSchema),
        asyncHandler(userHandler.update)
    );

        router.delete(
        '/:id',
        validateParams(userIdSchema),
        asyncHandler(userHandler.delete)
    );

    return router;

    
};