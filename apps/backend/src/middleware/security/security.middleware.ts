import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';
import compression from 'compression';
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL || '',
];

export const applySecurityMiddleware = (app: Express) => {
  app.use(helmet());

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    })
  );

  app.use(compression());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later.',
    })
  );
};
