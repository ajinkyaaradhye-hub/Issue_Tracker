import express from 'express';
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from '../../controllers/issues/issue.controller';
import { authenticateToken } from '../../middleware/auth/authenticateToken';
import { authorizeRole } from '../../middleware/auth/authorizeRole';
import { UserRole } from '../../types/role.enum';

export const issueRoutes = express.Router();

issueRoutes.use(authenticateToken);

issueRoutes.get('/', getAllIssues);
issueRoutes.get('/:id', getIssueById);
issueRoutes.post('/', createIssue);
issueRoutes.put(
  '/:id',
  authorizeRole(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  updateIssue
);
issueRoutes.delete(
  '/:id',
  authorizeRole(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  deleteIssue
);
