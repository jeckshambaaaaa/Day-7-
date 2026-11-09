import bcrypt from 'bcryptjs';

import type { IUserRepository } from './user.repository.js';

import type {
    User,
    RegisterUserInput
} from './user.model.js';

import { AppError } from '../../shared/errors/app-error.js';

import type { UpdateUserData } from './user.model.js';

import type {
    PaginationParams,
    PaginationData,
    PaginationResult,
} from '../../shared/pagination/pagination.model.js';

import { createPaginationResult } from '../../shared/pagination/pagination.util.js';

export class RegisterUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        input: RegisterUserInput
    ): Promise<User> {

        const email = input.email.trim().toLowerCase();

        // Check duplicate email
        const existingUser =
            await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new AppError(
                'Email sudah terdaftar',
                409
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(
            input.password,
            12
        );

        // Save user
        const user = await this.userRepository.create({
            name: input.name.trim(),
            email,
            passwordHash
        });

        return user;
    }
}
export class GetUserByIdUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        id: string
    ): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError('User tidak ditemukan', 404);
        }

        return user;
    }
}

export class UpdateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        id: string,
        input: UpdateUserData
    ): Promise<User> {

    // Check existing user
    const existingUser = 
      await this.userRepository.findById(id);

    if (!existingUser) {
      throw new AppError(
        'User tidak ditemukan',
        404
      );
    }

    // Check duplicate email
    if (input.email) {

      const emailUser = 
        await this.userRepository.findByEmail(input.email);

      if (emailUser && emailUser.id !== id) {
        throw new AppError(
          'Email sudah digunakan oleh user lain',
          409
        );
      }
    }

    // Update user
    const updatedUser = 
      await this.userRepository.update(id, input);

    if (!updatedUser) {
      throw new AppError(
        'Gagal memperbarui user',
        500
      );
    }

    return updatedUser;
    }
}

export class DeleteUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        id: string
    ): Promise<void> {
        const deleted = await this.userRepository.delete(id);

        if (!deleted) {
            throw new AppError(
                'User tidak ditemukan',
                404
            );
        }
    }
}

export class GetAllUsersUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        params: PaginationParams
    ): Promise<PaginationResult<User>> {

        const results = await this.userRepository.findAll(params);

        return createPaginationResult(
            results,
            params
        );
    };

}