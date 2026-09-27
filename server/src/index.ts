import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { reviewRouter } from './routes/review.js';
import { healthRouter } from './routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/review', reviewRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║     AI Code Reviewer API                  ║
  ║     Running on http://localhost:${PORT}      ║
  ║     Provider: ${process.env.AI_PROVIDER || 'groq'}                      ║
  ╚═══════════════════════════════════════════╝
  `);
});

export default app;
