import { Request } from 'express';
import { UserRole } from './role.enum';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
