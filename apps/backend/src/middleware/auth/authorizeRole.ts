import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/auth.types';
import { UserRole } from '../../types/role.enum';
import { sendError } from '../../utils/response';

export const authorizeRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: insufficient permissions');
    }
    next();
  };
};
