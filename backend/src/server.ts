// src/server.ts
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import salesRouter from './routes/sales';
import purchaseRouter from './routes/purchase';
import productionRouter from './routes/production';
import inventoryRouter from './routes/inventory';
import benchmarkRouter from './routes/benchmark';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const prisma = new PrismaClient();

// Simple health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Register routers (all prefixed with /api)
app.use('/api/auth', authRouter);
app.use('/api/sales', salesRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/production', productionRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/benchmark', benchmarkRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend listening on http://localhost:${PORT}`));

export default app;
