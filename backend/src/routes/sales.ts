// src/routes/sales.ts
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// List sales orders – MANAGER or ADMIN
router.get(
  '/',
  authorize(['ADMIN', 'MANAGER']),
  asyncHandler(async (_req, res) => {
    const orders = await prisma.salesOrder.findMany({ include: { items: true, customer: true } });
    res.json(orders);
  })
);

// Get single order
router.get(
  '/:id',
  authorize(['ADMIN', 'MANAGER']),
  asyncHandler(async (req, res) => {
    const order = await prisma.salesOrder.findUnique({
      where: { id: Number(req.params.id) },
      include: { items: true, customer: true, invoice: true },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  })
);

// Create order – MANAGER
router.post(
  '/',
  authorize(['ADMIN', 'MANAGER']),
  asyncHandler(async (req, res) => {
    const { customerId, items } = req.body; // items: [{ productId, qty, rate }]
    const total = items.reduce((sum, i) => sum + Number(i.qty) * Number(i.rate), 0);
    const order = await prisma.salesOrder.create({
      data: {
        customerId,
        total,
        items: { create: items },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  })
);

// Update order – ADMIN only
router.put(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    const { items, status } = req.body;
    const updated = await prisma.salesOrder.update({
      where: { id: Number(req.params.id) },
      data: { status, items: { deleteMany: {}, create: items } },
      include: { items: true },
    });
    res.json(updated);
  })
);

// Delete order – ADMIN only
router.delete(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    await prisma.salesOrder.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  })
);

export default router;
