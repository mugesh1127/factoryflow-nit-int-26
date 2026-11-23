// src/utils/cookies.ts
import { Response } from 'express';

export const setTokenCookie = (res: Response, token: string) => {
  // HttpOnly cookie, sameSite strict for security
  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    // In Docker/local dev we use http, so not setting secure flag
    // In production you would set secure: true
    maxAge: 60 * 60 * 1000, // 1 hour
  });
};

export const clearTokenCookie = (res: Response) => {
  res.clearCookie('access_token');
};
