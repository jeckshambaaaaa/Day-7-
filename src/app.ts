import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import apiRoutes from './routes/index.js';

import { errorHandler } from './shared/middlewares/error-handler.js';

import { AppError } from './shared/errors/app-error.js';

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// Health check
app.get('/health', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'API is running'
    });

});

// API routes
app.use('/api/v1', apiRoutes);

// Not found
app.use((req, res, next) => {

    next(
        new AppError('Endpoint tidak ditemukan', 404)
    );

});

// Global error handler
app.use(errorHandler);

export default app;