import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import type { IUserRepository } from './user.repository.js';

import type {
    User,
    UserRecord,
    CreateUserData,
} from './user.model.js';

import { AppError } from '../../shared/errors/app-error.js';

import { UpdateUserData } from './user.model.js';

import type {
    PaginationParams,
    PaginationData,
} from '../../shared/pagination/pagination.model.js';
 
export class PostgresUserRepository
implements IUserRepository {

    constructor(private readonly db: Pool) {}

    async findByEmail(
        email: string
    ): Promise<UserRecord | null> {

        const result = await this.db.query(
            `
            SELECT
                id,
                name,
                email,
                password_hash AS "passwordHash",
                created_at AS "createdAt"
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        return result.rows[0] ?? null;
    }

    async create(
        data: CreateUserData
    ): Promise<User> {

        const id = randomUUID();

        try {

            const result = await this.db.query(
                `
                INSERT INTO users (
                    id,
                    name,
                    email,
                    password_hash
                )
                VALUES ($1, $2, $3, $4)

                RETURNING
                    id,
                    name,
                    email,
                    created_at AS "createdAt"
                `,
                [
                    id,
                    data.name,
                    data.email,
                    data.passwordHash
                ]
            );

            return result.rows[0] as User;

        } catch (error: unknown) {

            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === '23505'
            ) {
                throw new AppError(
                    'Email sudah terdaftar',
                    409
                );
            }

            throw error;
        }
    }

    async findById(
        id: string
    ): Promise<UserRecord | null> {

        const result = await this.db.query(
            `
            SELECT
                id,
                name,
                email,
                password_hash AS "passwordHash",
                created_at AS "createdAt"
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0] ?? null;
    }

    
    async update(
        id: string,
        data: UpdateUserData
    ): Promise<User | null> {

        const fields: string[] = [];
        const values: unknown[] = [id];

        // Jika nama dikirim, masukkan ke query
        if (data.name !== undefined) {
            values.push(data.name);
            fields.push(`name = $${values.length}`);
        }

        // Jika email dikirim, masukkan ke query
        if (data.email !== undefined) {
            values.push(data.email);
            fields.push(`email = $${values.length}`);
        }

        // Jika tidak ada data yang diubah
        if (fields.length === 0) {
            return null;
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');

        try {

            const result = await this.db.query(
                `
                UPDATE users
                SET ${fields.join(', ')}
                WHERE id = $1
                RETURNING
                    id,
                    name,
                    email,
                    created_at AS "createdAt"
                `,
                values
            );

            return result.rows[0] ?? null;

        } catch (error: unknown) {

            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === '23505'
            ) {
                throw new AppError(
                    'Email sudah digunakan oleh user lain',
                    409
                );
            }

            throw error;
        }
    }

    async delete(
        id: string
    ): Promise<boolean> {
        const result = await this.db.query(
            `
            DELETE FROM users
            WHERE id = $1
            `,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;

    }

    async findAll(
        params: PaginationParams
    ): Promise<PaginationData<User>> {

        const countresult = await this.db.query(
            `
            SELECT COUNT(*) AS total
            FROM users
            `
        );

        const totalItems = Number(
            countresult.rows[0].total
        );

        const result = await this.db.query(
            `
            SELECT
                id,
                name,
                email,
                created_at AS "createdAt"
            FROM users
            ORDER BY created_at DESC, ID DESC
            LIMIT $1 
            OFFSET $2
            `,
            [
                params.limit,
                params.offset
            ]
        );

        return {
            items: result.rows as User[],
            totalItems,
        };

    };
}