// src/validation/issue.schema.ts
import { z } from 'zod';

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createIssueSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(5, 'Description must be at least 5 characters long'),
  priority: PriorityEnum,
});

export const updateIssueSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  priority: PriorityEnum.optional(),
});
