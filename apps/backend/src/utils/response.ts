import { Response } from 'express';

export const sendError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, message });
};

export const sendSuccess = (res: Response, data: unknown, message?: string) => {
  return res.status(200).json({ success: true, message, data });
};
