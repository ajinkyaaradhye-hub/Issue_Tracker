import { Response } from 'express';
import { ZodError } from 'zod';

export const sendErrorResponse = (res: Response, statusCode: number, error: unknown) => {
  if (error instanceof ZodError) {
    return res.status(statusCode).json({ errors: error.issues });
  }

  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return res.status(statusCode).json({ message });
};
