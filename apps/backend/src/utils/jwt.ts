import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: AuthUser) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: AuthUser) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): AuthUser => {
  return jwt.verify(token, JWT_SECRET) as AuthUser;
};

export const verifyRefreshToken = (token: string): AuthUser => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as AuthUser;
};
