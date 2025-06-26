import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import resourceRoutes from './routes/resource.routes';
import { Request, Response, NextFunction } from 'express';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('StudyShare API is running');
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

// Error handling middleware (must have 4 parameters for Express to recognize as error handler)
app.use((
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;