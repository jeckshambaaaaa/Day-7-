import type {
    User,
    UserRecord,
    CreateUserData,
    UpdateUserData
} from './user.model.js';

import type {
    PaginationParams,
    PaginationData,
} from '../../shared/pagination/pagination.model.js';

export interface IUserRepository {

    findByEmail(
        email: string
    ): Promise<UserRecord | null>;

    create(
        data: CreateUserData
    ): Promise<User>;

    findById(
        id: string
    ): Promise<UserRecord | null>;

    update(
        id: string,
        data: UpdateUserData
    ): Promise<User | null>;

    delete(
        id: string
    ): Promise<boolean>;

    findAll(
        params: PaginationParams
    ): Promise<PaginationData<User>>;

    findById(id: string): Promise<User | null>;

    findByEmail(email: string): Promise<UserRecord | null>;

    create(data: CreateUserData): Promise<User>;

    update(
        id: string, 
        data: UpdateUserData
    ): Promise<User | null>;

    delete(id: string): Promise<boolean>;
    

}