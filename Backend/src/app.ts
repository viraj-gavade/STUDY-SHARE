import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import resourceRoutes from './routes/resource.routes';
import userRoutes from './routes/user.router';
import { Request, Response, NextFunction } from 'express';

// Load env vars
dotenv.config();

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ CORS should be the FIRST thing
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

// ✅ JSON + URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Security headers AFTER CORS
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('StudyShare API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;
