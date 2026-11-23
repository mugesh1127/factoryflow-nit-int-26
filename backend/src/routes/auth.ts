// src/routes/auth.ts
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { setTokenCookie, clearTokenCookie } from '../utils/cookies';

const router = Router();
const prisma = new PrismaClient();

// Register – admin only (placeholder, real admin check done via middleware later)
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role },
    });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    setTokenCookie(res, token);
    res.json({ id: user.id, email: user.email, role: user.role });
  })
);

// Login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    setTokenCookie(res, token);
    res.json({ id: user.id, email: user.email, role: user.role });
  })
);

// Logout
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    clearTokenCookie(res);
    res.json({ message: 'Logged out' });
  })
);

export default router;
