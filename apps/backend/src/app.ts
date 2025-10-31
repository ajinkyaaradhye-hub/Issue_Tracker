import express from 'express';
import { applySecurityMiddleware } from './middleware/security/security.middleware';
import { authRoutes } from './routes/auth/auth.routes';
import { issueRoutes } from './routes/issues/issue.routes';

const app = express();
app.use(express.json());

applySecurityMiddleware(app);

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
export default app;
