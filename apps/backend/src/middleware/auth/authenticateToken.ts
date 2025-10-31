import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../../types/auth.types';
import { sendError } from '../../utils/response';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return sendError(res, 401, 'Access token missing');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return sendError(res, 401, 'Invalid or expired token');
    req.user = user as AuthRequest['user'];
    next();
  });
};
