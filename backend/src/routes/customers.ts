// src/routes/customers.ts
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// List customers – MANAGER or ADMIN
router.get(
  '/',
  authorize(['ADMIN', 'MANAGER']),
  asyncHandler(async (_req, res) => {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  })
);

// Get single customer
router.get(
  '/:id',
  authorize(['ADMIN', 'MANAGER']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({ where: { id: Number(id) } });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  })
);

// Create customer – ADMIN only
router.post(
  '/',
  authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    const { name, address, phone } = req.body;
    const newCustomer = await prisma.customer.create({
      data: { name, address, phone },
    });
    res.status(201).json(newCustomer);
  })
);

// Update customer – ADMIN only
router.put(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    const updated = await prisma.customer.update({
      where: { id: Number(id) },
      data: { name, address, phone },
    });
    res.json(updated);
  })
);

// Delete customer – ADMIN only
router.delete(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id: Number(id) } });
    res.status(204).send();
  })
);

export default router;
