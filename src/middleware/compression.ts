import compression from 'compression';
import { Application, Request, Response } from 'express';

export const configureCompression = (app: Application) => {
  app.use(compression({
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 4, // Reduced from 6 to 4 for better performance
    threshold: 512, // Reduced from 1024 to 512 bytes for more aggressive compression
    memLevel: 8, // Added memory level for better compression
    strategy: 0 // Default strategy for balanced compression
  }));
}; 