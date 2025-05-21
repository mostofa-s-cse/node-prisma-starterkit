import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { PrismaClient } from '@prisma/client';
import { logToFile } from '../utils/logger';

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const protect = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as JwtPayload;

    // 3) Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    // 4) Check if user has any valid refresh tokens
    const hasValidToken = await prisma.refreshToken.findFirst({
      where: { 
        userId: user.id,
        expiresAt: { gt: new Date() }
      }
    });

    if (!hasValidToken) {
      return next(new AppError('Session expired, please login again', 401));
    }

    // Grant access to protected route
    req.user = user;
    logToFile('auth', `User authenticated successfully (ID: ${decoded.id})`);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token, please login again', 401));
    }
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const userRoles = (req.user as any).roles.map((role: any) => role.name);
    
    if (!roles.some(role => userRoles.includes(role))) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
}; 