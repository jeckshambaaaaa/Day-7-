import app from './app.js';

import { env } from './config/env.js';

import { postgres } from './infrastructure/database/postgres.js';

const startServer = async () => {

    try {

        // Test PostgreSQL connection
        await postgres.query('SELECT 1');

        console.log('PostgreSQL connected successfully');

        const server = app.listen(env.PORT, () => {

            console.log(
                `Server running at http://localhost:${env.PORT}`
            );

        });

        const shutdown = async () => {

            console.log('Shutting down server...');

            server.close(async () => {

                await postgres.end();

                console.log('Server and database connections closed');

                process.exit(0);

            });

        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {

        console.error('Failed to start application:', error);

        await postgres.end();

        process.exit(1);

    }

};

startServer();