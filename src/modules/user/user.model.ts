export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface UserRecord extends User {
    passwordHash: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    passwordHash: string;
}

export interface RegisterUserInput {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
}