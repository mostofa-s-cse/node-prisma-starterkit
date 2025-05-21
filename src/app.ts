import express, { Application } from 'express';
import passport from 'passport';
import { errorHandler } from './middleware/errorHandler';
import { configureSecurity, loginLimiter } from './middleware/security';
import { configureCompression } from './middleware/compression';
import v1Routes from './routes/v1';
import { logToFile } from './utils/logger';

const app: Application = express();

// Configure security middleware
configureSecurity(app);

// Configure compression
configureCompression(app);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Passport middleware
app.use(passport.initialize());

// API routes
app.use('/api/v1', v1Routes);

// Apply login limiter to auth routes
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth/register', loginLimiter);

// Error handling middleware
app.use(errorHandler);

// Log unhandled errors
process.on('unhandledRejection', (err: Error) => {
  logToFile('app', 'Unhandled Rejection', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  logToFile('app', 'Uncaught Exception', err);
  process.exit(1);
});

export default app;
