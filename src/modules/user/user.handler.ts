import type {
    Request,
    Response
} from 'express';

import type { RegisterUserInput } from './user.model.js';

import { GetUserByIdUseCase, RegisterUserUseCase } from './user.usecase.js';

import type { UpdateUserData } from './user.model.js';

import { UpdateUserUseCase } from './user.usecase.js';

import { DeleteUserUseCase } from './user.usecase.js';

import type { GetAllUsersUseCase } from './user.usecase.js';

import type { PaginationQuery } from '../../shared/pagination/pagination.validation.js';

import { getPaginationParams } from '../../shared/pagination/pagination.util.js';

export class UserHandler {

    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase
    ) {}

    // Register User
    register = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const input = req.body as RegisterUserInput;

        const user = await this.registerUserUseCase.execute(
            input
        );

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: user
        });
    };

    getUserById = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const id = req.params.id;
 
        if (typeof id !== "string") {
            throw new Error("Invalid user ID");
        }
 
        const user = await this.getUserByIdUseCase.execute(id);
 
        res.status(200).json({
            success: true,
            message: 'Registrasi berhasil',
            data: user
        });
    };

    update = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const id = req.params.id;

        if (typeof id !== "string") {
            throw new Error("Invalid user ID");
        }   

        const input = req.body as UpdateUserData;

        const user = await this.updateUserUseCase.execute(
            id,
            input
        );

        res.status(200).json({
            success: true,
            message: 'User berhasil diperbarui',
            data: user
        });
    };

    delete = async (
    req: Request,
    res: Response
    ): Promise<void> => {
        const id = req.params.id;
    
        if (typeof id !== 'string') {
            throw new Error('Invalid user ID');
        }
    
        await this.deleteUserUseCase.execute(id);
    
        res.status(200).json({
            success: true,
            message: 'User berhasil dihapus'
        });
    };

    getAll = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const query = res.locals.validatedQuery as PaginationQuery;

        const params = getPaginationParams(
            query.page,
            query.limit
        );

        const result = await this.getAllUsersUseCase.execute(
            params
        );

        res.status(200).json({
            success: true,
            message: 'Data user berhasil ditemukan',
            data: result.data,
            pagination: result.pagination
        });
    };
}