import pg from 'pg';
import { env } from '../../config/env.js';

const { Pool } = pg;

export const postgres = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

postgres.on('error', (error) => {
    console.error('Unexpected PostgreSQL error:', error);
});