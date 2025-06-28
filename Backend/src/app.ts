import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import resourceRoutes from './routes/resource.routes';
import userRoutes from './routes/user.router';
import { Request, Response, NextFunction } from 'express';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  // Allow requests from your frontend origin
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  // Allow credentials to be sent with requests (cookies, etc.)
  credentials: true,
  // Set allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  // Set allowed HTTP headers
  allowedHeaders: ['Content-Type', 'Authorization','Referrer-Policy'],
}));

// Set security headers
app.use((req, res, next) => {
  // Control how much referrer information is included with requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Help protect against XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('StudyShare API is running');
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);

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