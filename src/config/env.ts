import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    PORT: z.coerce.number().default(3000),

    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().default(5432),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1)
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error('Invalid environment configuration:', result.error.flatten());
    process.exit(1);
}

export const env = result.data;